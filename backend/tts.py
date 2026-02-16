"""
Text-to-Speech Module
Converts Telugu text to audio using gTTS
"""
import os
import uuid
from gtts import gTTS
from config import DATA_DIR, TTS_LANGUAGE, TTS_SLOW


def text_to_speech(text: str) -> str:
    """
    Convert Telugu text to speech and save as MP3
    
    Args:
        text: Telugu text to convert
        
    Returns:
        Filename of generated audio file (not full path)
    """
    if not text or not text.strip():
        return None
    
    try:
        # Generate unique filename
        filename = f"{uuid.uuid4()}.mp3"
        output_path = os.path.join(DATA_DIR, filename)
        
        # Generate speech
        tts = gTTS(text=text, lang=TTS_LANGUAGE, slow=TTS_SLOW)
        tts.save(output_path)
        
        return filename  # Return just the filename, not full path
    
    except Exception as e:
        print(f"❌ TTS generation failed: {e}")
        return None