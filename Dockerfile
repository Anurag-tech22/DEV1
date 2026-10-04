# Stage 1: Build the React frontend
FROM node:20 AS frontend-builder
WORKDIR /app/web
COPY web/package*.json ./
RUN npm install
COPY web/ .
RUN npm run build

# Stage 2: Build the Python backend
FROM python:3.11-slim
WORKDIR /srv

# Copy Python requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend Python code
COPY app app

# Copy the built React frontend from Stage 1
COPY --from=frontend-builder /app/web/dist /srv/web/dist

# Start the FastAPI server (which automatically serves the frontend dist folder)
CMD ["sh","-c","uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000}"]
