FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create models directory
RUN mkdir -p models

# Expose port
EXPOSE 8000

# Run with S3 download on startup
CMD python -c "from s3_loader import download_from_s3; download_from_s3()" && uvicorn main:app --host 0.0.0.0 --port 8000
