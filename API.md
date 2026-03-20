# API Documentation

## 🔌 Endpoints Overview

### Base URL
```
http://localhost:8000
```

### Authentication
No authentication required for demo version.

---

## Endpoints

### 1. Health Check

**Endpoint:** `GET /health`

**Description:** Check if the API is running

**Response:**
```json
{
  "status": "healthy",
  "service": "AI-Adaptive Onboarding Engine",
  "version": "1.0.0"
}
```

---

### 2. Extract Resume Skills

**Endpoint:** `POST /extract/resume`

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "text": "Your resume text here..."
}
```

**Response:**
```json
{
  "skills": [
    {
      "name": "Python",
      "category": "Programming Language",
      "level": "Advanced",
      "confidence": 0.95,
      "prerequisites": []
    },
    {
      "name": "React",
      "category": "Frontend Framework",
      "level": "Intermediate",
      "confidence": 0.92,
      "prerequisites": ["JavaScript", "HTML", "CSS"]
    }
  ],
  "total_skills_count": 12,
  "skill_categories": {
    "Programming Language": ["Python", "JavaScript"],
    "Frontend Framework": ["React", "Vue.js"],
    "Database": ["PostgreSQL", "MongoDB"]
  }
}
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Text too short
- `500 Internal Server Error` - Processing error

---

### 3. Extract Job Description

**Endpoint:** `POST /extract/job-description`

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "text": "Job description text here..."
}
```

**Response:**
```json
{
  "required_skills": [
    {
      "name": "React",
      "category": "Frontend Framework",
      "confidence": 0.98,
      "prerequisites": ["JavaScript", "HTML", "CSS"]
    }
  ],
  "nice_to_have_skills": [
    {
      "name": "TypeScript",
      "category": "Programming Language",
      "confidence": 0.85,
      "prerequisites": ["JavaScript"]
    }
  ],
  "total_required": 8,
  "total_nice_to_have": 5,
  "skill_categories": {
    "Frontend Framework": ["React"],
    "Programming Language": ["JavaScript", "TypeScript"],
    "Backend Framework": ["Node.js"]
  }
}
```

---

### 4. Analyze Skill Gaps

**Endpoint:** `POST /analyze/gaps`

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "resume_text": "Your resume...",
  "job_description_text": "Job description..."
}
```

**Response:**
```json
{
  "known_skills": [
    {
      "name": "JavaScript",
      "category": "Programming Language",
      "resume_level": "Intermediate",
      "required_level": "Intermediate",
      "gap_score": 0,
      "reason": "You have 'Intermediate' level, job requires 'Intermediate'"
    }
  ],
  "partial_skills": [
    {
      "name": "React",
      "category": "Frontend Framework",
      "resume_level": "Beginner",
      "required_level": "Intermediate",
      "gap_score": 1,
      "reason": "Need to improve from 'Beginner' to 'Intermediate' level"
    }
  ],
  "missing_skills": [
    {
      "name": "Docker",
      "category": "Containerization",
      "required_level": "Intermediate",
      "prerequisites": [],
      "gap_score": 3,
      "reason": "Missing Docker skill - required by job"
    }
  ],
  "statistics": {
    "total_required_skills": 10,
    "known_count": 5,
    "partial_count": 3,
    "missing_count": 2,
    "coverage_percentage": 50.0,
    "readiness_score": 75.5
  }
}
```

---

### 5. Generate Learning Path

**Endpoint:** `POST /generate/learning-path`

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "resume_text": "Your resume...",
  "job_description_text": "Job description..."
}
```

**Response:**
```json
{
  "modules": [
    {
      "id": "module_1",
      "order": 1,
      "skill_name": "JavaScript",
      "category": "Programming Language",
      "level": "Intermediate",
      "difficulty": "Easy",
      "time_estimate_hours": 12,
      "prerequisites": [],
      "gap_score": 1,
      "reason": "Prerequisite for React",
      "resources": [
        {
          "type": "Course",
          "name": "Modern JavaScript Basics",
          "platform": "Udemy",
          "duration": "20 hours"
        }
      ],
      "learning_objectives": [
        "Master JavaScript ES6+ syntax",
        "Understand async operations and promises",
        "Debug JavaScript in browser"
      ],
      "assessment_criteria": [
        "Can write basic JavaScript code",
        "Can debug issues and troubleshoot",
        "Pass intermediate assessments"
      ],
      "status": "pending"
    }
  ],
  "timeline": {
    "total_hours": 120,
    "estimated_weeks": 6,
    "estimated_days": 60,
    "estimated_months": 1.5,
    "pace": "Self-paced",
    "recommendation": "Complete in approximately 6 weeks at ~5 hours/week"
  },
  "learning_sequence": [...],
  "strategies": [
    {
      "name": "Learn by Doing",
      "description": "Build projects while learning each skill",
      "implementation": "Complete hands-on projects for each module"
    }
  ],
  "milestones": [
    {
      "milestone_number": 1,
      "description": "Completed 3 modules - 35 hours of learning",
      "modules_completed": 3,
      "total_hours_invested": 35,
      "checkpoint": "Review and consolidate knowledge"
    }
  ],
  "reasoning": {
    "approach": "Dependency-based adaptive learning path",
    "optimization": "Prerequisites first, then critical gaps",
    "personalization": "Based on your current skill level"
  }
}
```

---

### 6. Complete Onboarding Analysis

**Endpoint:** `POST /onboarding/complete`

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "resume_text": "Your resume text...",
  "job_description_text": "Job description text..."
}
```

