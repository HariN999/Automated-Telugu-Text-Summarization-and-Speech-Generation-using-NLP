"""
Text Cleaning Module
Cleans and normalizes Telugu text
"""
import re


def clean_text(text: str) -> str:
    """
    Clean Telugu text by removing unwanted characters and normalizing whitespace

    Args:
        text: Raw Telugu text

    Returns:
        Cleaned Telugu text
    """
    # Preserve Telugu characters (U+0C00-U+0C7F), Telugu dandas (U+0964, U+0965),
    # ASCII digits, whitespace, and basic punctuation
    text = re.sub(r"[^\u0C00-\u0C7F\u0964\u09650-9\s,.!?\"'-]", "", text)

    # Collapse multiple spaces into single space
    text = re.sub(r"\s+", " ", text)

    return text.strip()