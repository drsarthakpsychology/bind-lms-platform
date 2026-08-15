"""Chatterbox-Turbo OpenAI-compatible TTS server (Azure Container Apps GPU).

DIAGNOSTIC INSTRUMENTATION (2026-08-16) — the hang is downstream of a
successful CUDA init (cuda available=True, Tesla T4, container serves). We
instrument EVERYTHING before touching versions: faulthandler thread dumps every
45s (the hanging frame, no exec needed), a heartbeat, env/egress probes, and a
step-timed loader with a pure CUDA matmul probe. No torch import happens before
this instrumentation. HF_HUB_OFFLINE=1 (in the Dockerfile) makes any missing
egress-dependent call fail FAST with the exact file it wanted instead of hanging.
"""
import faulthandler
import os
import socket
import subprocess
import sys
import threading
import time
import traceback

faulthandler.enable(file=sys.stderr, all_threads=True)
# Every 45s, dump ALL thread stacks to stderr -> container logs. This alone
# tells us the exact hanging frame without needing exec access.
faulthandler.dump_traceback_later(45, repeat=True, exit=False)

_T0 = time.time()


def _heartbeat():
    while True:
        print(f"[hb] t+{time.time()-_T0:.0f}s", flush=True)
        time.sleep(10)


threading.Thread(target=_heartbeat, daemon=True).start()


def _env_report():
    print(f"[env] uid={os.getuid()} HOME={os.environ.get('HOME')}", flush=True)
    for d in ("/tmp", os.environ.get("HOME", "/root"), "/opt/chatterbox-model"):
        print(f"[env] {d} exists={os.path.isdir(d)} writable={os.access(d, os.W_OK)}", flush=True)
    try:
        print("[env] nvidia-smi:\n" + subprocess.run(
            ["nvidia-smi"], capture_output=True, text=True, timeout=20).stdout, flush=True)
    except Exception as e:
        print(f"[env] nvidia-smi FAILED: {e!r}", flush=True)
    # Egress probe: 5s timeout. If this hangs or fails, HF calls will hang forever.
    for host in ("huggingface.co", "cdn-lfs.huggingface.co"):
        t = time.time()
        try:
            socket.create_connection((host, 443), timeout=5).close()
            print(f"[env] egress {host} OK in {time.time()-t:.1f}s", flush=True)
        except Exception as e:
            print(f"[env] egress {host} BLOCKED after {time.time()-t:.1f}s: {e!r}", flush=True)


_env_report()

# ---- Web server (uvicorn serves immediately; the model loads in the background) ----
from fastapi import FastAPI, Request
from fastapi.responses import PlainTextResponse, StreamingResponse

AUTH_TOKEN = os.environ.get("CHATTERBOX_AUTH_TOKEN", "")
CONCURRENCY = int(os.environ.get("CHATTERBOX_CONCURRENCY", "4"))

app = FastAPI()
_semaphore = threading.Semaphore(CONCURRENCY)
_model = None
_model_ready = False
_device = "cpu"
_gen_lock = threading.Lock()


# A debug route that does NOT depend on the model and bypasses auth — our live
# probe while the loader thread is stuck.
@app.get("/debug/stack", response_class=PlainTextResponse)
def debug_stack():
    buf = [f"uptime={time.time()-_T0:.0f}s", f"model_ready={_model_ready}", f"device={_device}"]
    for tid, frame in sys._current_frames().items():
        buf.append(f"\n--- thread {tid} ---")
        buf.extend(traceback.format_stack(frame))
    return "\n".join(buf)


@app.get("/healthz")
def health():
    return {"ok": True, "model": "chatterbox-turbo", "device": _device, "ready": _model_ready, "sr": getattr(_model, "sr", None)}


# ---- Step-timed loader: individually logged, decisive CUDA matmul probe FIRST ----
def _step(label, fn):
    t = time.time()
    print(f"[step] BEGIN {label}", flush=True)
    try:
        r = fn()
        print(f"[step] OK    {label} ({time.time()-t:.1f}s)", flush=True)
        return r
    except Exception as e:
        print(f"[step] FAIL  {label} ({time.time()-t:.1f}s): {e!r}", flush=True)
        raise


