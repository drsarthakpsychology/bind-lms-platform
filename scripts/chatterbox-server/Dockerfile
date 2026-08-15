# Chatterbox-Turbo OpenAI-compatible TTS server, for Azure Container Apps GPU.
#
# IMPORTANT (root-caused, not guessed): the ACA Consumption-GPU T4 host driver
# is too old for CUDA 12.8 - containers with CUDA 12.8 (torch cu128) hang on
# model load (GitHub microsoft/azure-container-apps#1682). The known-good combo
# is CUDA 12.4: nvidia/cuda:12.4.1-runtime + torch cu124 (torch 2.6.0).
# chatterbox-tts pins torch==2.6.0, so py3.12 + torch 2.6.0 cu124 is the match.
FROM nvidia/cuda:12.4.1-runtime-ubuntu22.04
ENV DEBIAN_FRONTEND=noninteractive
# Let the container discover the ACA host-provided GPU.
ENV NVIDIA_VISIBLE_DEVICES=all \
    NVIDIA_DRIVER_CAPABILITIES=compute,utility

# Python 3.12 (has cu124 torch wheels; chatterbox-tts works on 3.10+).
RUN apt-get update && apt-get install -y software-properties-common curl build-essential gcc g++ make \
    && add-apt-repository -y ppa:deadsnakes/ppa \
    && apt-get install -y python3.12 python3.12-venv python3.12-dev \
    && rm -rf /var/lib/apt/lists/*
RUN python3.12 -m venv /opt/cb-venv \
    && /opt/cb-venv/bin/pip install --no-cache-dir --upgrade pip

# torch + torchaudio cu124 (matched, chatterbox-tts pins 2.6.0) + chatterbox-tts.
RUN /opt/cb-venv/bin/pip install --no-cache-dir \
      torch==2.6.0 torchaudio==2.6.0 chatterbox-tts fastapi uvicorn huggingface-hub \
      --index-url https://download.pytorch.org/whl/cu124 \
      --extra-index-url https://pypi.org/simple

# Pre-download the Turbo model into a WORLD-READABLE dir (ACA runs non-root).
RUN mkdir -p /opt/chatterbox-model && /opt/cb-venv/bin/python -c "from huggingface_hub import snapshot_download; snapshot_download(repo_id='ResembleAI/chatterbox-turbo', token=False, local_dir='/opt/chatterbox-model')" \
    && chmod -R a+rX /opt/chatterbox-model

COPY main.py /opt/chatterbox-server/main.py
WORKDIR /opt/chatterbox-server
ENV CHATTERBOX_MODEL_DIR=/opt/chatterbox-model \
    CHATTERBOX_CONCURRENCY=4
EXPOSE 4123
CMD ["/opt/cb-venv/bin/uvicorn", "main:app", "--host", "0.0.0.0", "--port", "4123"]
