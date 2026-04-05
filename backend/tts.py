import asyncio
import os
import uuid
import edge_tts

from config import DATA_DIR, EDGE_TTS_RATE, EDGE_TTS_VOICE


async def _save_edge_tts(text: str, filepath: str) -> None:
    communicate = edge_tts.Communicate(
        text=text,
        voice=EDGE_TTS_VOICE,
        rate=EDGE_TTS_RATE,
    )
    await communicate.save(filepath)


def text_to_speech(text: str, filepath: str | None = None):
    """
    Backward-compatible TTS generator.
    - Keeps optional filepath support
    - Supports existing pipeline call signature: text_to_speech(text)
    """
    try:
        if not text or not text.strip():
            return None

        if filepath is None:
            filename = f"{uuid.uuid4()}.mp3"
            filepath = os.path.join(DATA_DIR, filename)

        asyncio.run(_save_edge_tts(text, filepath))
        return filepath
    except Exception as e:
        print(f"TTS Error: {e}")
        return None
