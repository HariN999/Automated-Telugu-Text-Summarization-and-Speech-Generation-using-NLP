```md
# 📰 Automated Telugu News Summarization & Speech Generation using NLP

An end-to-end AI system that automatically summarizes Telugu news articles and converts the summaries into natural-sounding speech.  
The system supports both extractive and abstractive summarization and provides outputs through a modern web interface.

---

## 🚀 Features

- Telugu text cleaning & preprocessing  
- Extractive summarization using TF-IDF  
- Abstractive summarization using IndicBART (Transformer model)  
- Text-to-Speech generation for Telugu  
- FastAPI backend  
- React frontend  
- Streamlit demo interface  
- URL input & direct text input support  

---

## 🏗 System Architecture

```

React Frontend
|
v
FastAPI Backend
|
v
Pipeline Controller
|
v
Extraction → Cleaning → Summarization → TTS

```

---

## 🧠 Tech Stack

**Backend**
- Python  
- FastAPI  
- Hugging Face Transformers  
- scikit-learn  
- BeautifulSoup  
- gTTS  

**Frontend**
- React (Vite)  
- React Router  

**Models**
- TF-IDF  
- IndicBART (ai4bharat/indicbart-xlsum)

---

## 📂 Project Structure

```

project-root/
├── backend/
│    ├── app.py
│    ├── pipeline.py
│    ├── extraction.py
│    ├── cleaning.py
│    ├── tfidf_summarizer.py
│    ├── indicbart_summarizer.py
│    ├── tts.py
│    └── requirements.txt
│
├── frontend/
│    └── src/
│         ├── api/
│         ├── pages/
│         └── App.jsx
│
└── README.md

````

---

## ⚙️ Installation

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd <project-folder>
````

### 2️⃣ Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

---

## ▶️ Run Project

### Start Backend

```bash
cd backend
uvicorn app:app --reload
```

### Start Frontend

```bash
cd frontend
npm run dev
```

Open in browser:

```
http://localhost:5173
```

---

## 🔗 API Endpoint

### POST /summarize

```json
{
  "text": "తెలుగు వార్త టెక్స్ట్",
  "method": "tfidf"
}
```

Response:

```json
{
  "summary": "...",
  "audio": "data/xxxxx.mp3"
}
```

---

## 📊 Evaluation

* ROUGE-1, ROUGE-2, ROUGE-L
* Manual readability analysis

---

## 🚧 Limitations

* Article-level summarization only
* Performance depends on model size
* Telugu TTS quality depends on pretrained voices

---

## 🔮 Future Enhancements

* Query-focused summarization
* Model fine-tuning for Telugu
* Multi-language support
* Docker deployment

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Open Pull Request

---

## 📜 License

MIT License

---

## 👨‍💻 Maintainer

Hariharan
GitHub: [https://github.com/HariN999](https://github.com/HariN999)

```
