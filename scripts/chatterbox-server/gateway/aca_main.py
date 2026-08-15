"""ACA gateway - a tiny always-on CPU proxy in front of the scale-to-zero GPU app.

The GPU app (ACA Consumption GPU T4) scales to zero; when it is cold the first
request takes ~60-90s to warm. This gateway owns the stable CHATTERBOX_URL and:

  - proxies to the GPU app's internal FQDN when it is warm;
  - returns a fast 503 while the GPU app is cold/starting, so the worker's
    tts.FallbackAdapter serves the natural Cartesia voice for that turn and
    Chatterbox takes over on the next turn.

It is intentionally dumb (no Azure SDK) - ACA handles all scaling.
"""
import os
import time
import httpx
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse

GPU_APP = os.environ.get("GPU_APP_URL", "http://chatterbox-gpu")
GPU_PORT = int(os.environ.get("GPU_PORT", "4123"))
AUTH_TOKEN = os.environ.get("CHATTERBOX_AUTH_TOKEN", "")
WARM_TIMEOUT = float(os.environ.get("WARM_TIMEOUT", "8"))  # allow a warm GPU this long

app = FastAPI()
_state = {"gpu": "unknown", "last_ok": 0}


@app.get("/healthz")
def health():
    return {"ok": True, "gateway": "aca-chatterbox", "gpu": _state["gpu"]}


@app.get("/status")
def status():
    return _state


@app.post("/{full_path:path}")
async def speech(req: Request, full_path: str = ""):
    _state["last_request"] = time.time()
    url = f"{GPU_APP}:{GPU_PORT}/v1/audio/speech"
    headers = {"Content-Type": "application/json"}
    if AUTH_TOKEN:
        headers["Authorization"] = f"Bearer {AUTH_TOKEN}"
    body = await req.json()
    client = httpx.AsyncClient(timeout=WARM_TIMEOUT)
    try:
        upstream = await client.send(
            client.build_request("POST", url, json=body, headers=headers), stream=True
        )
    except httpx.HTTPError:
        await client.aclose()
        _state["gpu"] = "cold"
        # GPU is cold/starting - worker falls back to Cartesia for this turn.
        return StreamingResponse(iter(["data: [DONE]\n\n"]), media_type="text/event-stream", status_code=503)

    if upstream.status_code != 200:
        await upstream.aclose()
        await client.aclose()
        _state["gpu"] = "cold"
        return StreamingResponse(iter(["data: [DONE]\n\n"]), media_type="text/event-stream", status_code=503)

    _state["gpu"] = "warm"
    _state["last_ok"] = time.time()

    async def gen():
        try:
            async for chunk in upstream.aiter_bytes():
                yield chunk
        finally:
            await upstream.aclose()
            await client.aclose()

    return StreamingResponse(gen(), media_type="text/event-stream")
