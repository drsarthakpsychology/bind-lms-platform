# Tiny ACA CPU gateway - proxies to the scale-to-zero GPU app, 503s during cold.
FROM python:3.12-slim
WORKDIR /app
RUN pip install --no-cache-dir fastapi uvicorn httpx
COPY aca_main.py /app/main.py
EXPOSE 4123
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "4123"]
