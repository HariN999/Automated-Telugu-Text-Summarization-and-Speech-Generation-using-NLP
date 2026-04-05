"""News service for Telugu RSS ingestion used by /latest-news."""

from __future__ import annotations

import time
from typing import Any

import feedparser
import requests
from bs4 import BeautifulSoup

RSS_SOURCES = [
    {
        "name": "bbc_telugu",
        "url": "https://feeds.bbci.co.uk/telugu/rss.xml",
    },
    {
        "name": "eenadu_telugu",
        "url": "https://www.eenadu.net/rss/news.xml",
    },
]

CACHE_TTL_SECONDS = 180  # 3 minutes
REQUEST_TIMEOUT_SECONDS = 8

_NEWS_CACHE: dict[str, Any] = {
    "timestamp": 0.0,
    "articles": [],
}


def _strip_html(value: str) -> str:
    if not value:
        return ""
    return BeautifulSoup(value, "html.parser").get_text(" ", strip=True)


def _extract_article_text(article_url: str, fallback_text: str) -> str:
    """Fetch fuller article content from the source page when possible."""
    if not article_url:
        return fallback_text

    try:
        response = requests.get(
            article_url,
            timeout=REQUEST_TIMEOUT_SECONDS,
            headers={"User-Agent": "TeluguAI-NewsFetcher/1.0"},
        )
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")
        for tag in soup(["script", "style"]):
            tag.decompose()

        paragraphs = [
            p.get_text(" ", strip=True)
            for p in soup.find_all("p")
            if p.get_text(" ", strip=True)
        ]
        article_text = " ".join(paragraphs).strip()
        return article_text or fallback_text
    except Exception:
        return fallback_text


def _first_sentence(text: str) -> str:
    if not text:
        return ""
    for separator in ("।", ".", "!", "?"):
        if separator in text:
            candidate = text.split(separator, 1)[0].strip()
            if candidate:
                return candidate
    return text.strip()


def _parse_source(source_name: str, rss_url: str) -> list[dict[str, str]]:
    """Fetch and parse one RSS source with timeout/error handling."""
    response = requests.get(
        rss_url,
        timeout=REQUEST_TIMEOUT_SECONDS,
        headers={"User-Agent": "TeluguAI-NewsFetcher/1.0"},
    )
    response.raise_for_status()

    parsed = feedparser.parse(response.content)
    items: list[dict[str, str]] = []

    for entry in parsed.entries:
        title = _strip_html(entry.get("title", ""))
        description = _strip_html(entry.get("summary", "") or entry.get("description", ""))
        link = entry.get("link", "").strip()

        article_text = " ".join(part for part in [title, description] if part).strip()
        if not article_text:
            continue

        full_text = _extract_article_text(link, article_text)
        first_line = _first_sentence(description or title)

        items.append(
            {
                "source": source_name,
                "title": title,
                "text": article_text,
                "brief_text": description or article_text,
                "first_line": first_line,
                "full_text": full_text,
                "link": link,
            }
        )

    return items


def fetch_telugu_news(limit: int = 5) -> list[dict[str, str]]:
    """
    Fetch Telugu news from BBC + Eenadu RSS, with a short in-memory cache.

    Returns articles as raw text blocks (title + description) for downstream
    cleaning/summarization in the existing NLP pipeline.
    """
    bounded_limit = max(1, min(limit, 5))
    now = time.time()

    if now - _NEWS_CACHE["timestamp"] < CACHE_TTL_SECONDS and _NEWS_CACHE["articles"]:
        return _NEWS_CACHE["articles"][:bounded_limit]

    merged_articles: list[dict[str, str]] = []
    for source in RSS_SOURCES:
        try:
            merged_articles.extend(_parse_source(source["name"], source["url"]))
        except Exception:
            # Continue with other feeds if one fails.
            continue

    if merged_articles:
        _NEWS_CACHE["timestamp"] = now
        _NEWS_CACHE["articles"] = merged_articles

    return _NEWS_CACHE["articles"][:bounded_limit]