**Response:**
```json
{
  "skills_analysis": {
    "resume_skills": {...},
    "job_requirements": {...}
  },
  "gap_analysis": {...},
  "learning_path": {...},
  "reasoning_trace": {
    "approach": "AI-Adaptive Onboarding Engine",
    "methodology": "Skills extraction → Gap analysis → Path generation",
    "steps": [
      "1. Extracted skills from your resume",
      "2. Identified job requirements from description",
      "3. Calculated skill gaps with priority scoring",
      "4. Generated learning path with 8 modules",
      "5. Ordered modules by prerequisites and criticality"
    ],
    "key_insights": [
      "You currently have 5 of 10 required skills",
      "Skill coverage: 50.0%",
      "Readiness score: 75.5/100",
      "Estimated learning time: 6 weeks (~120 hours)"
    ],
    "recommendations": [
      "Follow the learning path in recommended order",
      "Each module includes suggested resources",
      "Plan for spaced repetition and projects",
      "Review prerequisites before starting"
    ]
  }
}
```

---

### 7. Get Skill Explanation

**Endpoint:** `POST /reasoning/trace/{skill_name}`

**URL Parameters:**
- `skill_name` - Name of the skill to explain (URL encoded)

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "resume_text": "Your resume...",
  "job_description_text": "Job description..."
}
```

**Response:**
```json
{
  "skill_name": "React",
  "status": "partial",
  "category": "Frontend Framework",
  "reason": "Need to improve from 'Beginner' to 'Intermediate' level",
  "gap_score": 1,
  "explanation_trace": [
    "Analyzing skill: React",
    "⚠️ Status: SKILL GAP EXISTS",
    "Your current level: Beginner",
    "Job requirement: Intermediate",
    "Gap score: 1/3",
    "→ Recommendation: Invest in improving this skill"
  ]
}
```

---

## Error Responses

### Bad Request (400)

```json
{
  "detail": "Resume text must be at least 10 characters"
}
```

### Internal Server Error (500)

```json
{
  "detail": "Error analyzing gaps: [error details]"
}
```

---

## Rate Limiting

Currently no rate limiting. For production:
- Implement rate limiting: 100 requests/hour per IP
- Use Redis for rate limit tracking
- Return `429 Too Many Requests` when exceeded

---

## Request/Response Examples

### Using cURL

```bash
# Health check
curl http://localhost:8000/health

# Extract resume skills
curl -X POST http://localhost:8000/extract/resume \
  -H "Content-Type: application/json" \
  -d '{"text":"5 years JavaScript experience"}'

# Complete analysis
curl -X POST http://localhost:8000/onboarding/complete \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "I have experience with Python and React",
    "job_description_text": "We need Python, React, and Docker experience"
  }'
```

### Using Python

```python
import requests
import json

BASE_URL = "http://localhost:8000"

# Complete analysis
response = requests.post(
    f"{BASE_URL}/onboarding/complete",
    json={
        "resume_text": "Your resume...",
        "job_description_text": "Job description..."
    }
)

results = response.json()
print(json.dumps(results, indent=2))
```

### Using JavaScript/Fetch

```js
const BASE_URL = "http://localhost:8000";

const analyzeOnboarding = async (resumeText, jobDescText) => {
  const response = await fetch(`${BASE_URL}/onboarding/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      resume_text: resumeText,
      job_description_text: jobDescText
    })
  });

  return await response.json();
};

analyzeOnboarding("Your resume...", "Job description...").then(results => {
  console.log(results);
});
```

---

## Interactive Documentation

**Swagger UI:** http://localhost:8000/docs

**ReDoc:** http://localhost:8000/redoc

---

## Performance Considerations

- Average response time: 2-5 seconds
- Maximum resume size: 100KB
- Maximum job description size: 100KB
- Concurrent requests: Limited by server resources

---

## Versioning

Current version: **1.0.0**

Future versions will maintain backward compatibility within major versions.

---

## Support

For API issues:
- Check Swagger documentation at /docs
- Review error messages for details
- Ensure backend is running: `curl http://localhost:8000/health`
- Check network connectivity
- Verify JSON format is correct

---

For more information, see [README.md](../README.md) and [SETUP.md](../SETUP.md)
