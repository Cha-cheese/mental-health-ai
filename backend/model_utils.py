# MindSafe AI — Lightweight Model Utils
# Uses TF-IDF + Logistic Regression (~50MB RAM vs 512MB for BERT)

import joblib
import os
from deep_translator import GoogleTranslator

# Path to lightweight model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "model.joblib")

def translate_to_english(text: str) -> str:
    """Translate text to English if not already English"""
    try:
        return GoogleTranslator(source="auto", target="en").translate(text)
    except Exception:
        return text

def load_model():
    """Load lightweight sklearn pipeline"""
    model = joblib.load(MODEL_PATH)
    return model, None  # None = no separate tokenizer needed

def predict(text: str, model, tokenizer=None):
    """Translate then predict using sklearn pipeline"""
    english_text = translate_to_english(text)

    # Get prediction and probability
    pred_class   = model.predict([english_text])[0]
    proba        = model.predict_proba([english_text])[0]
    confidence   = float(proba[pred_class])

    label_map = {0: "Normal", 1: "At-risk"}

    return {
        "prediction":      label_map[pred_class],
        "confidence":      round(confidence, 4),
        "probabilities":   {
            "Normal":  round(float(proba[0]), 4),
            "At-risk": round(float(proba[1]), 4),
        },
        "translated_text": english_text,
    }

def get_recommendations(prediction: str):
    """Return recommendations based on prediction"""
    recommendations = {
        "Normal": [
            "Keep maintaining your mental health",
            "Practice mindfulness daily",
            "Stay connected with loved ones",
        ],
        "At-risk": [
            "Consider talking to someone you trust",
            "Contact mental health helpline: 1323",
            "Practice breathing exercises",
            "Seek professional help if needed",
        ],
    }
    return recommendations.get(prediction, [])
