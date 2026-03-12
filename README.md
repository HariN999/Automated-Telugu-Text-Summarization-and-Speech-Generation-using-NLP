# 📰 Automated Telugu Text Summarization and Speech Generation

Full-stack AI web application for **Telugu news understanding**, combining extractive and abstractive NLP with optional speech synthesis.

This system enables users to input Telugu text or news URLs and receive concise summaries along with optional Telugu audio playback.

---

# 🚀 Project Highlights

- ✅ End-to-end working NLP system
- ✅ Extractive + Transformer-based summarization
- ✅ Runtime model switching via API
- ✅ Telugu Text-to-Speech generation
- ✅ Full-stack React + FastAPI integration
- ✅ Research-backed architecture with evaluation scripts

---

# 📸 Application Screenshots

## 🏠 Home Page

![Home Page](./Home.png)

Landing dashboard providing access to summarization and news speech modules.

---

## 📝 Text Summarization

![Text Summarization](./Text.png)

Features:

- Direct Telugu text input
- Model selection:
  - `tfidf`
  - `mt5_base`
  - `mt5_finetuned`
- Optional MP3 generation

---

## 🌐 URL Summarization

![URL Summarization](./URL.png)

- Automatic article extraction via BeautifulSoup
- Cleaning and normalization of Telugu Unicode
- Transformer or extractive summarization

---

## 🔊 Speak News Module

![Speak News](./Speak.png)

- Fetches latest Telugu news from backend
- Generates summary automatically
- Produces Telugu MP3 output

---

## 📄 FastAPI Documentation

![API Docs](./Docs.png)

Interactive Swagger UI available at:

http://localhost:8000/docs

---

# 🏗️ System Architecture

```

React Frontend  →  FastAPI Backend  →  NLP Pipeline

Input (Text/URL)
│
▼
Extraction → Cleaning → Summarization → gTTS (optional)
│
▼
JSON Response + Audio URL

```

---

# 🧠 NLP Pipeline Components

| File               | Purpose                             |
| ------------------ | ----------------------------------- |
| extract.py         | URL parsing & article extraction    |
| clean.py           | Telugu regex normalization          |
| summarize_tfidf.py | Extractive TF-IDF summarization     |
| summarize_mt5.py   | Transformer-based summarization     |
| tts.py             | Telugu speech generation using gTTS |
| pipeline.py        | Orchestrates full flow              |

---

# 📊 Models Implemented

| Method         | Type        | Description                             |
| -------------- | ----------- | --------------------------------------- |
| TF-IDF         | Extractive  | Fast sentence ranking baseline          |
| mT5 Base       | Abstractive | XLSum pretrained multilingual model     |
| mT5 Fine-Tuned | Abstractive | Further trained on Telugu XL-Sum subset |

---

# 📂 Project Structure

```

.
├── backend/
│   ├── app.py
│   ├── pipeline.py
│   ├── tts.py
│   ├── extract.py
│   ├── clean.py
│   ├── summarize_tfidf.py
│   ├── summarize_mt5.py
│   ├── services/news_service.py
│   ├── rouge_eval.py
│   └── test_base_models.py
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── TextSummarize.jsx
│   │   │   ├── PasteUrl.jsx
│   │   │   └── Speak.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── speakService.js
│   │   └── context/
│   └── package.json
│
├── requirements.txt
└── README.md

```

---

# ⚙️ Installation Guide

## 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd <project-folder>
```

---

## 2️⃣ Backend Setup

```bash
python -m venv myenv
source myenv/bin/activate     # macOS/Linux
# myenv\Scripts\activate      # Windows

pip install -r requirements.txt
```

Run backend:

```bash
cd backend
uvicorn app:app --reload
```

Backend URL:

[http://localhost:8000](http://localhost:8000)

---

## 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

[http://localhost:5173](http://localhost:5173)

Optional environment variable:

```
VITE_API_URL=http://localhost:8000
```

---

# 🔌 API Endpoints

### Health

```
GET /
GET /health
```

### Summarization

```
POST /summarize
POST /process-url
```

Example request:

```json
{
  "text": "తెలుగు టెక్స్ట్...",
  "method": "mt5_finetuned",
  "generate_audio": true
}
```

### News

```
GET /latest-news
```

### Audio

```
GET /audio/{filename}
```

---

# 🔊 Speech System

Implemented using:

```python
from gtts import gTTS
```

- Language: Telugu (`lang="te"`)
- Output: MP3
- Stored in backend audio directory
- Served via `/audio` endpoint

---

# 🧪 Evaluation & Research Scripts

These scripts are experimental and not part of runtime:

- rouge_eval.py
- test_base_models.py

Used for:

- ROUGE scoring
- Comparative model evaluation

---

# 🧩 Key Design Decisions

- gTTS selected for production stability
- Modular architecture for easy model swapping
- Clear separation of research and production components
- Simplified Speak module for focused Telugu news workflow

---

# 🔮 Future Enhancements

- Larger evaluation dataset
- Telugu morphological normalization
- Hybrid extractive + abstractive pipeline
- Multilingual expansion (Tamil, Kannada, Malayalam)
- Improved factual consistency validation

---

# 📄 Research Context

This repository demonstrates:

- Low-resource Indian language NLP deployment
- Transformer fine-tuning for Telugu
- Full-stack AI integration
- Runtime model selection via API parameter

---

# 👥 Project Team

This project was developed as a collaborative academic group project.

- Narlakanti Hariharan
- Vivek Nidumolu
- Vishnu Vardhan
- Sanjeev Practur

---

# 🤝 Contribution Overview

The team collaboratively contributed to:

- Frontend Development (React + UI Integration)
- Backend Development (FastAPI + API Design)
- NLP Pipeline Implementation (TF-IDF + mT5 Models)
- Model Evaluation & ROUGE Experiments
- Research Documentation & System Integration
