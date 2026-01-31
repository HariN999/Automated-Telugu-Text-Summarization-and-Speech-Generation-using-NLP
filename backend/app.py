from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, HttpUrl
from typing import Optional
import os
from pipeline import run_pipeline
from extraction import extract_text

app = FastAPI(
    title="Telugu News Summarization API",
    description="API for Telugu text summarization with TTS support",
    version="1.0.0"
)

# Configure CORS to allow requests from React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite default dev server
        "http://localhost:3000",  # Alternative React port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://localhost:4173",  # Vite preview
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure data directory exists
os.makedirs("data", exist_ok=True)

# Mount static files for audio
try:
    app.mount("/audio", StaticFiles(directory="data"), name="audio")
except RuntimeError:
    pass  # Directory might already be mounted

# Request models
class SummarizeRequest(BaseModel):
    text: str
    method: Optional[str] = "tfidf"  # "tfidf" or "indicbart"

class URLRequest(BaseModel):
    url: str
    method: Optional[str] = "tfidf"

# Response models
class SummarizeResponse(BaseModel):
    summary: str
    audio_path: str
    method: str
    success: bool
    message: Optional[str] = None

class URLResponse(BaseModel):
    title: Optional[str] = None
    summary: str
    audio_path: str
    original_url: str
    method: str
    success: bool
    message: Optional[str] = None

@app.get("/")
def read_root():
    """Health check endpoint"""
    return {
        "status": "online",
        "message": "Telugu News Summarization API is running",
        "version": "1.0.0",
        "endpoints": {
            "/summarize": "POST - Summarize Telugu text",
            "/process-url": "POST - Process URL and summarize",
            "/audio/{filename}": "GET - Download audio file",
            "/health": "GET - Detailed health check"
        }
    }

@app.post("/summarize", response_model=SummarizeResponse)
async def summarize(request: SummarizeRequest):
    """
    Summarize Telugu text and generate audio
    
    Parameters:
    - text: Telugu text to summarize
    - method: Summarization method ("tfidf" or "indicbart")
    
    Returns:
    - summary: Summarized text
    - audio_path: Path to generated audio file
    - method: Method used for summarization
    """
    try:
        # Validate input
        if not request.text or not request.text.strip():
            raise HTTPException(
                status_code=400, 
                detail="Text cannot be empty"
            )
        
        # Validate method
        if request.method not in ["tfidf", "indicbart"]:
            raise HTTPException(
                status_code=400, 
                detail="Method must be either 'tfidf' or 'indicbart'"
            )
        
        # Run the summarization pipeline
        summary, audio_path = run_pipeline(
            text=request.text,
            method=request.method
        )
        
        # Check if summary was generated
        if not summary:
            raise HTTPException(
                status_code=500,
                detail="Failed to generate summary"
            )
        
        return SummarizeResponse(
            summary=summary,
            audio_path=audio_path,
            method=request.method,
            success=True,
            message="Summarization completed successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during summarization: {str(e)}"
        )

@app.post("/process-url", response_model=URLResponse)
async def process_url(request: URLRequest):
    """
    Extract text from URL, summarize, and generate audio
    
    Parameters:
    - url: News article URL
    - method: Summarization method ("tfidf" or "indicbart")
    
    Returns:
    - title: Article title (if available)
    - summary: Summarized text
    - audio_path: Path to generated audio file
    - original_url: The URL that was processed
    """
    try:
        # Validate URL
        if not request.url or not request.url.strip():
            raise HTTPException(
                status_code=400,
                detail="URL cannot be empty"
            )
        
        if not request.url.startswith(("http://", "https://")):
            raise HTTPException(
                status_code=400,
                detail="URL must start with http:// or https://"
            )
        
        # Validate method
        if request.method not in ["tfidf", "indicbart"]:
            raise HTTPException(
                status_code=400,
                detail="Method must be either 'tfidf' or 'indicbart'"
            )
        
        # Extract text from URL
        try:
            extracted_text = extract_text(request.url)
            if not extracted_text or not extracted_text.strip():
                raise HTTPException(
                    status_code=400,
                    detail="Could not extract text from the provided URL"
                )
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to fetch URL: {str(e)}"
            )
        
        # Run the summarization pipeline
        summary, audio_path = run_pipeline(
            text=extracted_text,
            method=request.method
        )
        
        if not summary:
            raise HTTPException(
                status_code=500,
                detail="Failed to generate summary"
            )
        
        return URLResponse(
            title="Article from URL",  # You can enhance this to extract actual title
            summary=summary,
            audio_path=audio_path,
            original_url=request.url,
            method=request.method,
            success=True,
            message="URL processed successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing URL: {str(e)}"
        )

@app.get("/audio/{filename}")
async def get_audio(filename: str):
    """
    Download generated audio file
    
    Parameters:
    - filename: Name of the audio file to download
    """
    try:
        # Construct the file path
        file_path = os.path.join("data", filename)
        
        # Check if file exists
        if not os.path.exists(file_path):
            raise HTTPException(
                status_code=404,
                detail=f"Audio file '{filename}' not found"
            )
        
        # Return the file
        return FileResponse(
            path=file_path,
            media_type="audio/mpeg",
            filename=filename
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error serving audio file: {str(e)}"
        )

@app.get("/health")
def health_check():
    """Detailed health check endpoint"""
    import sys
    
    return {
        "status": "healthy",
        "api_version": "1.0.0",
        "available_methods": ["tfidf", "indicbart"],
        "data_directory_exists": os.path.exists("data"),
        "python_version": sys.version,
        "endpoints": [
            "/summarize",
            "/process-url",
            "/audio/{filename}",
            "/health"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    
    # Ensure data directory exists
    os.makedirs("data", exist_ok=True)
    
    print("=" * 60)
    print("Telugu News Summarization API")
    print("=" * 60)
    print("Starting server on http://localhost:8000")
    print("API Documentation available at http://localhost:8000/docs")
    print("=" * 60)
    
    # Run the server
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True
    )