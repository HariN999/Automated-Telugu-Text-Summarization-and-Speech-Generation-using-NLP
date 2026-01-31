import re
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

def sentence_split(text):
    sentences = re.split(r"[।.]", text)
    return [s.strip() for s in sentences if len(s.strip()) > 0]

def tfidf_summarize(text, num_sentences=3):

    sentences = sentence_split(text)

    if len(sentences) <= num_sentences:
        return text

    vectorizer = TfidfVectorizer()
    tfidf = vectorizer.fit_transform(sentences)

    scores = tfidf.sum(axis=1).A1
    ranked = np.argsort(scores)[::-1][:num_sentences]

    summary = " ".join([sentences[i] for i in sorted(ranked)])
    return summary