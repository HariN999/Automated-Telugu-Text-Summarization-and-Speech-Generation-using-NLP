import re
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

MODEL_NAME = "ai4bharat/indicbart-xlsum"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, use_fast=False)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)

def normalize_telugu(text):
    text = re.sub(r"[<>/]", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()

def indicbart_summarize(text):

    text = normalize_telugu(text)

    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        max_length=1024
    )

    outputs = model.generate(
        **inputs,
        max_length=120,
        min_length=40,
        num_beams=4
    )

    summary = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return summary