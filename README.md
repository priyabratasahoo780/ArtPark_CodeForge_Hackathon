<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=220&section=header&text=CodeForge%20AI&fontSize=70&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=AI-Powered%20Adaptive%20Career%20Intelligence%20Platform&descAlignY=60&descSize=20" />

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Gemini](https://img.shields.io/badge/Gemini%202.0%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![Python](https://img.shields.io/badge/Python_3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer)](https://framer.com/motion)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br/>

> **CodeForge AI** surgically compares your resume against any job description using **Google Gemini 2.0 Flash**,
> identifies exact skill gaps, and builds a **personalized, dependency-ordered learning roadmap** using a DAG-based topological sort algorithm.

---

### ⚡ Built for the ArtPark × IISc CodeForge Hackathon 2026

</div>

---

## 🔗 Live Localhost Links

| Service | URL | Description |
|---|---|---|
| 🖥️ **Frontend App** | [http://localhost:3000](http://localhost:3000) | Main React UI |
| ⚙️ **Backend API** | [http://localhost:8000](http://localhost:8000) | FastAPI server |
| 📚 **Swagger Docs** | [http://localhost:8000/docs](http://localhost:8000/docs) | Interactive API Explorer |
| 🔁 **ReDoc** | [http://localhost:8000/redoc](http://localhost:8000/redoc) | Alternative API Docs |
| ❤️ **Health Check** | [http://localhost:8000/health](http://localhost:8000/health) | Server health status |

---

## 🤖 LLMs & AI Models Used

| Model | Provider | Version | Used For |
|---|---|---|---|
| **Gemini 2.0 Flash** | Google DeepMind | `models/gemini-2.0-flash` | Resume skill extraction |
| **Gemini 2.0 Flash** | Google DeepMind | `models/gemini-2.0-flash` | Job description skill extraction |
| **Gemini 2.0 Flash** | Google DeepMind | `models/gemini-2.0-flash` | AI roadmap generation |
| **Gemini 2.0 Flash** | Google DeepMind | `models/gemini-2.0-flash` | Portfolio case study generation |
| **Rule-based Fallback** | Internal | — | Keyword-based extraction when LLM unavailable |

### How Gemini is Integrated

```python
# backend/app/services/skill_extractor.py
import google.generativeai as genai

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("models/gemini-2.0-flash")

prompt = f"""
Extract all technical skills from the resume below.
Return ONLY a JSON array of objects with:
  - name: skill name
  - category: one of [Frontend, Backend, ML/AI, DevOps, Data, Mobile, Cloud, Soft Skills]
  - level: one of [beginner, intermediate, advanced, expert]
  - confidence: 0.0-1.0

Resume: {resume_text}
"""
response = model.generate_content(prompt)
# Strip markdown code fences if present
raw = response.text.strip().removeprefix("```json").removesuffix("```").strip()
skills = json.loads(raw)
```

---

## 📂 Datasets Used

| Dataset | Source | Size | Used For |
|---|---|---|---|
| `skill_graph.json` | Internal (curated) | 150+ skills | Prerequisite DAG for adaptive pathing |
| `skills_taxonomy.json` | Internal (curated) | 200+ entries | Skill normalisation and category classification |
| `course_dataset.json` | Internal (curated) | 80+ courses | Curated learning resource links per skill |
| `roles.json` | Internal (curated) | 12 roles | Standard engineering role skill profiles |
| [Resume Dataset](https://www.kaggle.com/datasets/snehaanbhawal/resume-dataset/data) | Kaggle | 2,400+ resumes | Resume parsing pattern testing |
| [O*NET Database](https://www.onetcenter.org/db_releases.html) | US Dept. of Labor | ~1,000 occupations | Industry-standard occupational skill taxonomy |
| [Jobs & JD Dataset](https://www.kaggle.com/datasets/kshitizregmi/jobs-and-job-description) | Kaggle | 3,800+ JDs | JD skill extraction benchmarking |

---

## 🛠️ Full Tech Stack

### Backend

| Library | Version | Purpose |
|---|---|---|
| `fastapi` | 0.111+ | REST API framework |
| `uvicorn` | 0.29+ | ASGI server |
| `google-generativeai` | 0.5+ | Gemini 2.0 Flash client |
| `python-dotenv` | 1.0+ | Environment variable management |
| `python-jose` | 3.3+ | JWT authentication tokens |
| `passlib` | 1.7+ | Password hashing (bcrypt) |
| `python-multipart` | 0.0.9+ | Multipart form data (file upload) |
| `httpx` | 0.27+ | Async HTTP client |
| `pydantic` | 2.x | Request/response data validation |

### Frontend

| Library | Version | Purpose |
|---|---|---|
| `react` | 18.x | UI framework |
| `vite` | 7.x | Build tool and dev server |
| `framer-motion` | 11.x | Animation and transitions |
| `axios` | 1.x | HTTP requests to backend |
| `react-icons` | 5.x | Icon library (Feather set) |

---

## 📁 Complete Folder Structure

```
ArtPark_CodeForge_Hackathon/
│
├── README.md                          # This file
├── test_backend.py                    # Backend integration test script
│
├── backend/
│   ├── .env                           # API keys and secrets (gitignored)
│   ├── requirements.txt               # Python dependencies
│   ├── backend_log.txt                # Uvicorn runtime logs
│   │
│   ├── app/
│   │   ├── main.py                    # FastAPI app — all 40+ endpoints
│   │   │
│   │   ├── models/                    # Pydantic request/response schemas
│   │   │   ├── user.py
│   │   │   └── analysis.py
│   │   │
│   │   ├── routes/                    # Route handlers (modular)
│   │   │   └── auth.py
│   │   │
│   │   ├── services/                  # Core business logic
│   │   │   ├── skill_extractor.py     # Gemini API — resume & JD skill extraction
│   │   │   ├── gap_analyzer.py        # Skill gap analysis with fuzzy matching
│   │   │   ├── learning_path_generator.py  # Dependency-ordered learning path
│   │   │   ├── dominance_services.py  # Portfolio + badge generation
│   │   │   ├── ecosystem_services.py  # Flashcards + pair programmer
│   │   │   └── auth_service.py        # JWT auth logic
│   │   │
│   │   ├── utils/                     # Shared utilities
│   │   │
│   │   └── datasets/                  # Curated knowledge base
│   │       ├── skill_graph.json       # 150+ skill prerequisite DAG
│   │       ├── skills_taxonomy.json   # Skill normalisation map
│   │       ├── course_dataset.json    # Curated courses per skill
│   │       └── roles.json             # Engineering role profiles
│   │
│   ├── static/
│   │   └── audio/
│   │       └── briefings/             # AI voice briefing audio files
│   │
│   └── venv/                          # Python virtual environment (gitignored)
│
└── frontend/
    ├── index.html                     # SPA entry point
    ├── vite.config.js                 # Vite dev server config (port 3000)
    ├── package.json                   # Node dependencies
    │
    └── src/
        ├── App.jsx                    # Root app — routing, state, layout
        ├── main.jsx                   # React DOM entry
        ├── index.css                  # Global CSS + glass-card utilities
        │
        └── components/                # 46 React components
            │
            ├── ── Core Flow ──
            ├── UploadSection.jsx      # Resume + JD input form
            ├── Login.jsx              # JWT login form
            ├── ProtectedRoute.jsx     # Auth guard wrapper
            │
            ├── ── Analysis Results ──
            ├── SkillsAnalysis.jsx     # Skills breakdown cards
            ├── GapAnalysis.jsx        # Gap scoring and stats
            ├── ResumeFeedback.jsx     # AI resume improvement tips
            ├── LearningPath.jsx       # Text-based learning path
            ├── TimeSavedAnalytics.jsx # Learning time saved estimate
            │
            ├── ── Roadmap ──
            ├── NeuralRoadmap.jsx      # Interactive SVG skill DAG
            │
            ├── ── Practice ──
            ├── CodingSandbox.jsx      # Code editor + pair programmer
            ├── FlashcardDeck.jsx      # Flip-card active recall
            ├── FlowTimer.jsx          # Pomodoro focus timer
            │
            ├── ── Portfolio ──
            ├── TechnicalPortfolio.jsx # Auto-generated skill portfolio
            ├── AchievementSystem.jsx  # XP, badges, milestones
            │
            ├── ── Insights ──
            ├── DailyStreak.jsx        # Learning momentum + heatmap
            ├── ResumeScoreRadar.jsx   # 6-axis spider chart
            ├── SalaryPredictor.jsx    # 3-tier salary prediction
            ├── JobMatcher.jsx         # AI job role matching
            │
            ├── ── Future ──
            ├── FutureMap.jsx          # 2030 skill trajectory map
            ├── CareerPredictor.jsx    # Career path prediction
            │
            ├── ── Alpha (Experimental) ──
            ├── UIVision.jsx           # AI UI concept generator
            ├── PitchGenerator.jsx     # Elevator pitch generator
            ├── SkillGalaxy.jsx        # 3D skill ecosystem map
            ├── CodeRadar.jsx          # Code quality radar
            ├── SkillHeatmap.jsx       # Skill intensity heatmap
            │
            ├── ── Elite ──
            ├── SquadHub.jsx           # Team composition simulator
            ├── ExecutivePacket.jsx    # Executive resume summary
            ├── SystemGuardian.jsx     # Service health monitor
            ├── EliteAnalytics.jsx     # Elite-tier analytics
            │
            ├── ── Ecosystem ──
            ├── GlobalTrendMap.jsx     # Global skill trend heatmap
            ├── MarketInsights.jsx     # Market intelligence panel
            │
            ├── ── Recruiter View ──
            ├── RecruiterDashboard.jsx # Simplified recruiter view
            ├── HRDashboard.jsx        # HR analytics dashboard
            ├── CandidateBenchmark.jsx # Candidate benchmarking
            ├── UserDashboard.jsx      # User profile dashboard
            │
            ├── ── AI Interactions ──
            ├── InterviewModal.jsx     # AI mock interview modal
            ├── VoiceExplain.jsx       # AI voice skill explanations
            ├── CollaborativeCanvas.jsx # Collaborative whiteboard
            ├── DoubtModal.jsx         # AI Q&A doubt resolver
            │
            ├── ── System ──
            ├── SystemStatus.jsx       # System health panel
            ├── ActivityFeed.jsx       # Real-time activity feed
            ├── AnalyticsPanel.jsx     # Analytics overview
            │
            └── ── UI / Modals ──
                ├── HelpCenter.jsx     # In-app help documentation
                ├── SettingsModal.jsx  # Theme + settings panel
                ├── ErrorAlert.jsx     # Error boundary alert
                └── LoadingSpinner.jsx # Loading state component
```

---

## ✨ All Features in Detail

<details>
<summary><b>🔍 01 · Deep Resume × JD Analysis</b></summary>
<br/>

**What it does:**
Paste your raw resume and a job description. Gemini 2.0 Flash extracts all skills from both, categorises them (Frontend / Backend / ML-AI / DevOps / Cloud / Data), and assigns a proficiency level (beginner → expert).

**How to use:**
1. Go to `http://localhost:3000`
2. Paste resume in the left text area
3. Paste the job description in the right text area
4. Set **Target Role** (e.g., `Machine Learning Engineer`)
5. Optionally set **Timeline** (days to prepare)
6. Click **Initiate Deep Analysis**

**Why it matters:**
Eliminates hours of manual gap-finding. AI cross-references 150+ skill nodes against both documents in under 3 seconds.

**Backend Endpoint:** `POST /analyze`

</details>

---

<details>
<summary><b>📊 02 · Results Dashboard</b></summary>
<br/>

**What it does:**
Shows a full breakdown:
- ✅ **Known Skills** — skills you have at required level
- ⚠️ **Partial Skills** — skills you have but need to deepen
- ❌ **Missing Skills** — skills required by the role that you lack completly

Also shows: coverage %, readiness score, total gap count, time required.

**How to use:**
After analysis → click **Results** in the left sidebar.

**Backend Endpoint:** Part of `POST /analyze` response

</details>

---

<details>
<summary><b>🗺️ 03 · Neural Roadmap (Adaptive DAG)</b></summary>
<br/>

**What it does:**
Generates a dependency-ordered learning path as an interactive **SVG neural graph**. Missing prerequisite skills are automatically injected. Topological sort ensures you learn A before B.

**Algorithm:**
```
resolve(target_skills, known_skills):
  1. For each target skill → look up prerequisites in skill_graph.json
  2. Recursively inject missing prerequisites
  3. Topological sort (Kahn's algorithm)
  4. Filter out known_skills
  5. Wrap in modules with time estimates
```

**How to use:**
1. Click **Roadmap** in sidebar
2. Toggle **Neural View / List View** with top buttons
3. Click a skill node to mark complete — path recalculates
4. Watch completed nodes turn green with a glow effect

**Backend Endpoint:** `POST /roadmap/generate`

</details>

---

<details>
<summary><b>💻 04 · Coding Sandbox + AI Pair Programmer</b></summary>
<br/>

**What it does:**
An embedded code editor with an AI pair programmer that surfaces context-aware hints for the skill you're currently practising. Includes a **Flow Timer** (Pomodoro) to track focused sessions.

**How to use:**
1. Click **Sandbox** in sidebar
2. Select a skill from your roadmap to practice
3. Write code in the editor
4. Click 🤖 **Hint** for AI-powered coding nudges
5. Start the **Flow Timer** for focused work sessions

**Backend Endpoint:** `GET /sandbox/hint?skill={skill_name}`

</details>

---

<details>
<summary><b>🃏 05 · Active Recall Flashcards</b></summary>
<br/>

**What it does:**
Generates AI-powered Q&A flashcard pairs for each of your skills. Cards animate with a 3D flip on click to reveal the answer.

**How to use:**
1. Click **Recall** in sidebar
2. Click a card to flip and see the answer
3. Navigate with ← → arrows
4. Cards auto-populate from your resume skills — no setup needed

**Backend Endpoint:** `POST /learning/flashcards`

</details>

---

<details>
<summary><b>🏆 06 · Technical Portfolio Generator</b></summary>
<br/>

**What it does:**
Auto-generates a complete technical portfolio with:
- Mastery badge tier: Neural Explorer → Code Forger → Elite Architect
- AI-written project case studies matching your skills
- Performance metrics, contribution stats, and global percentile rank

**How to use:**
1. Click **Portfolio** in sidebar
2. Portfolio is generated instantly from your resume skills
3. Completing roadmap nodes upgrades badge tier automatically

**Backend Endpoint:** `POST /portfolio/generate`

</details>

---

<details>
<summary><b>🔮 07 · 2030 Future Skill Map</b></summary>
<br/>

**What it does:**
Projects which of your skills will be **high-demand**, **stable**, or **deprecated** by 2030 based on industry trajectory.

**How to use:**
1. Click **2030** in sidebar
2. Review skills sorted into: Invest / Hold / Watch / Deprecate quadrants
3. Use this to prioritise gap-closing order

</details>

---

<details>
<summary><b>📈 08 · Insights Dashboard (4 Live Panels)</b></summary>
<br/>

**What it does:**

| Panel | Powers |
|---|---|
| 🔥 **Learning Momentum** | 28-day activity heatmap, XP bar, streak counter, badge count |
| 🎯 **6-Axis Readiness Radar** | Spider chart (Coverage / Depth / Breadth / Relevance / Velocity / Confidence) |
| 💰 **Salary Predictor** | Entry / Optimised / Expert salary range, market percentile bar, premium skill bonuses |
| 💼 **AI Job Matcher** | 5 curated matched roles with match%, per-skill badge (matched ✅ / missing ❌), animated match bars |

**How to use:**
Click **Insights** in sidebar. All 4 panels auto-load from resume skills after analysis.

**Backend Endpoints:**
- `GET /streak/data?completed_count={n}`
- `POST /resume/score`
- `POST /salary/predict`
- `POST /jobs/match`

</details>

---

<details>
<summary><b>⚡ 09 · Alpha Lab (Experimental Features)</b></summary>
<br/>

| Feature | What It Does |
|---|---|
| **UI Vision** | Generates AI concept mockups for your personal portfolio site |
| **Pitch Generator** | Creates a 60-second technical elevator pitch for interviews |
| **Skill Galaxy** | 3D orbital visualisation of your entire skill ecosystem |
| **Code Radar** | Code quality pattern radar chart |
| **Skill Heatmap** | Intensity heatmap of your skill distribution |

**How to use:** Click **Alpha** in sidebar.

</details>

---

<details>
<summary><b>🛡️ 10 · Elite Tier Features</b></summary>
<br/>

| Feature | What It Does |
|---|---|
| **Squad Hub** | Simulates team composition scenarios for technical leadership roles |
| **Executive Packet** | Generates an executive-formatted 1-page resume summary instantly |
| **System Guardian** | Real-time health monitoring of all backend microservices |
| **Elite Analytics** | Deep-dive analytics on career trajectory and skill ROI |

**How to use:** Click **Elite** in sidebar.

</details>

---

<details>
<summary><b>🌐 11 · Global Ecosystem Map</b></summary>
<br/>

**What it does:**
Live skill trend heatmap showing demand across global tech hubs — San Francisco, Bengaluru, London, Tokyo — with global readiness average.

**Backend Endpoint:** `POST /ecosystem/trends`

**How to use:** Click **Ecosystem** in sidebar.

</details>

---

<details>
<summary><b>💚 12 · System Health Monitor</b></summary>
<br/>

**What it does:**
Runs a real-time diagnostic on all backend services with latency, uptime %, memory usage, and overall health scores.

**How to use:** Click **Health** in the sidebar.

**Backend Endpoint:** `GET /system/status`

</details>

---

<details>
<summary><b>👤 13 · Recruiter View</b></summary>
<br/>

**What it does:**
Toggles the entire interface to a simplified high-signal recruiter dashboard showing: match score, top 5 skills, readiness %, and key gap summary.

**How to use:**
Click the **Recruiter View** button at the bottom of the left sidebar after completing an analysis. Click **Candidate View** to return.

</details>

---

<details>
<summary><b>🎭 14 · AI Mock Interview</b></summary>
<br/>

**What it does:**
Simulates a technical interview session based on your target role and skill set. The AI asks role-relevant questions and evaluates your responses.

**How to use:**
Accessible via the Interview button in the Results tab.

</details>

---

<details>
<summary><b>🔊 15 · Voice Skill Explainer</b></summary>
<br/>

**What it does:**
AI generates an audio briefing explaining any skill in your roadmap — what it is, why it matters, and how to approach learning it.

**Backend Endpoint:** `POST /voice/explain`

</details>

---

## 🚀 Getting Started

### Prerequisites

```
Python 3.11+   Node.js 18+   npm 9+   Git
A Google Gemini API Key (free at https://aistudio.google.com/)
```

### 1 · Clone

```bash
git clone https://github.com/priyabratasahoo780/Resume-generater.git
cd ArtPark_CodeForge_Hackathon
```

### 2 · Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo GEMINI_API_KEY=your_key_here > .env
echo SECRET_KEY=your_jwt_secret >> .env

# Start server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3 · Frontend

```bash
cd frontend
npm install
npm run dev
# Runs at http://localhost:3000
```

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React 18)                    │
│                      localhost:3000                         │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│   │ Upload   │  │ Roadmap  │  │Insights  │  │Portfolio │  │
│   │ Section  │  │ Neural   │  │Dashboard │  │Generator │  │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────┬───────────────────────────────────┘
                          │ Axios HTTP + WebSockets
┌─────────────────────────▼───────────────────────────────────┐
│                     BACKEND (FastAPI)                       │
│                      localhost:8000                         │
│                                                             │
│  POST /analyze          →  SkillExtractor + GapAnalyzer    │
│  POST /roadmap/generate →  DependencyResolver + TopoSort   │
│  POST /portfolio/gen    →  PortfolioService                 │
│  GET  /streak/data      →  Streak + XP Engine              │
│  POST /resume/score     →  6-Axis Radar Calculator         │
│  POST /salary/predict   →  Salary Prediction Engine        │
│  POST /jobs/match       →  Job Matching Service             │
│  POST /learning/flash   →  FlashcardGenerator              │
│  GET  /sandbox/hint     →  PairProgrammerService           │
└─────────────────────────┬───────────────────────────────────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
       Gemini 2.0    skill_graph   course_
         Flash        .json (DAG)  dataset
       (Google AI)                 .json
```

---

## 📡 Full API Reference

| Method | Endpoint | Request Body | Description |
|---|---|---|---|
| `POST` | `/analyze` | `{resume, job_description, target_role, timeline_days}` | Full AI analysis |
| `POST` | `/roadmap/generate` | `{skills, target_role, timeline_days}` | Generate learning roadmap |
| `POST` | `/portfolio/generate` | `{user_name, mastered_skills, target_role}` | Generate portfolio |
| `POST` | `/resume/score` | `{skills, gap_stats}` | 6-axis radar score |
| `POST` | `/salary/predict` | `{role, skills, experience_years}` | Salary prediction |
| `GET` | `/streak/data` | `?completed_count=n` | Learning streak data |
| `POST` | `/jobs/match` | `{skills}` | Match to job roles |
| `POST` | `/learning/flashcards` | `{skills}` | Generate flashcards |
| `GET` | `/sandbox/hint` | `?skill=Python` | AI pair programmer hint |
| `POST` | `/ecosystem/trends` | `{}` | Global skill trends |
| `GET` | `/system/status` | — | Health diagnostics |
| `POST` | `/voice/explain` | `{skill, context}` | Voice skill explanation |
| `POST` | `/auth/register` | `{username, password, email}` | User registration |
| `POST` | `/auth/login` | `{username, password}` | JWT login |
| `GET` | `/docs` | — | Swagger interactive docs |

---

## 📊 Internal Validation Metrics

| Metric | Formula |
|---|---|
| **Readiness Score** | `(known + 0.5×partial) / total_required × 100` |
| **Coverage %** | `known_count / total_required_skills × 100` |
| **Gap Score** | `required_level - resume_level` (scale 1–3) |
| **Market Percentile** | `40 + skill_count×2 + premium_skill_bonus×3` |
| **Salary Estimate** | `base_salary × experience_multiplier + premium_bonus` |
| **XP Points** | `completed_skills × 120` |

---

## 🤝 Contributing

```bash
git checkout -b feat/your-feature
git commit -m "feat: describe your change"
git push origin feat/your-feature
# Open a Pull Request
```

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer" />

**Built with ⚡ by Team Invisible.Coding × IISc Hackathon 2026**

[![GitHub](https://img.shields.io/badge/GitHub-priyabratasahoo780-181717?style=for-the-badge&logo=github)](https://github.com/priyabratasahoo780/Resume-generater)

</div>
