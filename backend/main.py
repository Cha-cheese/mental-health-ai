# MindSafe AI — FastAPI Backend + Serve React Frontend
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from schemas import TextRequest, PredictionResponse
from model_utils import load_model, predict, get_recommendations
import os

app = FastAPI(
    title="MindSafe AI API",
    description="Mental health crisis detection API",
    version="1.0.0"
)

# Allow all origins (needed for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Load model on startup
print("Loading model...")
model, tokenizer = load_model()
print("Model loaded!")

# ── API Routes ─────────────────────────────────────────────

@app.get("/api/health")
def health_check():
    return {"status": "MindSafe AI is running", "version": "1.0.0"}

@app.post("/api/analyze", response_model=PredictionResponse)
def analyze_text(request: TextRequest):
    """Analyze text for mental health crisis detection"""
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    if len(request.text) > 1000:
        raise HTTPException(status_code=400, detail="Text too long (max 1000 chars)")

    result          = predict(request.text, model, tokenizer)
    recommendations = get_recommendations(result["prediction"])

    return PredictionResponse(
        text=request.text,
        prediction=result["prediction"],
        confidence=result["confidence"],
        probabilities=result["probabilities"],
        recommendations=recommendations,
        translated_text=result["translated_text"],
    )

# ── Serve React Frontend ────────────────────────────────────
# Must be AFTER API routes so /api/* routes take priority

BUILD_DIR = os.path.join(os.path.dirname(__file__), "build")

if os.path.exists(BUILD_DIR):
    # Serve static files (JS, CSS, images)
    app.mount("/static", StaticFiles(directory=os.path.join(BUILD_DIR, "static")), name="static")

    # Serve React app for all other routes (SPA fallback)
    @app.get("/{full_path:path}")
    def serve_react(full_path: str):
        return FileResponse(os.path.join(BUILD_DIR, "index.html"))
