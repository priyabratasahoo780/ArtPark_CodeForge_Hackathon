<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=CodeForge%20AI&fontSize=60&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=AI-Powered%20Adaptive%20Career%20Intelligence%20Platform&descAlignY=60&descSize=18" />

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Gemini](https://img.shields.io/badge/Gemini%202.0%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![Python](https://img.shields.io/badge/Python_3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br/>

> **CodeForge AI** surgically compares your resume against any job description using Google Gemini 2.0 Flash,
> identifies your exact skill gaps, and builds a **personalized, dependency-ordered learning roadmap** — not a generic one-size-fits-all curriculum.

---

### ⚡ Built for the ArtPark × IISc CodeForge Hackathon

</div>

---

## 📺 Live Demo

```
Frontend  →  http://localhost:3000
Backend   →  http://localhost:8000
API Docs  →  http://localhost:8000/docs
```

---

## ✨ Feature Showcase

<details>
<summary><b>🔍 01 · Deep Resume × JD Analysis</b></summary>
<br/>

**What it does:**
Paste your raw resume text and a job description. Gemini 2.0 Flash surgically extracts all skills from both documents, categorises them by domain, and assigns proficiency levels.

**How to use:**
1. Navigate to the **Upload** tab (home screen)
2. Paste your resume in the left field
3. Paste the job description in the right field
4. Set your **Target Role** and optional deadline
5. Click **Initiate Deep Analysis**

**Why it matters:**  
Eliminates hours of manual gap-finding. The AI cross-references 150+ skill nodes in its internal taxonomy against both documents in under 3 seconds.

</details>

---

<details>
<summary><b>📊 02 · Results Dashboard</b></summary>
<br/>

**What it does:**
Displays a comprehensive breakdown across three panels:
- ✅ **Known Skills** — skills you already have
- ⚠️ **Partial Skills** — skills you have but need to deepen
- ❌ **Missing Skills** — skills the role requires that you lack

**How to use:**
After analysis completes, click the **Results** tab in the left sidebar. Each skill card shows category, gap score (1–3), and confidence level.

**Why it matters:**  
Gives you a precise, prioritised snapshot of your competitive position for the role — not a vague percentage.

</details>

---

<details>
<summary><b>🗺️ 03 · Neural Roadmap (Adaptive Learning Path)</b></summary>
<br/>

**What it does:**
Generates a **Directed Acyclic Graph (DAG)** of your learning path using topological sort. Each node is a skill, curved lines show prerequisite dependencies, and glow colours indicate status (mastered / in progress / locked).

**How to use:**
1. Click the **Roadmap** tab
2. Toggle between **Neural View** and **List View** using the top buttons
3. Click a skill node to mark it as complete — the roadmap updates in real-time
4. Check off nodes progressively to recalculate your path

**Why it matters:**  
Guarantees you never learn Topic B before Topic A. Prerequisite ordering is computed from `skill_graph.json` — a curated DAG of 150+ real engineering skills.

</details>

---

<details>
<summary><b>💻 04 · Coding Sandbox + AI Pair Programmer</b></summary>
<br/>

**What it does:**
An embedded coding environment with a **Flow Timer** (Pomodoro-style focus sessions) and an AI pair programmer that gives context-aware hints based on the skill you're currently practicing.

**How to use:**
1. Click **Sandbox** in the sidebar
2. Select a skill from your roadmap to practice
3. Write code in the editor
4. Press the 🤖 **Hint** button for an AI nudge specific to that skill

**Why it matters:**  
Practice beats passive reading. The AI pair programmer surfaces framework-specific tips (e.g. `useEffect` patterns for React, `Depends` injection for FastAPI) without giving away full answers.

</details>

---

<details>
<summary><b>🃏 05 · Active Recall Flashcards</b></summary>
<br/>

**What it does:**
Automatically generates question-and-answer flashcard pairs for your known skills. Cards are flip-animated and grouped by skill category.

**How to use:**
1. Click **Recall** in the sidebar
2. Click a card to flip it and reveal the answer
3. Use ← → arrows to navigate between cards
4. Cards are auto-generated from your resume skills — no setup needed

**Why it matters:**  
Spaced repetition and active recall are scientifically the most efficient knowledge-retention strategies. This turns your profile into a self-quizzing engine.

</details>

---

<details>
<summary><b>🏆 06 · Technical Portfolio Generator</b></summary>
<br/>

**What it does:**
Auto-generates a **Verified Technical Portfolio** with:
- Mastery badge tier (Neural Explorer → Elite Coder → etc.)
- Auto-written project case studies based on your skills
- Performance benchmarks and contribution metrics

**How to use:**
1. Click **Portfolio** in the sidebar
2. Your portfolio is generated immediately from your resume skills
3. As you complete more roadmap nodes, the portfolio upgrades automatically

**Why it matters:**  
Gives you a shareable proof of competence that exists _beyond_ your resume — powered by verifiable skill data.

</details>

---

<details>
<summary><b>🔮 07 · 2030 Future Skill Map</b></summary>
<br/>

**What it does:**
Projects which skills in your profile will be **high demand**, **stable**, or **deprecated** by 2030 based on industry trajectory data.

**How to use:**
1. Click **2030** in the sidebar
2. Review your skills sorted into quadrants: Invest / Hold / Watch / Deprecate
3. Use this to prioritise which gaps to close first

**Why it matters:**  
Stops you from investing 100 hours in a technology that will be automated away in 3 years.

</details>

---

<details>
<summary><b>📈 08 · Insights Dashboard (4 Panels)</b></summary>
<br/>

**What it does:**

| Panel | Description |
|---|---|
| 🔥 **Learning Momentum** | 28-day activity heatmap, XP points, streak counter, rank progression |
| 🎯 **6-Axis Readiness Radar** | Spider chart across Coverage, Depth, Breadth, Relevance, Velocity, Confidence |
| 💰 **Salary Predictor** | 3-tier salary range (entry/optimised/expert), market percentile, top-paying skill chips |
| 💼 **AI Job Matcher** | 5 live-matched open roles with per-skill match/miss badges and animated match bars |

**How to use:**
1. Click **Insights** in the sidebar
2. All 4 panels auto-populate from your resume skills immediately after analysis
3. Streaks update as you complete roadmap nodes

**Why it matters:**  
Converts your raw skill data into actionable career intelligence — salary negotiation data, percentile standing, and matched job opportunities — in one unified view.

</details>

---

<details>
<summary><b>⚡ 09 · Alpha Lab (Experimental)</b></summary>
<br/>

**What it does:**
- **UI Vision** — AI-generated UI concept mockups for your portfolio
- **Pitch Generator** — 60-second elevator pitch for interviews
- **Skill Galaxy** — 3D orbital visualization of your skill ecosystem
- **Code Radar** — Code quality pattern analysis

**How to use:**  
Click **Alpha** in the sidebar. These features work with your current skill set and do not require additional input.

</details>

---

<details>
<summary><b>🛡️ 10 · Elite Tier Features</b></summary>
<br/>

**What it does:**
- **Squad Hub** — Simulate team composition for technical leadership roles
- **Executive Packet** — One-click executive-formatted resume summary
- **System Guardian** — Real-time health monitoring for all backend microservices

**How to use:**  
Click **Elite** in the sidebar. Executive Packet uses your resume data to generate a formatted output instantly.

</details>

---

<details>
<summary><b>🌐 11 · Global Ecosystem Map</b></summary>
<br/>

**What it does:**
Live heatmap showing which skills are trending across global tech hubs (San Francisco, Bengaluru, London, Tokyo) and a global readiness average index.

**How to use:**  
Click **Ecosystem** in the sidebar to see the live market intelligence view.

</details>

---

<details>
<summary><b>👤 12 · Recruiter View</b></summary>
<br/>

**What it does:**
Toggles the entire interface from candidate view to recruiter view — a simplified, high-signal dashboard showing only match score, top skills, and readiness percentage.

**How to use:**
Click the **Recruiter View** button at the bottom of the left sidebar. Click **Candidate View** to return.

**Why it matters:**  
You can simulate what a recruiter sees when they look at your profile and optimise accordingly.

</details>

---

## 🚀 Getting Started

### Prerequisites

```bash
Python 3.11+   Node.js 18+   npm 9+   Git
```

### 1. Clone the Repository

```bash
git clone https://github.com/priyabratasahoo780/Resume-generater.git
cd ArtPark_CodeForge_Hackathon
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/macOS

pip install -r requirements.txt
```

Create `.env` in the `backend/` folder:

```env
GEMINI_API_KEY=your_gemini_api_key_here
SECRET_KEY=your_jwt_secret_key
```

Start the backend:

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at **http://localhost:3000**

---

## 🏗️ Architecture

```
User Input (Resume + Job Description)
         │
         ▼
   [Gemini 2.0 Flash] ←─ SkillExtractor
         │
    ┌────┴────┐
    ▼         ▼
Resume      JD Skills
Skills
    │         │
    └────┬────┘
         ▼
  [SkillGapAnalyzer]  ← fuzzy match + level comparison
         │
   known / partial / missing
         │
         ▼
  [DependencyResolver] ← skill_graph.json (DAG)
         │
  topological sort → prerequisite order
         │
         ▼
  [LearningPathGenerator] ← time estimates + modules
         │
         ▼
  [CourseRecommender] ← course_dataset.json
         │
         ▼
  React Frontend: NeuralRoadmap + Portfolio + Insights
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **LLM** | Google Gemini 2.0 Flash |
| **Backend** | FastAPI + Uvicorn |
| **Frontend** | React 18 + Vite |
| **Animations** | Framer Motion |
| **Icons** | React Icons (Feather) |
| **HTTP** | Axios |
| **Auth** | JWT (python-jose) |
| **AI Client** | google-generativeai |

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/analyze` | Full resume × JD analysis |
| `GET` | `/streak/data` | Streak + XP + heatmap |
| `POST` | `/resume/score` | 6-axis readiness radar |
| `POST` | `/salary/predict` | Salary range prediction |
| `POST` | `/jobs/match` | AI job matching |
| `POST` | `/portfolio/generate` | Portfolio generation |
| `POST` | `/learning/flashcards` | Flashcard generation |
| `POST` | `/roadmap/generate` | AI roadmap generation |
| `GET`  | `/docs` | Interactive Swagger UI |

---

## 🧩 Algorithms

### Adaptive Pathing (Graph-Based Topological Sort)

```python
def resolve(target_skills, known_skills):
    # 1. For each target skill → look up prerequisites in DAG
    # 2. Recursively inject missing prerequisites
    # 3. Topological sort guarantees A before B
    # 4. Filter out already-known skills
    # 5. Return ordered list → LearningPathGenerator wraps into modules
```

### Skill Extraction Pipeline

```
Raw Text → Gemini Prompt → JSON response
       → markdown strip (```json...```)
       → json.loads()
       → SkillGapAnalyzer
       → fuzzy category match
       → gap severity scoring
```

---

## 📂 Project Structure

```
ArtPark_CodeForge_Hackathon/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app + all endpoints
│   │   ├── services/
│   │   │   ├── skill_extractor.py   # Gemini API integration
│   │   │   ├── gap_analyzer.py      # Skill gap logic
│   │   │   ├── learning_path_generator.py
│   │   │   ├── dominance_services.py  # Portfolio + badges
│   │   │   └── ecosystem_services.py  # Flashcards + sandbox
│   │   └── data/
│   │       ├── skill_graph.json     # Dependency DAG
│   │       ├── skills_taxonomy.json # 150+ skill taxonomy
│   │       └── course_dataset.json  # Curated course links
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── App.jsx                  # Main app + routing
    │   └── components/
    │       ├── NeuralRoadmap.jsx
    │       ├── TechnicalPortfolio.jsx
    │       ├── FlashcardDeck.jsx
    │       ├── DailyStreak.jsx
    │       ├── ResumeScoreRadar.jsx
    │       ├── SalaryPredictor.jsx
    │       ├── JobMatcher.jsx
    │       └── ... (25+ components)
    └── vite.config.js
```

---

## 📊 Datasets Used

| Dataset | Purpose |
|---|---|
| Internal `skill_graph.json` | 150+ skill prerequisite DAG |
| Internal `skills_taxonomy.json` | Skill categorisation + normalisation |
| Internal `course_dataset.json` | Curated learning resources per skill |
| [Kaggle Resume Dataset](https://www.kaggle.com/datasets/snehaanbhawal/resume-dataset/data) | Resume parsing testing |
| [O*NET Database](https://www.onetcenter.org/db_releases.html) | Occupational skill taxonomy alignment |
| [Kaggle Jobs & JD Dataset](https://www.kaggle.com/datasets/kshitizregmi/jobs-and-job-description) | JD skill extraction benchmarking |

---

## 🤝 Contributing

```bash
# 1. Fork the repo
# 2. Create a feature branch
git checkout -b feat/your-feature-name

# 3. Commit your changes
git commit -m "feat: add amazing feature"

# 4. Push and open a PR
git push origin feat/your-feature-name
```

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" />

**Built with ⚡ by Team CodeForge · ArtPark × IISc Hackathon 2026**

[![GitHub](https://img.shields.io/badge/GitHub-priyabratasahoo780-181717?style=for-the-badge&logo=github)](https://github.com/priyabratasahoo780/Resume-generater)

</div>
