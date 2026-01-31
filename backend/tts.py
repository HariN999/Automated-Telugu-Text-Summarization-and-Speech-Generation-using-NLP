from gtts import gTTS
import uuid
import os

def text_to_speech(text):

    os.makedirs("data", exist_ok=True)

    filename = f"{uuid.uuid4()}.mp3"
    output_path = f"data/{filename}"

    tts = gTTS(text=text, lang="te")
    tts.save(output_path)

    return output_path