"""
Text Extraction Module
Extracts text from URLs or returns direct text input
"""
import requests
from bs4 import BeautifulSoup
import re


def clean_text(text: str) -> str:
    """
    Clean Telugu text by removing unwanted characters
    
    Args:
        text: Raw Telugu text
        
    Returns:
        Cleaned Telugu text
    """
    # Preserve Telugu characters, numbers, and basic punctuation
    text = re.sub(r"[^\u0C00-\u0C7F0-9\s।,.!?\"'-]", "", text)
    
    # Collapse multiple spaces
    text = re.sub(r"\s+", " ", text)
    
    return text.strip()


def extract_text(text_or_url: str) -> str:
    """
    Extract text from URL or return direct text input
    
    Args:
        text_or_url: Either a URL starting with 'http' or direct text
        
    Returns:
        Extracted and cleaned text
    """
    if text_or_url.startswith("http"):
        try:
            response = requests.get(text_or_url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, "html.parser")
            
            # Remove script and style elements
            for script in soup(["script", "style"]):
                script.decompose()
            
            # Get text from paragraphs
            paragraphs = soup.find_all("p")
            article_text = " ".join(p.get_text().strip() for p in paragraphs if p.get_text().strip())
            
            if not article_text:
                # Fallback to all text
                article_text = soup.get_text()
            
            return clean_text(article_text)
            
        except Exception as e:
            raise ValueError(f"Failed to extract text from URL: {str(e)}")
    
    return clean_text(text_or_url)