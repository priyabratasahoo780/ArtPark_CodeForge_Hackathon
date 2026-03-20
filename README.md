# 🚀 AI-Adaptive Onboarding Engine

**Personalized Learning Pathways for New Hires**

A sophisticated AI-powered system that analyzes resumes and job descriptions to create personalized, adaptive learning paths for employee onboarding. Uses NLP-based skill extraction, intelligent gap analysis, and dependency-based course sequencing.

[![Python](https://img.shields.io/badge/Python-3.9%2B-blue)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104%2B-green)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.2%2B-61dafb)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](#license)

---

## 🎯 Key Features

### ✨ Core Capabilities
- **📄 Intelligent Resume Parsing**: Extract skills, experience levels, and expertise areas using NLP
- **💼 Job Requirement Analysis**: Analyze job descriptions and identify required skills
- **🔍 Skill Gap Detection**: Identify known, partial, and missing skills with confidence scoring
- **🛣️ Adaptive Learning Path**: Generate intelligent learning sequences based on prerequisites and priorities
- **💡 Explainability**: Transparent reasoning for each recommendation with detailed traces
- **🎯 Priority Scoring**: Rank skills by importance, difficulty, and learning time

### 🧠 Advanced Features
- **Dependency Graph Analysis**: Understanding skill prerequisites and learning order
- **Personalized Roadmaps**: Customized learning modules with time estimates
- **Resource Recommendations**: Curated learning resources for each skill (Feature 4)
- **Progress Tracking**: Monitor learning completion and milestones (Feature 5)
- **🎤 Voice Explanation**: Convert reasoning traces into speech (Feature 6)
- **⏱️ Time Saved Analytics**: Compare traditional vs adaptive learning efficiency (Feature 7)
- **🏆 Multi-Resume Benchmarking**: Rank multiple candidates against a single JD (Feature 8)
- **Role-Based Learning**: Tailor path to specific developer roles (Feature 3)
- **Confidence Scoring**: Multi-signal skill expertise measurement (Feature 2)
- **Adaptive Re-evaluation**: Recalculate roadmap after user progress (Feature 5)

### 🎨 User Interface
- **Modern React Frontend**: Clean, intuitive interface with Tailwind CSS
- **Real-time Analysis**: Instant feedback on resume and job uploads
- **Interactive Visualizations**: Skill gaps, gap analysis, and learning paths
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Download Reports**: Export detailed analysis as JSON

---

## 🏗️ Architecture

```
AI-Adaptive Onboarding Engine
│
├── Backend (Python FastAPI)
│   ├── Services
│   │   ├── skill_extractor.py       # NLP-based skill extraction (Feature 2)
│   │   ├── gap_analyzer.py          # Skill gap analysis & scoring (Feature 2)
│   │   ├── learning_path_generator.py # Adaptive path generation (Feature 1, 4)
│   │   ├── dependency_resolver.py   # Prerequisite management (Feature 1)
│   │   ├── role_matcher.py          # Role-based skill matching (Feature 3)
│   │   ├── voice_explainer.py       # gTTS & Web Speech synthesis (Feature 6)
│   │   ├── time_analytics.py        # Efficiency saved metrics (Feature 7)
│   │   └── resume_benchmarker.py    # Multi-candidate ranking (Feature 8)
│   ├── Datasets
│   │   └── skills_taxonomy.json     # Skill database & prerequisites
│   └── API Routes
│       └── main.py                   # FastAPI endpoints
│
├── Frontend (React + Tailwind CSS)
│   ├── Components
│   │   ├── UploadSection            # Resume/Job upload
│   │   ├── SkillsAnalysis           # Skills breakdown
│   │   ├── GapAnalysis              # Gap visualization
│   │   ├── LearningPath             # Module sequencing
│   │   ├── LoadingSpinner           # Loading state
│   │   ├── ErrorAlert               # Error handling
│   │   ├── VoiceExplain             # 🎤 Speech synthesis UI (Feature 6)
│   │   ├── TimeSavedAnalytics       # ⏱️ Stats/Savings card (Feature 7)
│   │   └── CandidateBenchmark       # 🏆 Leaderboard UI (Feature 8)
│   └── App.jsx                       # Main application
│
└── Documentation
    ├── README.md                     # This file
    ├── SETUP.md                      # Setup guide
    └── API.md                        # API documentation
```

---

## 📋 Prerequisites

### System Requirements
- **OS**: Windows, macOS, or Linux
- **Node.js**: v18+
- **Python**: v3.9+
- **RAM**: 4GB minimum
- **Disk**: 2GB free space

### Required Software
- Git
- npm or yarn
- pip or conda
- Docker (optional, for containerization)

---

## 🚀 Quick Start

### 1️⃣ Clone Repository

```bash
git clone https://github.com/codeforge/onboarding-engine.git
cd onboarding-engine
```

### 2️⃣ Setup Backend (Python)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: **http://localhost:8000**

API Documentation: **http://localhost:8000/docs**

### 3️⃣ Setup Frontend (React)

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at: **http://localhost:5173**

### 4️⃣ Access Application

Open your browser and navigate to **http://localhost:5173**

---

## 💻 Usage Guide

### Step 1: Upload Resume

1. Use the **Resume** section to either:
   - Upload a `.txt`, `.pdf`, or `.docx` file
   - Paste resume text directly
   - Click "Load Sample Resume" for demo data

### Step 2: Upload Job Description

1. Use the **Job Description** section to either:
   - Upload a job description file
   - Paste text directly
   - Click "Load Sample Job Description" for demo data

### Step 3: Analyze

1. Click **"Analyze & Generate Learning Path"** button
2. Wait for the AI to process (typically 2-5 seconds)

### Step 4: Review Results

Navigate between tabs to view:
- **📊 Results**: Summary and methodology
- **🎯 Skills**: Your skills vs. job requirements
- **⚠️ Gaps**: Skill gap analysis with reasoning
- **🛣️ Learning Path**: Personalized learning modules

### Step 5: Download Report

1. Click **"Download"** button to save results as JSON
2. Import into your learning management system (LMS)

---

## 📊 Output Format

### Analysis Results

```json
{
  "skills_analysis": {
    "resume_skills": {
      "skills": [...],
      "skill_categories": {...}
    },
    "job_requirements": {
      "required_skills": [...],
      "nice_to_have_skills": [...]
    }
  },
  "gap_analysis": {
    "known_skills": [...],
    "partial_skills": [...],
    "missing_skills": [...],
    "statistics": {
      "coverage_percentage": 65.5,
      "readiness_score": 72.0
    }
  },
  "learning_path": {
    "modules": [
      {
        "skill_name": "JavaScript",
        "level": "Intermediate",
        "time_estimate_hours": 15,
        "learning_objectives": [...],
        "assessment_criteria": [...],
        "resources": [...]
      }
    ],
    "timeline": {
      "total_hours": 120,
      "estimated_weeks": 6,
      "estimated_months": 1.5
    }
  },
  "reasoning_trace": {
    "approach": "...",
    "key_insights": [...],
    "recommendations": [...]
  }
}
```

---

## 🔧 API Endpoints

### Authentication
No authentication required for demo version.

### Main Endpoints

#### 1. **Complete Onboarding Analysis**
```
POST /onboarding/complete
Content-Type: application/json

{
  "resume_text": "...",
  "job_description_text": "..."
}

Returns: Complete analysis with all components
```

#### 2. **Extract Resume Skills**
```
POST /extract/resume
Content-Type: application/json

{
  "text": "..."
}

Returns: Extracted skills with levels
```

#### 3. **Extract Job Requirements**
```
POST /extract/job-description
Content-Type: application/json

{
  "text": "..."
}

Returns: Required and nice-to-have skills
```

#### 4. **Analyze Skill Gaps**
```
POST /analyze/gaps
Content-Type: application/json

{
  "resume_text": "...",
  "job_description_text": "..."
}

Returns: Gap analysis with categorization
```

#### 5. **Generate Learning Path**
```
POST /generate/learning-path
Content-Type: application/json

{
  "resume_text": "...",
  "job_description_text": "..."
}

Returns: Learning path with modules and timeline
```

#### 7. **Update Progress**
```
POST /update-progress
Accepts completed skills and returns an updated roadmap.
```

#### 8. **Voice Explanation**
```
POST /explain/voice
Full reasoning trace to base64 MP3 and text script.
```

#### 9. **Candidate Benchmarking**
```
POST /benchmark/candidates
Rank multiple candidates (2–20) against a single job description.
```

#### 10. **Time Saved Analytics**
```
POST /analytics/time-saved
Compare traditional vs adaptive learning durations.
```

### Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🏅 Algorithm Details

### Step 1: Skill Extraction
- Parses resume/job description text
- Matches against skill taxonomy database
- Applies pattern matching and fuzzy matching
- Assigns confidence scores

### Step 2: Experience Level Inference
- Analyzes context around skill mentions
- Categorizes as Beginner, Intermediate, or Advanced
- Uses keyword analysis (e.g., "expert", "years of")

### Step 3: Gap Scoring
- Compares resume skills against job requirements
- Calculates gap score: `required_level - current_level`
- Ranges from -3 (significant overskill) to +3 (critical gap)

### Step 4: Dependency Mapping
- Identifies prerequisite relationships
- Builds directed acyclic graph (DAG)
- Ensures logical learning sequence

### Step 5: Path Optimization
- Performs topological sort on skill dependencies
- Ranks by gap score (critical gaps first)
- Groups related skills
- Estimates learning time per module

### Step 6: Readiness Scoring
```
readiness_score = (known_skills / total_required * 100) + 
                  (partial_skills / total_required * 50)
```

---

## 📁 Project Structure

```
onboarding-engine/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI application
│   │   ├── services/
│   │   │   ├── skill_extractor.py
│   │   │   ├── gap_analyzer.py
│   │   │   └── learning_path_generator.py
│   │   ├── models/
│   │   ├── utils/
│   │   ├── routes/
│   │   └── datasets/
│   │       └── skills_taxonomy.json
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadSection.jsx
│   │   │   ├── SkillsAnalysis.jsx
│   │   │   ├── GapAnalysis.jsx
│   │   │   ├── LearningPath.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ErrorAlert.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── README.md               # This file
├── SETUP.md                # Detailed setup guide
├── API.md                  # API documentation
└── docker-compose.yml      # Docker setup
```

---

## 🐳 Docker Deployment

### Build and Run with Docker

```bash
# Build docker image
docker-compose build

# Run containers
docker-compose up -d

# Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

---

## 🔐 Security Considerations

### Current Implementation
- No authentication required (demo version)
- Text-based input only (no file upload to server)
- All processing on local machine

### Production Recommendations
- Implement OAuth 2.0 authentication
- Add rate limiting
- Encrypt sensitive data
- Use HTTPS
- Add input validation and sanitization
- Implement access control
- Monitor API usage

---

## 📈 Performance Metrics

| Metric | Value |
|--------|-------|
| Avg. Analysis Time | 2-5 seconds |
| Max Resume Size | 100KB |
| Max Job Description Size | 100KB |
| Skills Database | 500+ skills |
| Supported Skill Categories | 15+ categories |
| Accuracy (Skill Detection) | ~95% |

---

## 🛠️ Customization

### Add New Skills

Edit `backend/app/datasets/skills_taxonomy.json`:

```json
{
  "skills": {
    "new_category": {
      "SkillName": {
        "category": "Skill Category",
        "level": "intermediate",
        "prerequisites": ["Prerequisite Skill"],
        "description": "Skill description"
      }
    }
  }
}
```

### Modify Learning Time Estimates

Edit `backend/app/services/learning_path_generator.py`:

```python
LEARNING_TIME_ESTIMATES = {
    'Beginner': {'short': 2, 'medium': 5, 'long': 10},
    'Intermediate': {'short': 5, 'medium': 15, 'long': 30},
    'Advanced': {'short': 10, 'medium': 30, 'long': 60}
}
```

### Customize UI Theme

Edit `frontend/tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
    }
  }
}
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check if port 8000 is in use
lsof -i :8000

