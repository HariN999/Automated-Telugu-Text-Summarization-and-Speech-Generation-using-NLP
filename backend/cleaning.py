import re

def clean_text(text):
    # Preserve Telugu characters, numbers, and basic punctuation
    # \u0C00-\u0C7F is the Unicode block for Telugu
    text = re.sub(r"[^\u0C00-\u0C7F0-9\s।,.!?\"'-]", "", text)
    
    # Collapse multiple spaces
    text = re.sub(r"\s+", " ", text)

    return text.strip()