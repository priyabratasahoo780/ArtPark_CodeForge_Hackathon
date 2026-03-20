from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import logging
from pathlib import Path

from app.services.skill_extractor import SkillExtractor
from app.services.gap_analyzer import SkillGapAnalyzer
from app.services.learning_path_generator import LearningPathGenerator

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AI-Adaptive Onboarding Engine",
    description="Personalized learning pathways based on resume and job requirements",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
skill_extractor = SkillExtractor()
gap_analyzer = SkillGapAnalyzer()
learning_path_generator = LearningPathGenerator()


# ==================== Pydantic Models ====================

class SkillInfo(BaseModel):
    name: str
    category: str
    level: Optional[str] = "Intermediate"
    confidence: Optional[float] = 0.9
    prerequisites: Optional[List[str]] = []


class ResumeAnalysis(BaseModel):
    skills: List[SkillInfo]
    total_skills_count: int
    skill_categories: Dict[str, List[str]]


class JobDescription(BaseModel):
    text: str


class Resume(BaseModel):
    text: str


class OnboardingRequest(BaseModel):
    resume_text: str
    job_description_text: str


class OnboardingResponse(BaseModel):
    skills_analysis: Dict
    gap_analysis: Dict
    learning_path: Dict
    reasoning_trace: Dict


# ==================== Endpoints ====================

@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "AI-Adaptive Onboarding Engine",
        "version": "1.0.0"
    }


@app.post("/extract/resume", response_model=ResumeAnalysis, tags=["Parsing"])
async def extract_resume_skills(request: Resume):
    """
    Extract skills from resume text.
    
    Input: Resume text
    Output: Extracted skills with expertise levels
    """
    try:
        if not request.text or len(request.text.strip()) < 10:
            raise HTTPException(status_code=400, detail="Resume text must be at least 10 characters")
        
        result = skill_extractor.extract_from_resume(request.text)
        
        return ResumeAnalysis(
            skills=[SkillInfo(**skill) for skill in result['skills']],
            total_skills_count=result['total_skills_count'],
            skill_categories=result['skill_categories']
        )
    except Exception as e:
        logger.error(f"Error extracting resume skills: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing resume: {str(e)}")


@app.post("/extract/job-description", tags=["Parsing"])
async def extract_job_skills(request: JobDescription):
    """
    Extract required skills from job description.
    
    Input: Job description text
    Output: Required and nice-to-have skills
    """
    try:
        if not request.text or len(request.text.strip()) < 10:
            raise HTTPException(
                status_code=400,
                detail="Job description text must be at least 10 characters"
            )
        
        result = skill_extractor.extract_from_job_description(request.text)
        
        return {
            "required_skills": result['required_skills'],
            "nice_to_have_skills": result['nice_to_have_skills'],
            "total_required": result['total_required'],
            "total_nice_to_have": result['total_nice_to_have'],
            "skill_categories": result['skill_categories']
        }
    except Exception as e:
        logger.error(f"Error extracting job skills: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing job description: {str(e)}")


@app.post("/analyze/gaps", tags=["Analysis"])
async def analyze_skill_gaps(request: OnboardingRequest):
    """
    Analyze skill gaps between resume and job requirements.
    
    Input: Resume text and job description text
    Output: Categorized skills (known, partial, missing) with reasoning
    """
    try:
        # Validate inputs
        if not request.resume_text or len(request.resume_text.strip()) < 10:
            raise HTTPException(status_code=400, detail="Resume text too short")
        if not request.job_description_text or len(request.job_description_text.strip()) < 10:
            raise HTTPException(status_code=400, detail="Job description text too short")
        
        # Extract skills
        resume_result = skill_extractor.extract_from_resume(request.resume_text)
        job_result = skill_extractor.extract_from_job_description(request.job_description_text)
        
        # Extract full skills with levels
        resume_skills_full = []
        for i, skill in enumerate(resume_result['skills']):
            skill['level'] = skill.get('level', 'Intermediate')
            resume_skills_full.append(skill)
        
        # Analyze gaps
        gap_analysis = gap_analyzer.analyze_gaps(
            resume_skills_full,
            job_result['required_skills']
        )
        
        return gap_analysis
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing gaps: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error analyzing gaps: {str(e)}")


@app.post("/generate/learning-path", tags=["Learning Path"])
async def generate_learning_path(request: OnboardingRequest):
    """
    Generate personalized adaptive learning path.
    
    Input: Resume text and job description text
    Output: Structured learning modules with timeline and reasoning
    """
    try:
        # Validate inputs
        if not request.resume_text or len(request.resume_text.strip()) < 10:
            raise HTTPException(status_code=400, detail="Resume text too short")
        if not request.job_description_text or len(request.job_description_text.strip()) < 10:
            raise HTTPException(status_code=400, detail="Job description text too short")
        
        # Extract skills
        resume_result = skill_extractor.extract_from_resume(request.resume_text)
        job_result = skill_extractor.extract_from_job_description(request.job_description_text)
        
        # Prepare skills with levels
        resume_skills = []
        for skill in resume_result['skills']:
            skill['level'] = skill.get('level', 'Intermediate')
            resume_skills.append(skill)
        
        # Analyze gaps
        gap_analysis = gap_analyzer.analyze_gaps(resume_skills, job_result['required_skills'])
        
        # Get skills to address (prioritized)
        gaps_to_address = gap_analyzer.prioritize_skills_to_learn(gap_analysis)
        
        # Generate learning path
        learning_path = learning_path_generator.generate_learning_path(gaps_to_address, resume_skills)
        
        return learning_path
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating learning path: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating learning path: {str(e)}")


