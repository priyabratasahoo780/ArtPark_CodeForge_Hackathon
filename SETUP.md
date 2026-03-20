# Setup and Installation Guide

## 🛠️ Manual Setup

### Prerequisites
- Windows 10+, macOS 10.15+, or Ubuntu 20.04+
- 4GB RAM minimum
- Node.js v18+
- Python 3.9+
- Git

### Backend Setup (Python + FastAPI)

#### 1. Install Python Dependencies

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

#### 2. Run Backend Server

```bash
# Ensure virtual environment is activated
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Expected output:
```
INFO:     Application startup complete
INFO:     Uvicorn running on http://0.0.0.0:8000
Press CTRL+C to terminate
```

#### 3. Test Backend

```bash
# In another terminal
curl http://localhost:8000/health
```

Expected response:
```json
{"status":"healthy","service":"AI-Adaptive Onboarding Engine","version":"1.0.0"}
```

---

### Frontend Setup (React + Tailwind CSS)

#### 1. Install Node Dependencies

```bash
cd frontend

npm install
```

#### 2. Run Development Server

```bash
npm run dev
```

Expected output:
```
  VITE v7.2.4  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

#### 3. Access Application

Open browser: **http://localhost:5173**

---

## 🐳 Docker Setup

### Prerequisites
- Docker Desktop installed and running

### Quick Start with Docker Compose

```bash
# From project root directory
docker-compose up -d

# Check services
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## 🧪 Verification Checklist

- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:5173
- [ ] Can access API documentation at http://localhost:8000/docs
- [ ] Can upload resume and job description
- [ ] Analysis completes without errors
- [ ] Results display correctly in UI

---

## ⚙️ Configuration

### Backend Configuration

Edit `backend/app/main.py`:

```python
# Change host/port
uvicorn.run(app, host="0.0.0.0", port=8000)

# Enable/disable CORS
allow_origins=["*"]  # Specify origins in production
```

### Frontend Configuration

Edit `frontend/vite.config.js`:

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',  // Backend URL
      changeOrigin: true,
    }
  }
}
```

---

## 🔧 Troubleshooting

### Backend Issues

#### Port 8000 Already in Use
```bash
# Find process using port
lsof -i :8000

# Kill process
kill -9 <PID>

# Or use different port
uvicorn app.main:app --port 8001
```

#### Import Errors
```bash
# Reinstall dependencies
pip install --force-reinstall -r requirements.txt

# Check Python version
python --version  # Should be 3.9+
```

#### Module Not Found
```bash
# Ensure you're in venv
which python  # Should show venv path

# Verify app directory structure
ls -la app/
```

---

### Frontend Issues

#### Dependencies Not Installing
```bash
# Clear cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Hot Reload Not Working
```bash
# Restart vite
npm run dev

# Check file permissions
chmod 644 src/**/*.jsx
```

#### API Connection Error
```bash
# Check backend health
curl http://localhost:8000/health

# Verify CORS settings
# In backend/app/main.py, ensure frontend URL is in allowed_origins
```

---

## 📦 Additional Setup Options

### Using Anaconda

```bash
# Create conda environment
conda create -n onboarding python=3.11

# Activate environment
conda activate onboarding

# Install dependencies
pip install -r requirements.txt

# Run backend
python -m uvicorn app.main:app --reload
```

### Using Poetry (Optional)

```bash
# Install poetry
pip install poetry

# Install dependencies
poetry install

# Run backend
poetry run uvicorn app.main:app --reload
```

---

## 🚀 Production Deployment

### AWS EC2 Deployment

1. **Launch EC2 instance** (Ubuntu 20.04)
2. **Install dependencies**:
```bash
sudo apt update
sudo apt install python3-pip nodejs npm git

git clone <repo-url>
cd onboarding-engine
```

3. **Setup backend**:
```bash
cd backend
pip install -r requirements.txt
gunicorn app.main:app -w 4 -b 0.0.0.0:8000
```

4. **Setup frontend**:
```bash
cd frontend
npm install
npm run build
npm install -g serve
serve -s dist -l 3000
```

### Heroku Deployment

```bash
# Create Procfile
echo "web: gunicorn app.main:app" > Procfile

# Deploy
heroku create onboarding-engine
git push heroku main
```

---

## 🔍 Verification Tests

### API Endpoint Tests

```bash
# Extract resume skills
curl -X POST http://localhost:8000/extract/resume \
  -H "Content-Type: application/json" \
  -d '{"text": "5 years Python and JavaScript experience"}'

# Complete analysis
curl -X POST http://localhost:8000/onboarding/complete \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "...",
    "job_description_text": "..."
  }'
```

---

## 📚 Development Tips

### Hot Reload Setup

The projects are configured for live reload:
- Backend: `uvicorn --reload` watches file changes
- Frontend: Vite hot module replacement enabled

### Debugging

#### Backend Debug
```python
# Add logging
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
logger.debug("Message")
```

#### Frontend Debug
```js
// Browser DevTools
console.log('Variable:', variable)
debugger;  // Sets breakpoint
```

---

## ✅ Next Steps

1. Access frontend at http://localhost:5173
2. Load sample data or upload your own resume/job description
3. Review the analysis and learning path
4. Download results as JSON
5. Customize the system as needed

---

For additional help, see:
- README.md - Project overview
- API.md - API documentation
- GitHub Issues - Community support
