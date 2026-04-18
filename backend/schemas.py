from pydantic import BaseModel
from typing import Optional

class TextRequest(BaseModel):
    text: str
    language: Optional[str] = "en"

class PredictionResponse(BaseModel):
    text: str
    prediction: str
    confidence: float
    probabilities: dict
    recommendations: list
