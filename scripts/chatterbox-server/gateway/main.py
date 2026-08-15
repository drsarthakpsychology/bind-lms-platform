"""Voice gateway — scale-to-zero manager + OpenAI-compatible TTS proxy.

Runs on a tiny always-on t3.nano with an IAM role (no secrets on disk). It
owns the stable CHATTERBOX_URL the LiveKit worker calls, and:

  - When a synthesis request arrives and the GPU is stopped, it STARTS the
    g4dn.xlarge spot instance, then returns 503 "warming" for that request —
    the worker's tts.FallbackAdapter serves a natural Cartesia voice for that
    one turn, so the student hears a human voice immediately. Subsequent turns
    (GPU now warm) use Chatterbox.
  - When the GPU is warm it proxies the SSE stream straight through.
  - After IDLE_SECONDS without a request it STOPS the GPU (scale to zero).

Cost: the gateway is ~$4/mo; the GPU runs only while a practice burst is live.
"""
import asyncio
import json
import os
import time
import boto3
import httpx
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse

GPU_INSTANCE_ID = os.environ["GPU_INSTANCE_ID"]
GPU_PORT = int(os.environ.get("GPU_PORT", "4123"))
AUTH_TOKEN = os.environ.get("CHATTERBOX_AUTH_TOKEN", "")
IDLE_SECONDS = int(os.environ.get("IDLE_SECONDS", str(20 * 60)))

ec2 = boto3.client("ec2", region_name=os.environ.get("AWS_REGION", "ap-south-1"))
app = FastAPI()

_state = {"gpu": "unknown", "last_request": time.time(), "warming_started": None}
GPU_HOST = None  # filled by describe-instances


def _gpu_ip() -> str | None:
    global GPU_HOST
    try:
        r = ec2.describe_instances(InstanceIds=[GPU_INSTANCE_ID])
        inst = r["Reservations"][0]["Instances"][0]
        GPU_HOST = inst.get("PublicIpAddress") or inst.get("PrivateIpAddress")
        state = inst["State"]["Name"]
        _state["gpu"] = state
        return GPU_HOST
    except Exception as e:  # pragma: no cover
        _state["gpu"] = "error"
        print("describe error", e, flush=True)
        return None


def _start_gpu():
    _state["warming_started"] = time.time()
    _state["gpu"] = "starting"
    try:
        ec2.start_instances(InstanceIds=[GPU_INSTANCE_ID])
    except Exception as e:
        print("start error", e, flush=True)
        _state["gpu"] = "error"


def _stop_gpu():
    try:
        ec2.stop_instances(InstanceIds=[GPU_INSTANCE_ID])
        _state["gpu"] = "stopping"
        print("gpu stopped (idle)", flush=True)
    except Exception as e:
        print("stop error", e, flush=True)


@app.on_event("startup")
def startup():
    _gpu_ip()
    asyncio.get_event_loop().create_task(_idle_watch())


@app.get("/healthz")
def health():
    return {"ok": True, "gateway": "chatterbox-scale-to-zero", "gpu": _state["gpu"], "gpu_ip": GPU_HOST}


@app.get("/status")
def status():
    return _state


@app.post("/v1/audio/speech")
async def speech(req: Request):
    _state["last_request"] = time.time()
    body = await req.json()

    _gpu_ip()  # refresh state + IP each request
    if _state["gpu"] == "running" and GPU_HOST:
        proxy = await _stream_from_gpu(GPU_HOST, body)
        if proxy is not None:
            return proxy
        # Proxy failed — the GPU reported running but isn't accepting yet
        # (boot race). Treat as warming; this request falls back.
        _state["gpu"] = "starting"

    # GPU is off / starting. Wake it; this request falls back (worker has a
    # natural Cartesia fallback), later turns use Chatterbox.
    if _state["gpu"] == "stopped":
        _start_gpu()
    # warm the cache: poll for readiness in the background
    asyncio.create_task(_poll_until_ready())
    return StreamingResponse(iter(["data: [DONE]\n\n"]), media_type="text/event-stream", status_code=503)


async def _stream_from_gpu(ip: str, payload: dict) -> StreamingResponse | None:
    url = f"http://{ip}:{GPU_PORT}/v1/audio/speech"
    headers = {"Content-Type": "application/json"}
    if AUTH_TOKEN:
        headers["Authorization"] = f"Bearer {AUTH_TOKEN}"
    client = httpx.AsyncClient(timeout=10)

    # Connect eagerly so a GPU that isn't accepting yet surfaces as None here
    # (clean 503) instead of a mid-stream stack trace.
    try:
        upstream = await client.send(client.build_request("POST", url, json=payload, headers=headers), stream=True)
    except httpx.HTTPError:
        await client.aclose()
        return None
    if upstream.status_code != 200:
        await upstream.aclose()
        await client.aclose()
        return None

    async def gen():
        try:
            async for chunk in upstream.aiter_bytes():
                yield chunk
        finally:
            await upstream.aclose()
            await client.aclose()

    return StreamingResponse(gen(), media_type="text/event-stream")


async def _poll_until_ready():
    for _ in range(60):  # up to ~5 min
        await asyncio.sleep(5)
        _gpu_ip()
        if _state["gpu"] == "running" and GPU_HOST:
            try:
                async with httpx.AsyncClient(timeout=5) as c:
                    r = await c.get(f"http://{GPU_HOST}:{GPU_PORT}/healthz")
                    if r.status_code == 200:
                        _state["gpu"] = "warm"
                        print("gpu warm", flush=True)
                        return
            except Exception:
                pass
    print("gpu never became warm in time", flush=True)


async def _idle_watch():
    while True:
        await asyncio.sleep(60)
        if _state["gpu"] in ("running", "warm") and time.time() - _state["last_request"] > IDLE_SECONDS:
            _stop_gpu()
