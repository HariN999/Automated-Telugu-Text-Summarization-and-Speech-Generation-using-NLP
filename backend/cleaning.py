import re

def clean_text(text):

    text = re.sub(r"[a-zA-Z]", "", text)
    text = re.sub(r"[^\u0C00-\u0C7F\s।,.!?]", "", text)
    text = re.sub(r"\s+", " ", text)

    return text.strip()