@app.post("/onboarding/complete", response_model=OnboardingResponse, tags=["Onboarding"])
async def complete_onboarding_analysis(request: OnboardingRequest):
    """
    Complete onboarding analysis - one-stop endpoint.
    Combines skills extraction, gap analysis, and learning path generation.
    
    Input: Resume text and job description text
    Output: Complete onboarding analysis with all components and reasoning
    """
    try:
        # Validate inputs
        if not request.resume_text or len(request.resume_text.strip()) < 10:
            raise HTTPException(status_code=400, detail="Resume text too short")
        if not request.job_description_text or len(request.job_description_text.strip()) < 10:
            raise HTTPException(status_code=400, detail="Job description text too short")
        
        # Step 1: Extract skills from resume
        logger.info("Extracting skills from resume...")
        resume_result = skill_extractor.extract_from_resume(request.resume_text)
        
        # Step 2: Extract skills from job description
        logger.info("Extracting skills from job description...")
        job_result = skill_extractor.extract_from_job_description(request.job_description_text)
        
        # Step 3: Analyze gaps
        logger.info("Analyzing skill gaps...")
        resume_skills_full = []
        for skill in resume_result['skills']:
            skill['level'] = skill.get('level', 'Intermediate')
            resume_skills_full.append(skill)
        
        gap_analysis = gap_analyzer.analyze_gaps(
            resume_skills_full,
            job_result['required_skills']
        )
        
        # Step 4: Generate learning path
        logger.info("Generating adaptive learning path...")
        gaps_to_address = gap_analyzer.prioritize_skills_to_learn(gap_analysis)
        learning_path = learning_path_generator.generate_learning_path(gaps_to_address, resume_skills_full)
        
        # Step 5: Generate reasoning trace
        logger.info("Building reasoning trace...")
        reasoning_trace = {
            'approach': 'AI-Adaptive Onboarding Engine',
            'methodology': 'Skills extraction → Gap analysis → Dependency-based path generation',
            'steps': [
                '1. Extracted skills from your resume',
                '2. Identified job requirements from description',
                '3. Calculated skill gaps with priority scoring',
                f'4. Generated learning path with {len(learning_path["modules"])} modules',
                '5. Ordered modules by prerequisites and criticality'
            ],
            'key_insights': [
                f'You currently have {gap_analysis["statistics"]["known_count"]} of {gap_analysis["statistics"]["total_required_skills"]} required skills',
                f'Skill coverage: {gap_analysis["statistics"]["coverage_percentage"]}%',
                f'Readiness score: {gap_analysis["statistics"]["readiness_score"]}/100',
                f'Estimated learning time: {learning_path["total_duration_weeks"]} weeks (~{learning_path["total_duration_hours"]} hours)'
            ],
            'recommendations': [
                'Follow the learning path in recommended order for optimal learning',
                'Each module includes suggested resources and assessment criteria',
                'Plan for spaced repetition and hands-on projects',
                'Review prerequisites before starting each module'
            ]
        }
        
        return OnboardingResponse(
            skills_analysis={
                'resume_skills': resume_result,
                'job_requirements': job_result
            },
            gap_analysis=gap_analysis,
            learning_path=learning_path,
            reasoning_trace=reasoning_trace
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in complete onboarding analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error in analysis: {str(e)}")


@app.post("/reasoning/trace/{skill_name}", tags=["Reasoning"])
async def get_skill_explanation(skill_name: str, request: OnboardingRequest):
    """
    Get explainability trace for a specific skill.
    Shows WHY the skill is recommended.
    
    Input: Skill name, resume and job description
    Output: Detailed reasoning for skill recommendation
    """
    try:
        # Extract and analyze
        resume_result = skill_extractor.extract_from_resume(request.resume_text)
        job_result = skill_extractor.extract_from_job_description(request.job_description_text)
        
        resume_skills_full = []
        for skill in resume_result['skills']:
            skill['level'] = skill.get('level', 'Intermediate')
            resume_skills_full.append(skill)
        
        gap_analysis = gap_analyzer.analyze_gaps(resume_skills_full, job_result['required_skills'])
        
        # Get explanation
        explanation = gap_analyzer.generate_explainability_trace(skill_name, gap_analysis)
        
        return explanation
    except Exception as e:
        logger.error(f"Error getting skill explanation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.get("/", tags=["Root"])
async def root():
    """API root endpoint with documentation."""
    return {
        "message": "AI-Adaptive Onboarding Engine API",
        "version": "1.0.0",
        "documentation": "/docs",
        "main_endpoint": "/onboarding/complete",
        "features": [
            "Resume skill extraction",
            "Job requirement analysis",
            "Skill gap detection with reasoning",
            "Adaptive learning path generation",
            "Dependency-based course sequencing"
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
