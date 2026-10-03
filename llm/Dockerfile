FROM ghcr.io/ggml-org/llama.cpp:server
USER root
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
ARG MODEL_URL=https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/qwen2.5-1.5b-instruct-q4_k_m.gguf
RUN curl -L "$MODEL_URL" -o /model.gguf
ENTRYPOINT ["/app/llama-server","-m","/model.gguf","--host","0.0.0.0","--port","8080","-c","2048"]
