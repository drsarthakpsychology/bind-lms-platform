"""Voice gateway (Azure) - scale-to-zero manager + OpenAI-compatible TTS proxy.

Runs on a tiny always-on B1s VM with a managed identity (no secrets on disk).
It owns the stable CHATTERBOX_URL the LiveKit worker calls, and:

  - When a synthesis request arrives and the GPU VM is DEALLOCATED, it STARTS
    the NCasT4_v3 VM, then returns 503 "warming" for that request - the
    worker's tts.FallbackAdapter serves the natural Cartesia voice for that
    one turn. Later turns (GPU now warm) use Chatterbox.
  - When the GPU is running it proxies the SSE stream to its private IP.
  - After IDLE_SECONDS without a request it DEALLOCATES the GPU (scale to zero).

Cost: the gateway is ~$10/mo; the GPU bills only while a practice burst is live.
"""
import asyncio
import os
import time
import httpx
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from azure.identity import DefaultAzureCredential
from azure.mgmt.compute import ComputeManagementClient

SUBSCRIPTION_ID = os.environ["AZURE_SUBSCRIPTION_ID"]
RESOURCE_GROUP = os.environ["AZURE_RESOURCE_GROUP"]
GPU_VM = os.environ["GPU_VM_NAME"]
GPU_PRIVATE_IP = os.environ["GPU_PRIVATE_IP"]  # static private IP
GPU_PORT = int(os.environ.get("GPU_PORT", "4123"))
AUTH_TOKEN = os.environ.get("CHATTERBOX_AUTH_TOKEN", "")
IDLE_SECONDS = int(os.environ.get("IDLE_SECONDS", "480"))  # 8 min

cred = DefaultAzureCredential()
compute = ComputeManagementClient(cred, SUBSCRIPTION_ID)

app = FastAPI()
_state = {"gpu": "unknown", "last_request": time.time(), "warming_started": None}


def _gpu_state() -> str:
    try:
        inst = compute.virtual_machines.get(RESOURCE_GROUP, GPU_VM, expand="instanceView")
        for st in inst.instance_view.statuses or []:
            if st.code and st.code.startswith("PowerState/"):
                s = st.code.split("/")[1]
                _state["gpu"] = "running" if s == "running" else ("deallocated" if s in ("deallocated", "stopped") else s)
                return _state["gpu"]
    except Exception as e:
        print("state error", e, flush=True)
        _state["gpu"] = "error"
    return _state["gpu"]


def _start_gpu():
    _state["warming_started"] = time.time()
    _state["gpu"] = "starting"
    try:
        compute.virtual_machines.begin_start(RESOURCE_GROUP, GPU_VM)
        print("gpu start requested", flush=True)
    except Exception as e:
        print("start error", e, flush=True)
        _state["gpu"] = "error"


def _deallocate_gpu():
    try:
        compute.virtual_machines.begin_deallocate(RESOURCE_GROUP, GPU_VM)
        _state["gpu"] = "deallocating"
        print("gpu deallocated (idle)", flush=True)
    except Exception as e:
        print("deallocate error", e, flush=True)


@app.on_event("startup")
def startup():
    _gpu_state()
    asyncio.get_event_loop().create_task(_idle_watch())


@app.get("/healthz")
def health():
    return {"ok": True, "gateway": "chatterbox-scale-to-zero", "gpu": _state["gpu"]}


@app.get("/status")
def status():
    return _state


@app.post("/v1/audio/speech")
async def speech(req: Request):
    _state["last_request"] = time.time()
    body = await req.json()
    _gpu_state()

    if _state["gpu"] == "running":
        proxy = await _stream_from_gpu(body)
        if proxy is not None:
            return proxy
        _state["gpu"] = "starting"  # reported running but not accepting yet

    if _state["gpu"] == "deallocated":
        _start_gpu()
    asyncio.create_task(_poll_until_ready())
    return StreamingResponse(iter(["data: [DONE]\n\n"]), media_type="text/event-stream", status_code=503)


async def _stream_from_gpu(payload: dict) -> StreamingResponse | None:
    url = f"http://{GPU_PRIVATE_IP}:{GPU_PORT}/v1/audio/speech"
    headers = {"Content-Type": "application/json"}
    if AUTH_TOKEN:
        headers["Authorization"] = f"Bearer {AUTH_TOKEN}"
    client = httpx.AsyncClient(timeout=10)
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
        if _gpu_state() == "running":
            try:
                async with httpx.AsyncClient(timeout=5) as c:
                    r = await c.get(f"http://{GPU_PRIVATE_IP}:{GPU_PORT}/healthz")
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
            _deallocate_gpu()
