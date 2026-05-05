import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
from deep_translator import GoogleTranslator

# Model configuration
MODEL_PATH = "../model/distilbert/checkpoint-11300"
TOKENIZER_NAME = "distilbert-base-uncased"

def translate_to_english(text: str) -> str:
    """Translate text to English if not already in English"""
    try:
        translated = GoogleTranslator(source="auto", target="en").translate(text)
        return translated
    except Exception:
        return text

def load_model():
    """Load DistilBERT model from checkpoint and tokenizer from HuggingFace"""
    tokenizer = DistilBertTokenizer.from_pretrained(TOKENIZER_NAME)
    model = DistilBertForSequenceClassification.from_pretrained(MODEL_PATH)
    model.eval()
    return model, tokenizer

def predict(text: str, model, tokenizer):
    """Predict mental health status, auto-translate to English if needed"""

    # Translate to English first
    english_text = translate_to_english(text)

    # Tokenize
    inputs = tokenizer(
        english_text,
        return_tensors="pt",
        max_length=128,
        truncation=True,
        padding="max_length"
    )

    # Get prediction
    with torch.no_grad():
        outputs = model(**inputs)
        probabilities = torch.softmax(outputs.logits, dim=1)
        predicted_class = torch.argmax(probabilities, dim=1).item()
        confidence = probabilities[0][predicted_class].item()

    label_map = {0: "Normal", 1: "At-risk"}
    probs = {
        "Normal": round(probabilities[0][0].item(), 4),
        "At-risk": round(probabilities[0][1].item(), 4)
    }
    return {
        "prediction": label_map[predicted_class],
        "confidence": round(confidence, 4),
        "probabilities": probs,
        "translated_text": english_text
    }

def get_recommendations(prediction: str):
    """Return recommendations based on prediction result"""
    recommendations = {
        "Normal": [
            "Keep maintaining your mental health",
            "Practice mindfulness daily",
            "Stay connected with loved ones"
        ],
        "At-risk": [
            "Consider talking to someone you trust",
            "Contact mental health helpline: 1323",
            "Practice breathing exercises",
            "Seek professional help if needed"
        ]
    }
    return recommendations.get(prediction, [])
