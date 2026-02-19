"""
TF-IDF Based Extractive Summarization
Traditional method for quick summarization
"""
import re
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer


def _split_sentences(text: str) -> list:
    """
    Split Telugu text into sentences

    Args:
        text: Telugu text

    Returns:
        List of sentences
    """
    # U+0964 = Telugu/Devanagari danda (।), U+0965 = double danda (॥)
    sentences = re.split(r"[\u0964\u0965.]", text)
    return [s.strip() for s in sentences if len(s.strip()) > 0]


def tfidf_summarize(text: str, num_sentences: int = 3) -> str:
    """
    Generate extractive summary using TF-IDF scoring

    Args:
        text: Input Telugu text
        num_sentences: Number of top sentences to include in summary

    Returns:
        Extractive summary
    """
    sentences = _split_sentences(text)

    # If text is already short, return as-is
    if len(sentences) <= num_sentences:
        return text

    # Calculate TF-IDF scores
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(sentences)

    # Score each sentence by summing its TF-IDF values
    sentence_scores = tfidf_matrix.sum(axis=1).A1

    # Get top N sentence indices
    top_indices = np.argsort(sentence_scores)[::-1][:num_sentences]

    # Return sentences in original order
    summary_sentences = [sentences[i] for i in sorted(top_indices)]
    return " ".join(summary_sentences)