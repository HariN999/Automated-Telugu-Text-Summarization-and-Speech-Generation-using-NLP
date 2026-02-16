"""
Main Pipeline Module
Orchestrates the complete summarization workflow:
Extract → Clean → Summarize → Text-to-Speech
"""

from extract import extract_text
from clean import clean_text
from summarize_tfidf import tfidf_summarize
from summarize_mt5 import mT5_summarize   # <-- FIXED IMPORT
from tts import text_to_speech


def run_pipeline(
    text_or_url: str,
    method: str = "tfidf",
    generate_audio: bool = True
) -> dict:
    """
    Run complete summarization pipeline
    """

    # Step 1: Extract text
    extracted_text = extract_text(text_or_url)

    # Step 2: Clean text
    cleaned_text = clean_text(extracted_text)

    if not cleaned_text:
        raise ValueError("No valid text found after cleaning")

    # Step 3: Summarize
    if method.lower() == "tfidf":
        summary = tfidf_summarize(cleaned_text)

    elif method.lower() == "mt5":
        summary = mT5_summarize(cleaned_text)   # <-- FIXED CALL

    else:
        raise ValueError(f"Invalid method: {method}. Use 'tfidf' or 'mt5'")

    # Step 4: Generate audio
    audio_path = None
    if generate_audio and summary:
        audio_path = text_to_speech(summary)

    return {
        "original_text": cleaned_text,
        "summary": summary,
        "method": method,
        "audio_path": audio_path
    }


if __name__ == "__main__":
    test_text = """తెలంగాణ రాష్ట్రంలో వ్యవసాయ రంగం అభివృద్ధికి ప్రభుత్వం కొత్త పథకాలు ప్రకటించింది."""

    result = run_pipeline(test_text, method="tfidf", generate_audio=False)
    print(result)
