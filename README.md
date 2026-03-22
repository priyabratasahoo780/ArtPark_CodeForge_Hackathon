<div align="center">

# 🛠️ CodeForge AI

### **Adaptive Career Intelligence & Neural Roadmap Engine**

![CodeForge Hero Mockup](./docs/images/hero.png)

[![Vercel Deployment](https://img.shields.io/badge/Live-Frontend-success?style=for-the-badge&logo=vercel&logoColor=white)](https://art-park-code-forge-hackathon-nine.vercel.app/)
[![Render Deployment](https://img.shields.io/badge/Live-Backend-blue?style=for-the-badge&logo=render&logoColor=white)](https://artpark-codeforge-hackathon.onrender.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Gemini](https://img.shields.io/badge/Gemini%202.0%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)

<br/>

> **"Surgically extract skill gaps and build your path to mastery."**
> CodeForge AI uses **Google Gemini 2.0 Flash** to bridge the gap between your resume and your dream job with a DAG-powered adaptive roadmap.

[**Explore the Live App →**](https://art-park-code-forge-hackathon-nine.vercel.app/)

---

### 🏆 IISc × ArtPark CodeForge Hackathon 2026

</div>

---

## 💎 Key Features

<div align="center">

| 🧠 **Neural Roadmap** | 📊 **Gap Analytics** | 💻 **AI Sandbox** |
|---|---|---|
| DAG-based topological sorting for prerequisite-first learning. | 6-axis spider charts and depth/breadth scoring. | Real-time coding editor with an AI pair programmer. |

| 🃏 **Active Recall** | 🏆 **Dynamic Portfolio** | 🔊 **Voice Briefs** |
|---|---|---|
| Auto-generated AI flashcards for every skill in your resume. | Self-upgrading portfolio with AI-written project studies. | Audio briefings generated directly from your learning path. |

</div>

---

## 🚀 Live Environment

| Service | Environment | Endpoint |
|---|---|---|
| **Frontend UI** | Vercel | [art-park-code-forge-hackathon-nine.vercel.app](https://art-park-code-forge-hackathon-nine.vercel.app/) |
| **Backend API** | Render | [artpark-codeforge-hackathon.onrender.com](https://artpark-codeforge-hackathon.onrender.com) |
| **API Docs** | Swagger | [/docs](https://artpark-codeforge-hackathon.onrender.com/docs) |

---

## 📊 Sample Dashboard & Results

![Dashboard Screenshot](./docs/images/dashboard.png)

---

## 🤖 The AI Engine (Gemini 2.0 Flash)

CodeForge AI doesn't just "guess." It uses recursive LLM analysis to parse the deep semantics of resumes.

```mermaid
graph TD
    A[Raw Resume] --> B(Gemini Skill Extractor)
    C[Job Description] --> D(Gemini JD Extractor)
    B & D --> E{Gap Analyzer}
    E -->|Missing Nodes| F[Prerequisite Resolver]
    F --> G[DAG Roadmap Generator]
    G --> H((Neural Path))
```

---

## 📂 Complete Folder Structure

```
ArtPark_CodeForge_Hackathon/
│
├── README.md                          # This file
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI app backbone
│   │   ├── models/                    # Pydantic schemas
│   │   ├── routes/                    # Modular API routing
│   │   ├── services/                  # Core AI & Business Logic
│   │   │   ├── skill_extractor.py     # Gemini Skill Extraction
│   │   │   ├── gap_analyzer.py        # Gap Scoring (Fuzzy Match)
│   │   │   └── learning_path_generator.py # DAG-powered Pathing
│   │   └── datasets/                  # Curated Skill Knowledge Base
│   ├── requirements.txt               # Backend Dependencies
│   └── .env                           # API Keys (Gitignored)
│
└── frontend/
    ├── src/
    │   ├── App.jsx                    # Core State & Logic
    │   ├── components/                # 46+ Atomic UI Units
    │   │   ├── NeuralRoadmap.jsx      # SVG Graph Rendering
    │   │   ├── GapAnalysis.jsx        # Data Viz Layout
    │   │   └── CodingSandbox.jsx      # Pair Programmer Hook
    │   └── assets/                    # Design Tokens
    ├── package.json                   # UI Dependencies
    └── vite.config.js                 # Dev Server Config
```

---

## 🛠️ Quick Start (Developer Mode)

### 1. Clone & Prep
```bash
git clone https://github.com/priyabratasahoo780/Resume-generater.git
cd ArtPark_CodeForge_Hackathon
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

<div align="center">

Built with ⚡ by **Team Invisible.Coding** for the **ArtPark CodeForge Hackathon 2026**

[![GitHub](https://img.shields.io/badge/GitHub-priyabratasahoo780-181717?style=for-the-badge&logo=github)](https://github.com/priyabratasahoo780/Resume-generater)

</div>
