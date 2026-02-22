"""
Telugu News Summarization API
FastAPI application for text summarization with TTS
"""
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from typing import Optional, Literal
import os

from clean import clean_text
from pipeline import run_pipeline
from services.news_service import fetch_telugu_news


app = FastAPI(
    title="Telugu News Summarization API",
    description="Extractive and abstractive summarization for Telugu text with TTS",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

AUDIO_DIR = "data"
os.makedirs(AUDIO_DIR, exist_ok=True)
app.mount("/audio", StaticFiles(directory=AUDIO_DIR), name="audio")


# ============================================================================
# Request/Response Models
# ============================================================================

METHOD_TYPE = Literal["tfidf", "mt5_base", "mt5_finetuned"]
METHOD_DESCRIPTION = "Summarization method: 'tfidf' (extractive), 'mt5_base' (abstractive base), or 'mt5_finetuned' (abstractive fine-tuned)"


class SummarizeRequest(BaseModel):
    text: str = Field(..., description="Telugu text to summarize", min_length=10)
    method: METHOD_TYPE = Field(default="tfidf", description=METHOD_DESCRIPTION)
    generate_audio: bool = Field(default=True, description="Whether to generate audio output")


class URLRequest(BaseModel):
    url: str = Field(..., description="URL of Telugu news article")
    method: METHOD_TYPE = Field(default="tfidf", description=METHOD_DESCRIPTION)
    generate_audio: bool = Field(default=True, description="Whether to generate audio output")


class SummarizeResponse(BaseModel):
    summary: str = Field(..., description="Generated summary")
    method: str = Field(..., description="Summarization method used")
    audio_url: Optional[str] = Field(None, description="URL to audio file")
    original_length: int = Field(..., description="Length of original text")
    summary_length: int = Field(..., description="Length of summary")


class ErrorResponse(BaseModel):
    detail: str = Field(..., description="Error message")

class LatestNewsItem(BaseModel):
    title: str = Field(..., description="News title")
    summary: str = Field(..., description="AI summarized Telugu news")
    method: str = Field(..., description="Summarization method used")
    audio_url: Optional[str] = Field(None, description="URL to audio file")
    # Speak frontend compatibility keys
    headline: str = Field(..., description="Headline field used by Speak UI")
    firstLine: str = Field(..., description="Short line field used by Speak UI")
    brief: str = Field(..., description="Brief summary field used by Speak UI")
    fullText: str = Field(..., description="Full text field used by Speak UI")
    source: str = Field(..., description="News source")


class LatestNewsResponse(BaseModel):
    source: str = Field(..., description="News pipeline source")
    news: list[LatestNewsItem] = Field(default_factory=list)


# ============================================================================
# Endpoints
# ============================================================================

@app.get("/", tags=["Health"])
def root():
    return {
        "status": "online",
        "service": "Telugu News Summarization API",
        "version": "2.0.0",
        "methods": ["tfidf", "mt5_base", "mt5_finetuned"],
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "components": {
            "api": "operational",
            "tfidf": "ready",
            "mt5_base": "ready",
            "mt5_finetuned": "ready",
            "tts": "ready",
        },
    }

@app.get(
    "/latest-news",
    response_model=LatestNewsResponse,
    responses={500: {"model": ErrorResponse}},
    tags=["News"],
)
def latest_news(
    language: str = Query(default="te", description="Language hint (currently Telugu feed)"),
    limit: int = Query(default=5, ge=1, le=5, description="Max number of articles"),
):
    """
    Fetch Telugu RSS articles and summarize them using the existing NLP pipeline.

    Pipeline reuse:
    fetch RSS -> clean text -> run_pipeline(method='mt5_finetuned', generate_audio=True)
    """
    try:
        _ = language  # Kept for frontend compatibility.
        raw_articles = fetch_telugu_news(limit=limit)
        summarized_news: list[LatestNewsItem] = []

        for article in raw_articles[:5]:
            article_text = clean_text(article.get("text", ""))
            if not article_text:
                continue

            result = run_pipeline(
                text_or_url=article_text,
                method="mt5_finetuned",
                generate_audio=True,
            )

            summary = result.get("summary", "").strip()
            title = article.get("title", "").strip() or "Telugu News"
            source_name = article.get("source", "rss")
            audio_url = None
            if result.get("audio_path"):
                filename = os.path.basename(result["audio_path"])
                audio_url = f"/audio/{filename}"

            if not summary:
                continue

            summarized_news.append(
                LatestNewsItem(
                    title=title,
                    summary=summary,
                    method="mt5_finetuned",
                    audio_url=audio_url,
                    # Speak frontend compatibility payload
                    headline=title,
                    firstLine=summary,
                    brief=summary,
                    fullText=summary,
                    source=source_name,
                )
            )

        return LatestNewsResponse(source="bbc_eenadu_pipeline", news=summarized_news)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch latest news: {str(e)}")


@app.post(
    "/summarize",
    response_model=SummarizeResponse,
    responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
    tags=["Summarization"],
)
def summarize_text(request: SummarizeRequest):
    """
    Summarize Telugu text.

    - **tfidf** – Fast extractive summarization
    - **mt5_base** – mT5 multilingual XLSum (no fine-tuning)
    - **mt5_finetuned** – mT5 fine-tuned on Telugu news (best quality)
    """
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")

        result = run_pipeline(
            text_or_url=request.text,
            method=request.method,
            generate_audio=request.generate_audio,
        )

        audio_url = None
        if result["audio_path"]:
            filename = os.path.basename(result["audio_path"])
            audio_url = f"/audio/{filename}"

        return SummarizeResponse(
            summary=result["summary"],
            method=result["method"],
            audio_url=audio_url,
            original_length=len(result["original_text"]),
            summary_length=len(result["summary"]),
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summarization failed: {str(e)}")


@app.post(
    "/process-url",
    response_model=SummarizeResponse,
    responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
    tags=["Summarization"],
)
def summarize_url(request: URLRequest):
    """
    Extract and summarize Telugu text from a URL.

    - **tfidf** – Fast extractive summarization
    - **mt5_base** – mT5 multilingual XLSum (no fine-tuning)
    - **mt5_finetuned** – mT5 fine-tuned on Telugu news (best quality)
    """
    try:
        if not request.url.startswith("http"):
            raise HTTPException(status_code=400, detail="Invalid URL format")

        result = run_pipeline(
            text_or_url=request.url,
            method=request.method,
            generate_audio=request.generate_audio,
        )

        audio_url = None
        if result["audio_path"]:
            filename = os.path.basename(result["audio_path"])
            audio_url = f"/audio/{filename}"

        return SummarizeResponse(
            summary=result["summary"],
            method=result["method"],
            audio_url=audio_url,
            original_length=len(result["original_text"]),
            summary_length=len(result["summary"]),
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"URL processing failed: {str(e)}")


@app.get(
    "/audio/{filename}",
    response_class=FileResponse,
    responses={404: {"model": ErrorResponse}},
    tags=["Audio"],
)
def get_audio(filename: str):
    audio_path = os.path.join(AUDIO_DIR, filename)
    if not os.path.exists(audio_path):
        raise HTTPException(status_code=404, detail="Audio file not found")
    return FileResponse(audio_path, media_type="audio/mpeg", filename=filename)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