def _load():
    global _model, _model_ready, _device
    try:
        import torch
        _device = "cuda" if _step("cuda.is_available", lambda: torch.cuda.is_available()) else "cpu"
        if _device == "cuda":
            _step("get_device_name", lambda: torch.cuda.get_device_name(0))

            def _matmul():
                x = torch.randn(2048, 2048, device="cuda")
                v = (x @ x).sum().item()
                torch.cuda.synchronize()
                return v
            _step("cuda_matmul_probe", _matmul)          # <-- the decisive test
            _step("cudnn_version", lambda: torch.backends.cudnn.version())

        _step("import_chatterbox", lambda: __import__("chatterbox.tts_turbo", fromlist=["x"]))
        from chatterbox.tts_turbo import ChatterboxTurboTTS
        ckpt = os.environ["CHATTERBOX_MODEL_DIR"]
        _step("listdir_model", lambda: print(sorted(os.listdir(ckpt))[:40], flush=True))
        # Trace the internal calls so the LAST [trace] BEGIN before the GIL
        # freeze IS the hanging step. Patch the MODULE binding (from_local did
        # `from safetensors.torch import load_file`, so the name lives on
        # chatterbox.tts_turbo, not safetensors.torch).
        import chatterbox.tts_turbo as _cbtt
        _orig_load_file = _cbtt.load_file
        def _traced_load_file(*a, **k):
            f = a[0].name if hasattr(a[0], "name") else str(a[0])
            print(f"[trace] BEGIN load_file {f}", flush=True)
            t = time.time(); r = _orig_load_file(*a, **k)
            print(f"[trace] OK    load_file {f} in {time.time()-t:.1f}s", flush=True)
            return r
        _cbtt.load_file = _traced_load_file
        _orig_to = torch.Tensor.to
        def _traced_to(self, *a, **k):
            dev = a[0] if a else k.get("device")
            print(f"[trace] BEGIN Tensor.to shape={tuple(self.shape)[:3]}.. -> {dev}", flush=True)
            t = time.time(); r = _orig_to(self, *a, **k)
            print(f"[trace] OK    Tensor.to in {time.time()-t:.1f}s", flush=True)
            return r
        torch.Tensor.to = _traced_to
        from transformers import AutoTokenizer as _AT
        _orig_atf = _AT.from_pretrained
        def _traced_atf(*a, **k):
            print(f"[trace] BEGIN AutoTokenizer.from_pretrained {a}", flush=True)
            t = time.time(); r = _orig_atf(*a, **k)
            print(f"[trace] OK    AutoTokenizer in {time.time()-t:.1f}s", flush=True)
            return r
        _AT.from_pretrained = _traced_atf
        _model = _step("from_local", lambda: ChatterboxTurboTTS.from_local(ckpt, device=_device))
        print(f"[server] LOADED sr={_model.sr} in {time.time()-_T0:.0f}s", flush=True)
    except Exception as e:
        print(f"[server] LOAD FAILED after {time.time()-_T0:.0f}s: {e!r}", flush=True)
        traceback.print_exc()
    finally:
        _model_ready = True


@app.on_event("startup")
def startup():
    threading.Thread(target=_load, daemon=True).start()


def _wait_for_model(timeout_s: float = 300) -> bool:
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        if _model is not None and _model_ready:
            return True
        time.sleep(2)
    return False


@app.post("/{full_path:path}")
async def catch_all(req: Request, full_path: str = ""):
    return await speech(req)


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
        if not _wait_for_model():
            yield "data: [DONE]\n\n"
            return
        with _semaphore:
            t0 = time.time()
            with _gen_lock:
                wav = _model.generate(text)
                wav = wav.detach().cpu()
            print(f"[server] {len(text)} chars -> {wav.shape[-1]/_model.sr:.1f}s audio in {time.time()-t0:.1f}s", flush=True)
            pcm = (wav.float() * 32767).clamp(-32768, 32767).short().numpy().tobytes()
            step = max(1, len(pcm) // 4)
            for i in range(0, len(pcm), step):
                chunk = pcm[i:i + step]
                ev = {
                    "type": "response.output_audio.delta",
                    "index": 0,
                    "audio": __import__("base64").b64encode(chunk).decode(),
                    "format": "pcm16",
                    "sample_rate": _model.sr,
                }
                yield f"data: {__import__('json').dumps(ev)}\n\n"
            yield "data: [DONE]\n\n"

    return StreamingResponse(gen(), media_type="text/event-stream")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "4123")))
