"""Production Chatterbox-Turbo server - OpenAI-compatible /v1/audio/speech (SSE, PCM16).

This is the exact endpoint the LiveKit ChatterboxTTS plugin consumes
(livekit-agent/chatterbox-tts.ts). Deployed on a single g4dn.xlarge (T4) via
scripts/chatterbox-server/deploy.sh - see docs/CHATTERBOX_AWS_DEPLOY.md.

Design:
  - Loads ChatterboxTurboTTS once at startup (the built-in voice from conds.pt).
  - A small semaphore caps concurrent generations so a burst of students can't
    OOM the 16 GB T4 - each student's turn is ~2-3.5 s of GPU, and turns are
    spaced seconds apart, so a single T4 comfortably serves 5-10 students.
  - Streams base64 PCM16 in `response.output_audio.delta` SSE events, exactly
    matching the plugin's parser, then `data: [DONE]`.

Run:  uvicorn main:app --host 0.0.0.0 --port 4123
"""
import base64
import json
import os
import threading
import time
import torch
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse

device = "cuda" if torch.cuda.is_available() else "cpu"
# Cap concurrent generations (the T4 has room; this prevents an OOM tail).
CONCURRENCY = int(os.environ.get("CHATTERBOX_CONCURRENCY", "4"))
MODEL = os.environ.get("CHATTERBOX_MODEL", "turbo")  # "turbo" or "nano"
# If set, the client must send `Authorization: Bearer <token>`. The security
# group is open to LiveKit Cloud's egress, so this is the actual gate.
AUTH_TOKEN = os.environ.get("CHATTERBOX_AUTH_TOKEN", "")

app = FastAPI()
_semaphore = threading.Semaphore(CONCURRENCY)
_model = None
_gen_lock = threading.Lock()


def load_model():
    global _model
    from chatterbox_ng.tts_turbo import ChatterboxTurboTTS
    # If CHATTERBOX_MODEL_DIR is set, load from a pre-downloaded checkpoint;
    # otherwise the first request triggers the HuggingFace download (slow).
    ckpt = os.environ.get("CHATTERBOX_MODEL_DIR")
    if ckpt and os.path.isdir(ckpt):
        _model = ChatterboxTurboTTS.from_local(ckpt, device)
    else:
        # Resolve via the HF cache. token=False works for the public repo;
        # from_pretrained's `or True` would demand a token, so download via
        # snapshot_download(token=False) ourselves.
        from huggingface_hub import snapshot_download
        path = snapshot_download(repo_id="ResembleAI/chatterbox-turbo", token=False)
        _model = ChatterboxTurboTTS.from_local(path, device)
    print(f"[server] loaded Chatterbox-{MODEL} on {device}, sr={_model.sr}", flush=True)


@app.on_event("startup")
def startup():
    load_model()


@app.get("/healthz")
def health():
    return {"ok": True, "model": f"chatterbox-{MODEL}", "device": device, "sr": _model.sr}


@app.post("/v1/audio/speech")
async def speech(req: Request):
    if AUTH_TOKEN:
        auth = req.headers.get("authorization", "")
        if auth != f"Bearer {AUTH_TOKEN}":
            return StreamingResponse(iter(["data: [DONE]\n\n"]), media_type="text/event-stream", status_code=401)
    body = await req.json()
    text = str(body.get("input", "")).strip()
    if not text:
        return StreamingResponse(iter(["data: [DONE]\n\n"]), media_type="text/event-stream")

    def gen():
        with _semaphore:
            t0 = time.time()
            with _gen_lock:
                wav = _model.generate(text)
                wav = wav.detach().cpu()
            print(f"[server] {len(text)} chars -> {wav.shape[-1]/_model.sr:.1f}s audio in {time.time()-t0:.1f}s", flush=True)
            pcm = (wav.float() * 32767).clamp(-32768, 32767).short().numpy().tobytes()
            # Stream in a few chunks so the plugin + pipeline stream to the
            # student before synthesis finishes (realtime feel).
            step = max(1, len(pcm) // 4)
            for i in range(0, len(pcm), step):
                chunk = pcm[i:i + step]
                ev = {
                    "type": "response.output_audio.delta",
                    "index": 0,
                    "audio": base64.b64encode(chunk).decode(),
                    "format": "pcm16",
                    "sample_rate": _model.sr,
                }
                yield f"data: {json.dumps(ev)}\n\n"
            yield "data: [DONE]\n\n"

    return StreamingResponse(gen(), media_type="text/event-stream")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "4123")))
