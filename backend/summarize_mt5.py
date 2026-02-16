"""
mT5 Telugu Summarizer - Lazy Loaded Version
"""

import os
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "mt5-telugu-news-finetuned")

MODEL_TO_USE = (
    MODEL_PATH if os.path.exists(MODEL_PATH)
    else "csebuetnlp/mT5_multilingual_XLSum"
)

LOCAL_ONLY = os.path.exists(MODEL_PATH)

# 🔥 Lazy load globals
tokenizer = None
model = None


def load_model():
    global tokenizer, model

    if tokenizer is not None and model is not None:
        return

    print("Loading mT5 model (lazy load)...")

    tokenizer = AutoTokenizer.from_pretrained(
        MODEL_TO_USE,
        local_files_only=LOCAL_ONLY
    )

    model = AutoModelForSeq2SeqLM.from_pretrained(
        MODEL_TO_USE,
        local_files_only=LOCAL_ONLY
    )

    model.eval()


def mT5_summarize(
    text: str,
    max_length: int = 128,
    min_length: int = 30,
    num_beams: int = 4,
    length_penalty: float = 2.0,
    no_repeat_ngram_size: int = 3,
) -> str:

    if not text or not text.strip():
        return ""

    # 🔥 Load model only when first request comes
    load_model()

    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        max_length=512
    )

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_length=max_length,
            min_length=min_length,
            num_beams=num_beams,
            length_penalty=length_penalty,
            no_repeat_ngram_size=no_repeat_ngram_size,
            early_stopping=True,
        )

    summary = tokenizer.decode(
        outputs[0],
        skip_special_tokens=True,
        clean_up_tokenization_spaces=True
    )

    return summary.strip()
