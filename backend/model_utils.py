import torch
import json
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification

MODEL_PATH = "../model/distilbert"

def load_model():
    tokenizer = DistilBertTokenizer.from_pretrained(MODEL_PATH)
    model = DistilBertForSequenceClassification.from_pretrained(MODEL_PATH)
    model.eval()
    return model, tokenizer

def predict(text: str, model, tokenizer):
    inputs = tokenizer(text, return_tensors="pt", max_length=128, truncation=True, padding="max_length")
    with torch.no_grad():
        outputs = model(**inputs)
        probabilities = torch.softmax(outputs.logits, dim=1)
        predicted_class = torch.argmax(probabilities, dim=1).item()
        confidence = probabilities[0][predicted_class].item()
    label_map = {0: "Normal", 1: "At-risk"}
    probs = {"Normal": round(probabilities[0][0].item(), 4), "At-risk": round(probabilities[0][1].item(), 4)}
    return {"prediction": label_map[predicted_class], "confidence": round(confidence, 4), "probabilities": probs}

def get_recommendations(prediction: str):
    recommendations = {
        "Normal": ["Keep maintaining your mental health", "Practice mindfulness daily", "Stay connected with loved ones"],
        "At-risk": ["Consider talking to someone you trust", "Contact mental health helpline: 1323", "Seek professional help if needed"]
    }
    return recommendations.get(prediction, [])
