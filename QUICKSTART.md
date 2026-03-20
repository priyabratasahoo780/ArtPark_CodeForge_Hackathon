# Quick Start Guide - Copy & Paste Commands

## 🚀 Fastest Way to Get Running (Windows)

### Terminal 1: Backend
```powershell
cd ArtPark_CodeForge_Hackathon\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

### Terminal 2: Frontend
```powershell
cd ArtPark_CodeForge_Hackathon\frontend
npm install
npm run dev
```

### Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## 🐳 Docker Quick Start

```powershell
cd ArtPark_CodeForge_Hackathon
docker-compose up -d
```

Access at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

---

## 📝 Project Structure

```
ArtPark_CodeForge_Hackathon/
├── backend/                          # Python FastAPI backend
│   ├── app/
│   │   ├── main.py                  # FastAPI main app
│   │   ├── services/                # Core services
│   │   │   ├── skill_extractor.py  # NLP skill extraction
│   │   │   ├── gap_analyzer.py     # Skill gap analysis
│   │   │   └── learning_path_generator.py  # Learning path
│   │   ├── datasets/
│   │   │   ├── skills_taxonomy.json # Skill database
│   │   │   └── sample_data.json
│   │   └── models/, utils/, routes/
│   └── requirements.txt
│
├── frontend/                         # React frontend
│   ├── src/
│   │   ├── App.jsx                 # Main app component
│   │   ├── components/             # React components
│   │   │   ├── UploadSection.jsx
│   │   │   ├── SkillsAnalysis.jsx
│   │   │   ├── GapAnalysis.jsx
│   │   │   └── LearningPath.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── README.md                         # Main documentation
├── SETUP.md                          # Detailed setup
├── API.md                            # API documentation
├── docker-compose.yml
└── .gitignore
```

---

## 🎯 How to Use

1. **Upload Resume**: Paste or upload your resume
2. **Upload Job Description**: Paste or upload job posting
3. **Click "Analyze"**: AI analyzes and generates learning path
4. **Review Results**: See skills, gaps, and personalized learning modules
5. **Download**: Save results as JSON

---

## 📚 Key Files

### Backend Services
- `backend/app/services/skill_extractor.py` - Extracts skills from text
- `backend/app/services/gap_analyzer.py` - Analyzes skill gaps
- `backend/app/services/learning_path_generator.py` - Generates learning paths

### Skill Database
- `backend/app/datasets/skills_taxonomy.json` - 500+ skills with prerequisites

### React Components
- `frontend/src/App.jsx` - Main application logic
- `frontend/src/components/*.jsx` - UI components

---

## 🔧 Configuration

### Change Backend Port
Edit `backend/app/main.py`:
```python
uvicorn.run(app, host="0.0.0.0", port=8001)
```

### Change Frontend Port
Edit `frontend/vite.config.js`:
```js
export default defineConfig({
  server: {
    port: 3000
  }
})
```

### Add Proxy
Frontend `vite.config.js` already configured to proxy `/api` to backend.

---

## ✅ Customization

### Add New Skills
Edit `backend/app/datasets/skills_taxonomy.json`:
- Add to appropriate category
- Define prerequisites
- Set difficulty level

### Modify Learning Resources
Edit `backend/app/services/learning_path_generator.py`:
- Update `_suggest_resources()` method
- Add course links and duration

### Change UI Theme
Edit `frontend/tailwind.config.js`:
- Modify color palette
- Adjust spacing and fonts

---

## 🧪 Test the API

### Using cURL
```bash
# Health check
curl http://localhost:8000/health

# Get API docs
curl http://localhost:8000/docs
```

### Using Postman
1. Import endpoints from http://localhost:8000/openapi.json
2. Create request to `/onboarding/complete`
3. Add JSON body with resume_text and job_description_text
4. Send and review results

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 8000 in use | `netstat -ano \| findstr :8000` then `taskkill /PID <PID>` |
| Module not found | Activate virtual environment, reinstall deps |
| Frontend won't load | Clear node_modules: `rm -r node_modules && npm install` |
| API connection error | Verify backend running: `curl http://localhost:8000/health` |

---

## 🎉 What's Included

✅ **Backend**
- FastAPI with CORS enabled
- NLP-based skill extraction
- Intelligent gap analysis
- Adaptive learning path generation
- Comprehensive API documentation

✅ **Frontend**
- React 19.2 with Vite
- Tailwind CSS styling
- Real-time analysis
- Interactive visualizations
- Responsive design

✅ **Documentation**
- README with full overview
- SETUP.md with detailed instructions
- API.md with endpoint documentation
- Sample data for testing

✅ **Deployment**
- Docker containerization
- docker-compose orchestration
- Production-ready configuration

---

## 📞 Quick Links

- 📖 Full Documentation: `README.md`
- 🛠️ Setup Guide: `SETUP.md`
- 🔌 API Docs: `API.md`
- 📡 Swagger UI: http://localhost:8000/docs
- 🎨 Frontend: http://localhost:5173
- ⚡ Backend: http://localhost:8000

---

## 🚀 Next Steps

1. ✅ Start backend server
2. ✅ Start frontend server
3. ✅ Open http://localhost:5173
4. ✅ Upload resume and job description
5. ✅ Review analysis
6. ✅ Download results

<br>

**Let's build amazing career pathways! 🎯**
