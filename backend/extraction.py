import requests
from bs4 import BeautifulSoup

def extract_text(text_or_url: str):

    if text_or_url.startswith("http"):
        response = requests.get(text_or_url)
        soup = BeautifulSoup(response.text, "html.parser")
        paragraphs = soup.find_all("p")

        article_text = ""
        for p in paragraphs:
            article_text += p.get_text() + " "
        return article_text

    # Direct text input
    return text_or_url