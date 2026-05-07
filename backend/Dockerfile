# ── Base image ──────────────────────────────────────────────
# Use slim Python to keep image small
FROM python:3.11-slim

# ── Working directory inside container ──────────────────────
WORKDIR /app

# ── Install dependencies first (cached layer) ───────────────
# Copy requirements before code so Docker caches this layer
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ── Copy source code ────────────────────────────────────────
COPY . .

# ── Expose port ─────────────────────────────────────────────
EXPOSE 8000

# ── Start command ───────────────────────────────────────────
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
