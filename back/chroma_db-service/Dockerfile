# Dockerfile for ChromaDB
FROM python:3.10-slim

# Install required packages
RUN pip install chromadb uvicorn

# Create a working directory
WORKDIR /app

# Set Chroma port
ENV CHROMA_PORT=8000

# Run ChromaDB API server
CMD ["uvicorn", "run", "--host", "0.0.0.0", "--port", "8000"]
