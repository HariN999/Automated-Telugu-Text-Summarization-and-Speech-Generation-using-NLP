import streamlit as st
from extraction import extract_text
from cleaning import clean_text
from tfidf_summarizer import tfidf_summarize
from indicbart_summarizer import indicbart_summarize
from tts import text_to_speech
from rouge_eval import evaluate_rouge
import os

st.set_page_config(page_title="Telugu News Summarizer", layout="centered")

st.title("📰 Telugu News Summarization & Speech System")
st.write("Enter a Telugu news article URL to get summary and audio output.")

url = st.text_input("Paste Telugu News URL here:")

if st.button("Generate Summary"):
    if url.strip() == "":
        st.warning("Please enter a valid URL")
    else:
        with st.spinner("Processing..."):

            # Extraction
            raw_text = extract_text(url)

            # Cleaning
            cleaned_text = clean_text(raw_text)

            # TF-IDF Summary
            tfidf_sum = tfidf_summarize(cleaned_text)

            # Abstractive Summary
            abstractive_sum = indicbart_summarize(cleaned_text)

            # ROUGE
            scores = evaluate_rouge(tfidf_sum, abstractive_sum)

            # TTS
            audio_file = text_to_speech(abstractive_sum)

        st.success("Summary Generated Successfully!")

        st.subheader("🔹 TF-IDF Extractive Summary")
        st.write(tfidf_sum)

        st.subheader("🔹 Abstractive Summary")
        st.write(abstractive_sum)

        st.subheader("📊 ROUGE Scores")
        st.json(scores)

        st.subheader("🔊 Telugu Audio Output")
        st.audio(audio_file)

        # Optional Download
        if os.path.exists(audio_file):
            with open(audio_file, "rb") as f:
                st.download_button("Download Audio", f, file_name="summary_audio.mp3")

st.markdown("---")
st.caption("Automated Telugu Text Summarization and Speech Generation using NLP")

from pipeline import run_pipeline

if __name__ == "__main__":
    summary, audio = run_pipeline("తెలుగు వార్త టెక్స్ట్")
    print(summary)
    print(audio)
