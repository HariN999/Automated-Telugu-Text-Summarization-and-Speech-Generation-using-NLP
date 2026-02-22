from gtts import gTTS
import os
import uuid
from config import DATA_DIR


def text_to_speech(text: str, filepath: str | None = None):
    """
    Backward-compatible gTTS generator.
    - Keeps optional filepath support
    - Supports existing pipeline call signature: text_to_speech(text)
    """
    try:
        if not text or not text.strip():
            return None

        if filepath is None:
            filename = f"{uuid.uuid4()}.mp3"
            filepath = os.path.join(DATA_DIR, filename)

        tts = gTTS(text=text, lang="te")
        tts.save(filepath)
        return filepath
    except Exception as e:
        print(f"TTS Error: {e}")
        return None
