import streamlit as st
import requests
import json

# Page configuration
st.set_page_config(
    page_title="MindSafe AI",
    page_icon="🧠",
    layout="wide"
)

# API URL
API_URL = "http://localhost:8000"

# Title and description
st.title("🧠 MindSafe AI")
st.subheader("Mental Health Crisis Detection System")
st.markdown("---")

# Language selection
col1, col2 = st.columns([3, 1])
with col2:
    language = st.selectbox("Language", ["English", "Thai"])

# Text input
with col1:
    if language == "Thai":
        placeholder = "พิมพ์ความรู้สึกหรือสิ่งที่อยากบอก..."
    else:
        placeholder = "Type how you're feeling or what's on your mind..."

    text = st.text_area(
        "Enter your text",
        placeholder=placeholder,
        height=150,
        max_chars=1000
    )
    st.caption(f"{len(text)} / 1000 characters")

# Analyze button
if st.button("🔍 Analyze", type="primary", use_container_width=True):
    if not text.strip():
        st.warning("Please enter some text first.")
    else:
        with st.spinner("Analyzing with AI model..."):
            try:
                # Call FastAPI backend
                response = requests.post(
                    f"{API_URL}/analyze",
                    json={"text": text, "language": language.lower()}
                )

                if response.status_code == 200:
                    result = response.json()
                    prediction = result["prediction"]
                    confidence = result["confidence"]
                    probabilities = result["probabilities"]
                    recommendations = result["recommendations"]

                    st.markdown("---")

                    # Show result based on prediction
                    if prediction == "Normal":
                        st.success(f"😌 **SAFE** — Your text appears normal")
                    else:
                        st.error(f"⚠️ **AT-RISK** — Signs of mental health concern detected")

                    # Confidence bars
                    st.markdown("### Confidence Score")
                    col_n, col_r = st.columns(2)
                    with col_n:
                        st.metric("Normal", f"{probabilities['Normal']*100:.1f}%")
                        st.progress(probabilities["Normal"])
                    with col_r:
                        st.metric("At-risk", f"{probabilities['At-risk']*100:.1f}%")
                        st.progress(probabilities["At-risk"])

                    # Recommendations
                    st.markdown("### Recommendations")
                    for rec in recommendations:
                        st.markdown(f"- {rec}")

                else:
                    st.error(f"API Error: {response.status_code}")

            except requests.exceptions.ConnectionError:
                st.error("Cannot connect to API. Please make sure the backend is running.")

# Disclaimer
st.markdown("---")
st.caption("⚠️ For research purposes only. Not a substitute for professional medical advice.")
