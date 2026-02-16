# 🧠 Automated Telugu Text Summarization & Speech Generation using NLP

An end-to-end AI system that performs **Telugu news understanding, summarization, and speech synthesis** through a scalable web interface.

This project combines **extractive NLP techniques** with **transformer-based abstractive models** to generate concise Telugu summaries and convert them into natural audio output.

Designed as a full-stack AI pipeline, the system integrates modern frontend engineering with production-ready FastAPI services.

---

# ✨ Key Highlights

* 🇮🇳 Telugu-focused NLP pipeline
* ⚡ Fast extractive summarization (TF-IDF)
* 🤖 Transformer-based abstractive summarization (mT5)
* 🔊 Automated Telugu Text-to-Speech generation
* 🌐 URL article extraction + direct text input
* 🧩 Modular pipeline architecture
* 🌙 Light/Dark themed modern UI
* 🚀 FastAPI backend with React frontend

---

# 🏗 Architecture Overview

```
React (Vite) Frontend
          │
          ▼
FastAPI REST API
          │
          ▼
Pipeline Controller
          │
          ▼
Extraction → Cleaning → Summarization → TTS
```

### Processing Flow

1. Article Extraction (URL/Text)

2. Telugu Text Normalization

3. Summarization

   * TF-IDF (Extractive)
   * mT5 (Abstractive Transformer)

4. Audio Generation (gTTS)

---

# 🧠 Tech Stack

## Backend

* Python
* FastAPI
* Hugging Face Transformers
* PyTorch
* scikit-learn
* BeautifulSoup
* gTTS

## Frontend

* React (Vite)
* Tailwind CSS
* Framer Motion
* Lucide Icons

## Models

* TF-IDF Extractive Summarizer
* mT5 Multilingual XLSum (csebuetnlp/mT5_multilingual_XLSum)

---

# 📁 Project Structure

```
Automated-Telugu-Summarization/
│
├── backend/
│   ├── app.py
│   ├── pipeline.py
│   ├── extract.py
│   ├── clean.py
│   ├── summarize_tfidf.py
│   ├── summarize_mt5.py
│   ├── tts.py
│   └── model/
│
├── frontend/
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── services/
│       └── App.jsx
│
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/HariN999/Automated-Telugu-Text-Summarization-and-Speech-Generation-using-NLP.git
cd Automated-Telugu-Text-Summarization-and-Speech-Generation-using-NLP
```

---

## 2️⃣ Backend Setup

```bash
cd backend
python -m venv myenv
source myenv/bin/activate
pip install -r requirements.txt
```

---

## 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

---

# ▶️ Run Application

## Start Backend

```bash
cd backend
uvicorn app:app --reload
```

API available at:

```
http://localhost:8000/docs
```

---

## Start Frontend

```bash
cd frontend
npm run dev
```

Open:

```
http://localhost:5173
```

---

# 🔌 API Usage

## POST `/summarize`

```json
{
  "text": "తెలుగు వార్తా టెక్స్ట్",
  "method": "mt5"
}
```

### Response

```json
{
  "summary": "...",
  "audio_url": "/audio/xxxxx.mp3",
  "method": "mt5"
}
```

---

## POST `/process-url`

```json
{
  "url": "https://example.com/news",
  "method": "tfidf"
}
```

---

# 📊 Evaluation

Model performance evaluated using:

* ROUGE-1
* ROUGE-2
* ROUGE-L
* BERTScore (experimental)

Comparative evaluation performed between:

* TF-IDF Extractive
* mT5 Abstractive

---

# 🎯 Research Motivation

Telugu NLP resources remain limited compared to English pipelines.
This project explores hybrid summarization techniques combining:

* statistical sentence ranking
* transformer-based multilingual generation

to improve accessibility of regional news content.

---

# 🚧 Current Limitations

* Designed for article-level summarization
* Large transformer inference may increase latency
* TTS voice quality depends on available pretrained engines

---

# 🔮 Future Roadmap

* Fine-tuned Telugu-specific transformer model
* Streaming summarization
* Dockerized deployment
* GPU inference optimization
* Multi-source news aggregation
* Query-aware summarization

---

# 🤝 Contributing

Contributions are welcome.

```
1. Fork repository
2. Create feature branch
3. Commit changes
4. Open Pull Request
```

---

# 📜 License

MIT License

---

# 👨‍💻 Maintainer

**Hariharan**

GitHub → [https://github.com/HariN999](https://github.com/HariN999)

---

## ⭐ If this project helps you, consider giving it a star!

---
