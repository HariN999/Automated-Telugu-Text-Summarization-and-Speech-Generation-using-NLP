"""
Telugu News Summarization API
FastAPI application for text summarization with TTS
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from typing import Optional, Literal
import os

from pipeline import run_pipeline


# ============================================================================
# FastAPI App Configuration
# ============================================================================

app = FastAPI(
    title="Telugu News Summarization API",
    description="Extractive and abstractive summarization for Telugu text with TTS",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure audio directory exists and mount it
AUDIO_DIR = "data"
os.makedirs(AUDIO_DIR, exist_ok=True)
app.mount("/audio", StaticFiles(directory=AUDIO_DIR), name="audio")


# ============================================================================
# Request/Response Models
# ============================================================================

class SummarizeRequest(BaseModel):
    """Request model for text summarization"""
    text: str = Field(..., description="Telugu text to summarize", min_length=10)
    method: Literal["tfidf", "mt5"] = Field(
        default="tfidf",
        description="Summarization method: 'tfidf' (extractive) or 'mt5' (abstractive)"
    )
    generate_audio: bool = Field(
        default=True,
        description="Whether to generate audio output"
    )


class URLRequest(BaseModel):
    """Request model for URL-based summarization"""
    url: str = Field(..., description="URL of Telugu news article")
    method: Literal["tfidf", "mt5"] = Field(
        default="tfidf",
        description="Summarization method: 'tfidf' (extractive) or 'mt5' (abstractive)"
    )
    generate_audio: bool = Field(
        default=True,
        description="Whether to generate audio output"
    )


class SummarizeResponse(BaseModel):
    """Response model for summarization"""
    summary: str = Field(..., description="Generated summary")
    method: str = Field(..., description="Summarization method used")
    audio_url: Optional[str] = Field(None, description="URL to audio file")
    original_length: int = Field(..., description="Length of original text")
    summary_length: int = Field(..., description="Length of summary")


class ErrorResponse(BaseModel):
    """Error response model"""
    detail: str = Field(..., description="Error message")


# ============================================================================
# API Endpoints
# ============================================================================

@app.get("/", tags=["Health"])
def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "Telugu News Summarization API",
        "version": "2.0.0",
        "endpoints": {
            "docs": "/docs",
            "summarize": "/summarize",
            "process_url": "/process-url",
            "audio": "/audio/{filename}"
        }
    }


@app.get("/health", tags=["Health"])
def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "components": {
            "api": "operational",
            "tfidf": "ready",
            "mt5": "ready",
            "tts": "ready"
        }
    }


@app.post(
    "/summarize",
    response_model=SummarizeResponse,
    responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
    tags=["Summarization"]
)
def summarize_text(request: SummarizeRequest):
    """
    Summarize Telugu text
    
    Supports two methods:
    - **tfidf**: Fast extractive summarization (default)
    - **mt5**: AI-powered abstractive summarization
    
    Optionally generates Telugu audio output.
    """
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        # Run pipeline
        result = run_pipeline(
            text_or_url=request.text,
            method=request.method,
            generate_audio=request.generate_audio
        )
        
        # Build audio URL if generated
        audio_url = None
        if result["audio_path"]:
            filename = os.path.basename(result["audio_path"])
            audio_url = f"/audio/{filename}"
        
        return SummarizeResponse(
            summary=result["summary"],
            method=result["method"],
            audio_url=audio_url,
            original_length=len(result["original_text"]),
            summary_length=len(result["summary"])
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summarization failed: {str(e)}")


@app.post(
    "/process-url",
    response_model=SummarizeResponse,
    responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
    tags=["Summarization"]
)
def summarize_url(request: URLRequest):
    """
    Extract and summarize Telugu text from URL
    
    Automatically extracts article text from the provided URL,
    then summarizes it using the specified method.
    """
    try:
        if not request.url.startswith("http"):
            raise HTTPException(status_code=400, detail="Invalid URL format")
        
        # Run pipeline
        result = run_pipeline(
            text_or_url=request.url,
            method=request.method,
            generate_audio=request.generate_audio
        )
        
        # Build audio URL if generated
        audio_url = None
        if result["audio_path"]:
            filename = os.path.basename(result["audio_path"])
            audio_url = f"/audio/{filename}"
        
        return SummarizeResponse(
            summary=result["summary"],
            method=result["method"],
            audio_url=audio_url,
            original_length=len(result["original_text"]),
            summary_length=len(result["summary"])
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"URL processing failed: {str(e)}")


@app.get(
    "/audio/{filename}",
    response_class=FileResponse,
    responses={404: {"model": ErrorResponse}},
    tags=["Audio"]
)
def get_audio(filename: str):
    """
    Retrieve generated audio file
    
    Returns the MP3 audio file for a given filename.
    """
    audio_path = os.path.join(AUDIO_DIR, filename)
    
    if not os.path.exists(audio_path):
        raise HTTPException(status_code=404, detail="Audio file not found")
    
    return FileResponse(
        audio_path,
        media_type="audio/mpeg",
        filename=filename
    )


# ============================================================================
# Run Application
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )