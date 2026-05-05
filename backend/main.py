from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import TextRequest, PredictionResponse
from model_utils import load_model, predict, get_recommendations

app = FastAPI(
    title="MindSafe AI API",
    description="Mental health crisis detection API with multilingual support",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

print("Loading model...")
model, tokenizer = load_model()
print("Model loaded!")

@app.get("/")
def health_check():
    return {"status": "MindSafe AI is running", "version": "1.0.0"}

@app.post("/analyze", response_model=PredictionResponse)
def analyze_text(request: TextRequest):
    """Analyze text for mental health crisis detection"""
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    if len(request.text) > 1000:
        raise HTTPException(status_code=400, detail="Text too long (max 1000 chars)")

    result = predict(request.text, model, tokenizer)
    recommendations = get_recommendations(result["prediction"])

    return PredictionResponse(
        text=request.text,
        prediction=result["prediction"],
        confidence=result["confidence"],
        probabilities=result["probabilities"],
        recommendations=recommendations,
        translated_text=result["translated_text"]
    )
