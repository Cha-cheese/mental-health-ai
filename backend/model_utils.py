import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
from deep_translator import GoogleTranslator

# Load from HuggingFace Hub instead of local file
# This works on any server without needing large model files
MODEL_NAME = "distilbert-base-uncased"

translator = Translator() if False else None  # lazy init

def translate_to_english(text: str) -> str:
    """Translate text to English if not already English"""
    try:
        return GoogleTranslator(source="auto", target="en").translate(text)
    except Exception:
        return text

def load_model():
    """Load tokenizer and model from HuggingFace"""
    tokenizer = DistilBertTokenizer.from_pretrained(MODEL_NAME)
    model     = DistilBertForSequenceClassification.from_pretrained(
        MODEL_NAME,
        num_labels=2
    )
    model.eval()
    return model, tokenizer

def predict(text: str, model, tokenizer):
    """Translate text then predict mental health status"""
    english_text = translate_to_english(text)
    inputs = tokenizer(
        english_text,
        return_tensors="pt",
        max_length=128,
        truncation=True,
        padding="max_length"
    )
    with torch.no_grad():
        outputs      = model(**inputs)
        probs        = torch.softmax(outputs.logits, dim=1)
        pred_class   = torch.argmax(probs, dim=1).item()
        confidence   = probs[0][pred_class].item()

    label_map = {0: "Normal", 1: "At-risk"}
    return {
        "prediction":      label_map[pred_class],
        "confidence":      round(confidence, 4),
        "probabilities":   {
            "Normal":   round(probs[0][0].item(), 4),
            "At-risk":  round(probs[0][1].item(), 4),
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
