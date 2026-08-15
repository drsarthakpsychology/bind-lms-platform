# Chatterbox-Turbo OpenAI-compatible TTS server, for Azure Container Apps GPU.
# chatterbox-ng needs Python >=3.14; torch needs a matching CUDA wheel (cu128).
FROM nvidia/cuda:12.8.1-runtime-ubuntu22.04
ENV DEBIAN_FRONTEND=noninteractive

# Python 3.14 (chatterbox-ng's required version) via deadsnakes.
# build-essential: spacy-pkuseg (a chatterbox dep) compiles a C++ extension.
RUN apt-get update && apt-get install -y software-properties-common curl build-essential gcc g++ make \
    && add-apt-repository -y ppa:deadsnakes/ppa \
    && apt-get install -y python3.14 python3.14-venv python3.14-dev \
    && rm -rf /var/lib/apt/lists/*
RUN python3.14 -m venv /opt/cb-venv \
    && /opt/cb-venv/bin/pip install --no-cache-dir --upgrade pip

# torch + torchaudio MUST match (a mismatch breaks the model load). torchaudio
# tops out at 2.11.0 on py3.14, so pin the whole stack in ONE pip run so the
# resolver cannot upgrade torch to a version with no matching torchaudio.
RUN /opt/cb-venv/bin/pip install --no-cache-dir \
      torch==2.11.0 torchaudio==2.11.0 \
      chatterbox-ng fastapi uvicorn huggingface-hub

# Pre-download the Turbo model at build time into a WORLD-READABLE dir.
# (ACA containers run as a non-root user, so the default /root/.cache (mode 700)
# is invisible at runtime - that caused a stuck re-download on every cold start.)
RUN mkdir -p /opt/chatterbox-model && /opt/cb-venv/bin/python -c "from huggingface_hub import snapshot_download; snapshot_download(repo_id='ResembleAI/chatterbox-turbo', token=False, local_dir='/opt/chatterbox-model')" \
    && chmod -R a+rX /opt/chatterbox-model

COPY main.py /opt/chatterbox-server/main.py
WORKDIR /opt/chatterbox-server
ENV CHATTERBOX_MODEL_DIR=/opt/chatterbox-model \
    CHATTERBOX_CONCURRENCY=4
EXPOSE 4123
CMD ["/opt/cb-venv/bin/uvicorn", "main:app", "--host", "0.0.0.0", "--port", "4123"]
