# 📰 Automated Telugu Text Summarization and Speech Generation

Full-stack AI web application for **Telugu news understanding**, combining extractive and abstractive NLP with optional speech generation.

This system enables users to input Telugu text or news URLs and receive concise summaries along with optional Telugu audio playback.

---

# 🚀 Overview

This project implements a **deployment-ready multilingual NLP pipeline** built using:

* ⚛️ **React + Vite** frontend
* ⚡ **FastAPI** backend
* 🤖 Hybrid summarization architecture:

  * TF-IDF (Extractive)
  * mT5 Base (XLSum pretrained)
  * mT5 Fine-Tuned (XLSum Telugu subset)
* 🔊 Telugu Text-to-Speech using **gTTS**

The architecture is modular and mirrors the research system described in the accompanying paper.

---

# ✨ Features

## 📄 Summarization Modes

* Direct Telugu text summarization
* URL-based article extraction and summarization
* News Speak mode with backend-generated summaries

## 🎧 Audio

* Optional Telugu MP3 generation via gTTS
* Native browser playback controls

## 🧠 NLP Pipeline

* BeautifulSoup extraction
* Telugu Unicode cleaning
* Runtime model selection:

  * `tfidf`
  * `mt5_base`
  * `mt5_finetuned`

## 🎨 Frontend

* TextSummarize page
* PasteUrl page
* Speak news reader
* Light/Dark theme support

---

# 🏗️ Architecture

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

### Pipeline Components

* `extract.py` — URL parsing
* `clean.py` — Telugu regex normalization
* `summarize_tfidf.py` — extractive summarizer
* `summarize_mt5.py` — transformer summarization
* `tts.py` — gTTS speech synthesis

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

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd <project-folder>
```

---

## 2️⃣ Backend Setup (Python)

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

Docs:

```
http://localhost:8000/docs
```

---

## 3️⃣ Frontend Setup (Node.js)

```bash
cd frontend
npm install
npm run dev
```

App:

```
http://localhost:5173
```

Optional environment variable:

```
VITE_API_URL=http://localhost:8000
```

---

# 🔌 API Endpoints

## Health

```
GET /
GET /health
```

## Summarization

```
POST /summarize
POST /process-url
```

Example body:

```json
{
  "text": "తెలుగు టెక్స్ట్...",
  "method": "mt5_finetuned",
  "generate_audio": true
}
```

## News

```
GET /latest-news
```

## Audio

```
GET /audio/{filename}
```

---

# 🔊 Audio System

Speech generation is implemented using:

```python
from gtts import gTTS
```

* Language: Telugu (`lang="te"`)
* Output: MP3 files
* Stored under backend audio directory
* Served via FastAPI `/audio` route

---

# 🧪 Evaluation & Research Scripts

These scripts are **not runtime components**:

* `rouge_eval.py`
* `test_base_models.py`

Used for:

* ROUGE scoring
* Model comparison experiments

---

# 📊 Models

| Method         | Type        | Description                                |
| -------------- | ----------- | ------------------------------------------ |
| TF-IDF         | Extractive  | Fast sentence ranking                      |
| mT5 Base       | Abstractive | XLSum pretrained                           |
| mT5 Fine-Tuned | Abstractive | Continued training on XL-Sum Telugu subset |

---

# 🧩 Design Decisions

* Production voice engine uses **gTTS only**
* Speak module simplified to Telugu news workflow
* Weather and experimental voice engines removed
* Modular architecture supports future model swapping

---

# 🔮 Future Improvements

* Larger evaluation corpus
* Telugu morphological normalization
* Hybrid extractive + abstractive pipeline
* Multilingual extension (Tamil, Kannada, Malayalam)
* Improved factuality evaluation

---

# 📄 Research Context

This repository accompanies a research system demonstrating:

* Low-resource Indian language NLP deployment
* Runtime model switching via API parameter
* Full-stack integration of summarization and speech synthesis

---

# 🧑‍💻 Author

**Narlakanti Hariharan**
**Vivek Nidumolu**



---

# Contributions

**Vive Nidumolu**