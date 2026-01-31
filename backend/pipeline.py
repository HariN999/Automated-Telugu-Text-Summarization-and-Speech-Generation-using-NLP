from extraction import extract_text
from cleaning import clean_text
from tfidf_summarizer import tfidf_summarize
from indicbart_summarizer import indicbart_summarize
from tts import text_to_speech

def run_pipeline(text, method="tfidf"):

    extracted = extract_text(text)
    cleaned = clean_text(extracted)

    if method == "tfidf":
        summary = tfidf_summarize(cleaned)
    else:
        summary = indicbart_summarize(cleaned)

    audio_path = text_to_speech(summary)

    return summary, audio_path