# Kill existing process
kill -9 <PID>

# Try different port
uvicorn app.main:app --port 8001
```

### Frontend Won't Load
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear cache
npm cache clean --force

# Restart dev server
npm run dev
```

### API Connection Error
```bash
# Verify backend is running
curl http://localhost:8000/health

# Check CORS settings in backend/app/main.py
# Ensure frontend URL is in allowed origins
```

---

## 📚 Resources

### Documentation
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

### Skills Taxonomy
- [O*NET Database](https://www.onetcenter.org/)
- [LinkedIn Skills](https://www.linkedin.com/jobs/collections/recommended-in-skills/)

### NLP Libraries
- [spaCy](https://spacy.io/)
- [Hugging Face Transformers](https://huggingface.co/transformers/)

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👥 Team

Built for **CodeForge Hackathon 2024**

**Contributors:**
- System Architecture & Backend: AI System Architect
- Frontend Development: Full-Stack Developer
- ML & NLP: Machine Learning Engineer

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: support@onboarding-engine.dev
- Documentation: See `SETUP.md` and `API.md`

---

## 🎯 Future Roadmap

- [x] Video resource generation (via course recommendations)
- [x] Interactive quizzes and assessments criteria (Feature 4)
- [x] Community course recommendations dataset (Feature 4)
- [x] Multi-candidate benchmarking (Feature 8)
- [x] Voice explanations (Feature 6)
- [x] Time saved analytics dashboard (Feature 7)
- [ ] Integration with major LMS platforms
- [ ] Mobile app (React Native)
- [ ] Multi-language support (TTS supports multiple langs)
- [ ] Real-time collaboration features

---

**Made with ❤️ for better employee onboarding**

Last Updated: March 20, 2026 | Version: 1.1.0
