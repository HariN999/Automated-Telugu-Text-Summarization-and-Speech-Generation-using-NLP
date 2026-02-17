"""
Configuration Settings
"""
import os

# Directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_DIR = os.path.join(BASE_DIR, "model")

# Create directories if they don't exist
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(MODEL_DIR, exist_ok=True)

# Model Settings
MT5_BASE_MODEL = "csebuetnlp/mT5_multilingual_XLSum"
MT5_FINETUNED_PATH = os.path.join(MODEL_DIR, "mt5-telugu-finetuned")

# Summarization Settings
MAX_INPUT_LENGTH = 512
SUMMARY_MAX_LENGTH = 180
SUMMARY_MIN_LENGTH = 60
TFIDF_NUM_SENTENCES = 4   # slightly increase coverage

# Generation Settings (new section)
NUM_BEAMS = 4
LENGTH_PENALTY = 1.2
NO_REPEAT_NGRAM = 3


# TTS Settings
TTS_LANGUAGE = "te"
TTS_SLOW = False

# API Settings
API_HOST = "0.0.0.0"
API_PORT = 8000
CORS_ORIGINS = ["*"]