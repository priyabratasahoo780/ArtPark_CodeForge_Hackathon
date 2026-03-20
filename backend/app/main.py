from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import logging
from pathlib import Path

from app.services.skill_extractor import SkillExtractor
from app.services.gap_analyzer import SkillGapAnalyzer
from app.services.learning_path_generator import LearningPathGenerator
from app.services.dependency_resolver import DependencyResolver
from app.services.role_matcher import RoleMatcher
from app.services.voice_explainer import VoiceExplainer
from app.services.time_analytics import TimeAnalytics
from app.services.resume_benchmarker import ResumeBenchmarker
from app.services.feedback_generator import ResumeFeedbackGenerator
from app.services.domain_classifier import DomainClassifier
from app.services.learning_style_analyzer import LearningStyleAnalyzer
from app.services.burnout_detector import BurnoutDetector
from app.services.career_path_predictor import CareerPathPredictor
from app.services.market_trend_analyzer import MarketTrendAnalyzer
from app.services.learning_efficiency_calculator import LearningEfficiencyCalculator
from app.services.doubt_detector import DoubtDetector
from app.services.skill_decay_detector import SkillDecayDetector
from app.routes import auth
from app.services.auth_service import auth_service, RoleChecker
from app.models.user import RoleEnum

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

# Include Auth Router
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# ==================== Initialize Services (must be before route handlers) ====================
skill_extractor = SkillExtractor()
gap_analyzer = SkillGapAnalyzer()
learning_path_generator = LearningPathGenerator()
dependency_resolver = DependencyResolver()
role_matcher = RoleMatcher()
voice_explainer = VoiceExplainer()
time_analytics = TimeAnalytics()
resume_benchmarker = ResumeBenchmarker(
    skill_extractor=skill_extractor,
    gap_analyzer=gap_analyzer,
    role_matcher=role_matcher,
)
feedback_generator = ResumeFeedbackGenerator()
domain_classifier = DomainClassifier()
learning_style_analyzer = LearningStyleAnalyzer()
burnout_detector = BurnoutDetector()
career_path_predictor = CareerPathPredictor()
market_trend_analyzer = MarketTrendAnalyzer()
learning_efficiency_calculator = LearningEfficiencyCalculator()
doubt_detector = DoubtDetector()
skill_decay_detector = SkillDecayDetector()

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
    interactions: Optional[Dict[str, int]] = None
    learning_style_override: Optional[str] = None
    engagement_metrics: Optional[Dict[str, Any]] = None
    target_role: Optional[str] = None
    timeline_days: Optional[int] = None


class MultiOnboardingRequest(BaseModel):
    resumes: List[str]  # List of resume texts
    job_description_text: str
    candidate_names: Optional[List[str]] = None


class HRMetrics(BaseModel):
    total_candidates: int
    avg_readiness_score: float
    total_time_saved_hours: float
    top_skills_missing: List[str]


# Protected HR Route Example (Auth bypassed for demo)
@app.get("/hr/stats", response_model=Dict)
async def get_hr_stats():
    return {
        "message": "Welcome HR Manager",
        "total_onboarded": 125,
        "avg_readiness": 82.5,
        "active_paths": 42
    }


@app.post("/hr/analyze-multiple", response_model=Dict)
async def analyze_multiple_resumes(request: MultiOnboardingRequest):
    try:
        results = []
        total_readiness = 0
        total_time_saved = 0
        
        for i, resume_text in enumerate(request.resumes):
            name = request.candidate_names[i] if request.candidate_names and i < len(request.candidate_names) else f"Candidate {i+1}"
            
            # Analyze each resume
            skills = skill_extractor.extract_skills_from_text(resume_text)
            jd_skills = skill_extractor.extract_skills_from_text(request.job_description_text)
            role_match = role_matcher.match_role(request.job_description_text)
            gaps = gap_analyzer.analyze_gaps(skills, jd_skills, role_match.get('role', 'General'))
            path = learning_path_generator.generate_learning_path(gaps['missing_skills'] + gaps['partial_skills'], skills)

            # Calculate time saved
            ts = time_analytics.calculate(gaps, path)
            
            results.append({
                "name": name,
                "readiness_score": gaps['statistics']['readiness_score'],
                "skills_match": gaps['statistics']['known_count'],
                "missing_skills": [s['name'] for s in gaps['missing_skills'][:3]],
                "time_saved": ts['hours_saved']
            })
            
            total_readiness += gaps['statistics']['readiness_score']
            total_time_saved += ts['hours_saved']
            
        # Sort by readiness score
        results.sort(key=lambda x: x["readiness_score"], reverse=True)
        
        return {
            "candidates": results,
            "metrics": {
                "avg_readiness": total_readiness / len(request.resumes) if request.resumes else 0,
                "total_time_saved": total_time_saved
            }
        }
    except Exception as e:
        import traceback
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=traceback.format_exc())



@app.get("/hr/metrics", response_model=HRMetrics)
async def get_hr_metrics():
    # This would ideally hit a database, but we return fresh mock aggregates for the hackathon
    return HRMetrics(
        total_candidates=42,
        avg_readiness_score=78.4,
        total_time_saved_hours=1240.5,
        top_skills_missing=["React Native", "Kubernetes", "GraphQL"]
    )


@app.get("/hr/analytics-extended", tags=["HR Analytics"])
async def get_extended_analytics():
    """
    Advanced HR Analytics — distribution and performance data for charts.
    """
    return {
        "skill_gap_distribution": [
            {"name": "Known", "value": 45, "color": "#00f3ff"},
            {"name": "Partial", "value": 30, "color": "#bc13fe"},
            {"name": "Missing", "value": 25, "color": "#ff00e5"}
        ],
        "readiness_trend": [
            {"month": "Jan", "score": 65},
            {"month": "Feb", "score": 68},
            {"month": "Mar", "score": 75},
            {"month": "Apr", "score": 82},
            {"month": "May", "score": 78},
            {"month": "Jun", "score": 85}
        ],
        "role_performance": [
            {"role": "Frontend", "readiness": 82, "candidates": 15},
            {"role": "Backend", "readiness": 74, "candidates": 12},
            {"role": "Fullstack", "readiness": 79, "candidates": 8},
            {"role": "DevOps", "readiness": 68, "candidates": 7}
        ],
        "time_saved_by_role": [
            {"role": "Frontend", "saved": 450},
            {"role": "Backend", "saved": 380},
            {"role": "Fullstack", "saved": 290},
            {"role": "DevOps", "saved": 120}
        ]
    }

# Endpoints below — Pydantic Models defined above at line 61

class OnboardingResponse(BaseModel):
    skills_analysis: Dict
    detected_domain: Dict
    gap_analysis: Dict
    learning_path: Dict
    reasoning_trace: Dict
    resume_feedback: List[Dict]
    efficiency_metrics: Optional[Dict] = None
    learning_style: Optional[str] = None
    burnout_status: Optional[Dict] = None
    career_paths: Optional[List[str]] = None
    market_insights: Optional[Dict[str, List[str]]] = None
    goal: Optional[str] = None
    efficiency_score: Optional[int] = None
    doubt_status: Optional[Dict] = None
    decayed_skills: Optional[List[Dict]] = None

class ProgressUpdateRequest(BaseModel):
    resume_text: str
    job_description_text: str
    completed_skills: List[str]  # Skill names the user has now completed
    session_id: Optional[str] = None  # Optional session tracking
    interactions: Optional[Dict[str, int]] = None
    learning_style_override: Optional[str] = None
    engagement_metrics: Optional[Dict[str, Any]] = None

class LearningStyleRequest(BaseModel):
    interactions: Dict[str, int]

class BurnoutRequest(BaseModel):
    engagement_metrics: Dict[str, Any]

class VoiceExplainRequest(BaseModel):
    reasoning_trace: Dict
    gap_stats: Optional[Dict] = None

class CareerPathRequest(BaseModel):
    current_skills: List[str]

class MarketTrendRequest(BaseModel):
    current_skills: List[str]
    domain: Optional[str] = "Full Stack"
    custom_text: Optional[str] = None
    lang: Optional[str] = "en"
    role: Optional[str] = "USER"


class VoiceExplainSkillRequest(BaseModel):
    skill_name: str
    confidence: float
    signals: Optional[List[str]] = []


class TimeSavedRequest(BaseModel):
    gap_analysis: Dict
    learning_path: Dict


class CandidateInput(BaseModel):
    name: str
    resume_text: str


class BenchmarkRequest(BaseModel):
    job_description_text: str
    candidates: List[CandidateInput]   # 2–20 candidates


# ==================== Endpoints ====================

@app.post("/analyze/learning-style", tags=["Analysis"])
async def analyze_learning_style(request: LearningStyleRequest):
    """
    Detect user's preferred learning style based on interaction counts.
    """
    style = learning_style_analyzer.detect_style(request.interactions)
    return {"learning_style": style}

@app.post("/analyze/burnout", tags=["Analysis"])
async def analyze_burnout(request: BurnoutRequest):
    """
    Detect user fatigue based on engagement metrics.
    """
    burnout_status = burnout_detector.detect(request.engagement_metrics)
    return burnout_status

@app.post("/analyze/career-path", tags=["Analysis"])
async def predict_career_path(request: CareerPathRequest):
    """
    Suggest future career roles based on current skills.
    """
    return career_path_predictor.predict(request.current_skills)

@app.post("/analyze/market-trends", tags=["Analysis"])
async def analyze_market_trends(request: MarketTrendRequest):
    """
    Compare user skills with industry demands to find trending skills.
    """
    return market_trend_analyzer.analyze(request.current_skills, request.domain)

@app.post("/benchmark/candidates", tags=["Benchmarking"])
async def benchmark_candidates(request: BenchmarkRequest):
    """
    Multi-Resume Benchmarking — rank candidates against a job description.

    Scoring (composite 0–100):
      - Skill coverage  (known / total required)  40%
      - Readiness score (gap_analyzer)            35%
      - Avg confidence  (from resume context)     15%
      - Depth bonus     (advanced skills ratio)   10%
      + Nice-to-have bonus                        up to +3 pts

    Input:
        job_description_text: JD text
        candidates:           list of {name, resume_text} (2–20)

    Output:
        ranked_candidates, summary, job_description_skills
    """
    try:
        if len(request.candidates) < 2:
            raise HTTPException(status_code=400, detail="At least 2 candidates required")
        if len(request.candidates) > 20:
            raise HTTPException(status_code=400, detail="Maximum 20 candidates per request")
        if not request.job_description_text or len(request.job_description_text.strip()) < 10:
            raise HTTPException(status_code=400, detail="Job description text too short")

        logger.info(f"Benchmarking {len(request.candidates)} candidates")

        candidates_dicts = [
            {"name": c.name, "resume_text": c.resume_text}
            for c in request.candidates
        ]

        result = resume_benchmarker.benchmark(
            candidates=candidates_dicts,
            job_description_text=request.job_description_text,
        )
        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Benchmark error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Benchmark error: {str(e)}")


@app.post("/analytics/time-saved", tags=["Analytics"])
async def get_time_saved_analytics(request: TimeSavedRequest, current_user=Depends(RoleChecker([RoleEnum.HR, RoleEnum.USER]))):
    """
    Time Saved Analytics — compare traditional vs adaptive learning time.

    Traditional model: all required skills studied from scratch + 20% overhead.
    Adaptive model:    only gap skills, actual hours from the generated roadmap.

    Input:
        gap_analysis:  gap_analysis dict from /onboarding/complete
        learning_path: learning_path dict from /onboarding/complete

    Output:
        traditional_days, optimized_days, time_saved, efficiency_gain, breakdown
    """
    try:
        result = time_analytics.calculate(
            gap_analysis=request.gap_analysis,
            learning_path=request.learning_path,
        )
        return result
    except Exception as e:
        logger.error(f"Time analytics error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analytics error: {str(e)}")


@app.post("/explain/voice", tags=["Voice Explanation"])
async def explain_voice(request: VoiceExplainRequest, current_user=Depends(RoleChecker([RoleEnum.HR, RoleEnum.USER]))):
    """
    Convert analysis reasoning trace to speech (TTS).

    Returns base64-encoded MP3 audio + plain text script.
    Fallback: returns text only if gTTS unavailable.

    Input:
        reasoning_trace: reasoning_trace dict from /onboarding/complete
        gap_stats:       optional gap_analysis['statistics']
        custom_text:     optional custom text to synthesize directly
        lang:            TTS language code (default: 'en')

    Output:
        script, audio_b64, audio_mime, tts_available
    """
    try:
        explainer = VoiceExplainer(lang=request.lang or "en")
        result = explainer.explain(
            reasoning_trace=request.reasoning_trace,
            gap_stats=request.gap_stats,
            custom_text=request.custom_text,
            role=request.role or "USER"
        )
        return result
    except Exception as e:
        logger.error(f"Voice explain error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"TTS error: {str(e)}")


@app.post("/explain/skill", tags=["Voice Explanation"])
async def explain_skill_voice(request: VoiceExplainSkillRequest, current_user=Depends(RoleChecker([RoleEnum.HR, RoleEnum.USER]))):
    """
    Generate a short voice explanation for a single skill's confidence score.

    Input: skill_name, confidence (0-1), signals list
    Output: script, audio_b64, tts_available
    """
    try:
        result = voice_explainer.explain_skill(
            skill_name=request.skill_name,
            confidence=request.confidence,
            signals=request.signals or [],
        )
        return result
    except Exception as e:
        logger.error(f"Skill voice explain error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"TTS error: {str(e)}")


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
async def complete_onboarding_analysis(request: OnboardingRequest, current_user=Depends(RoleChecker([RoleEnum.HR, RoleEnum.USER]))):
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

        # Step 0: Determine Learning Style and Burnout
        if request.learning_style_override:
            learning_style = request.learning_style_override
        else:
            learning_style = learning_style_analyzer.detect_style(request.interactions or {})
        logger.info(f"Detected learning style: {learning_style}")
        
        burnout_status = burnout_detector.detect(request.engagement_metrics or {})
        logger.info(f"Burnout detection: {burnout_status['burnout']}")

        # Step 1: Extract skills from resume
        logger.info("Extracting skills from resume...")
        resume_result = skill_extractor.extract_from_resume(request.resume_text)

        # Step 2: Extract skills from job description
        logger.info("Extracting skills from job description...")
        job_result = skill_extractor.extract_from_job_description(request.job_description_text)

        # Step 2b: Role matching + hybrid skill set
        logger.info("Matching job description to role track...")
        role_match = role_matcher.match_role(request.job_description_text)
        hybrid_result = role_matcher.hybrid_skill_set(
            jd_skills=list(job_result['required_skills']),
            jd_text=request.job_description_text,
            match_result=role_match,
        )
        # Use hybrid skills as the effective required skills for gap analysis
        effective_required_skills = hybrid_result['skills']

        # Step 3: Analyze gaps
        logger.info("Analyzing skill gaps...")
        resume_skills_full = []
        for skill in resume_result['skills']:
            skill['level'] = skill.get('level', 'Intermediate')
            resume_skills_full.append(skill)

        gap_analysis = gap_analyzer.analyze_gaps(
            resume_skills_full,
            effective_required_skills,
            role_match['role']
        )

        # Step 4: Generate learning path
        # Step 3: Generate Adaptive Learning Path
        logger.info("Generating adaptive learning path...")
        learning_path = learning_path_generator.generate_learning_path(
            gap_analysis['missing_skills'] + gap_analysis['partial_skills'],
            resume_skills_full,
            learning_style=learning_style,
            burnout_detected=burnout_status.get('burnout', False),
            target_role=request.target_role,
            timeline_days=request.timeline_days
        )

        # Step 4b: Generate resume feedback
        logger.info("Generating actionable resume feedback...")
        resume_feedback = feedback_generator.generate_feedback(gap_analysis, request.resume_text)

        # Step 4c: Career Path Predictions
        logger.info("Predicting future career paths...")
        known_skill_names = [s['name'] for s in gap_analysis['known_skills']]
        career_predictions = career_path_predictor.predict(known_skill_names)

        # Step 4d: Market Trend Analysis
        logger.info("Analyzing missing trending market skills...")
        matched_domain_name = "Full Stack"
        if isinstance(domain_result, dict) and "domain" in domain_result:
            matched_domain_name = domain_result["domain"]
        elif isinstance(domain_result, str):
            matched_domain_name = domain_result
        market_insights = market_trend_analyzer.analyze(known_skill_names, domain=matched_domain_name)

        # Step 4c: Calculate efficiency metrics (Feature 7)
        logger.info("Calculating time saved analytics...")
        efficiency_metrics = time_analytics.calculate(
            gap_analysis=gap_analysis,
            learning_path=learning_path
        )

        # Step 5: Generate reasoning trace
        logger.info("Classifying domain and building reasoning trace...")
        domain_result = domain_classifier.classify_domain(request.resume_text + " " + request.job_description_text)
        
        role_info = (
            f"Role: '{role_match['role']}' (confidence {role_match['confidence']:.2f}, {hybrid_result['source']} mode)"
        )
        reasoning_trace = {
            'approach': 'AI-Adaptive Onboarding Engine',
            'methodology': 'Skills extraction → Role matching → Gap analysis → Dependency-based path generation',
            'role_analysis': {
                'matched_role': role_match['role'],
                'confidence': role_match['confidence'],
                'mode': hybrid_result['source'],
                'skills_added_from_role': hybrid_result['added_from_role'],
                'reasoning': hybrid_result['reasoning'],
                'top_role_scores': dict(list(role_match['all_scores'].items())[:5]),
            },
            'steps': [
                '1. Extracted skills from your resume',
                '2. Identified job requirements from description',
                f'3. {role_info}',
                '4. Calculated skill gaps with priority scoring',
                f'5. Generated learning path with {len(learning_path["modules"])} modules',
                '6. Ordered modules by prerequisites and criticality'
            ],
            'key_insights': [
                f'You currently have {gap_analysis["statistics"]["known_count"]} of {gap_analysis["statistics"]["total_required_skills"]} required skills',
                f'Skill coverage: {gap_analysis["statistics"]["coverage_percentage"]}%',
                f'Readiness score: {gap_analysis["statistics"]["readiness_score"]}/100',
                f'Estimated learning time: {learning_path.get("timeline", {}).get("estimated_weeks", "N/A")} weeks (~{learning_path.get("total_duration_hours", "N/A")} hours)',
                f'Learning path includes {len(learning_path.get("modules", []))} modules ({sum(1 for m in learning_path.get("modules", []) if m.get("is_injected_prerequisite"))} auto-injected prerequisites)'
            ],
            'recommendations': [
                'Follow the learning path in recommended order for optimal learning',
                'Each module includes suggested resources and assessment criteria',
                'Plan for spaced repetition and hands-on projects',
                'Review prerequisites before starting each module'
            ]
        }

        # Step 4f: Learning Efficiency
        logger.info("Computing learning efficiency score...")
        efficiency_result = learning_efficiency_calculator.calculate(request.engagement_metrics)

        # Step 4g: Doubt Detection
        logger.info("Running auto-doubt detection...")
        doubt_status = doubt_detector.detect(request.engagement_metrics)

        # Step 4h: Skill Decay
        logger.info("Running skill decay simulator...")
        decayed_skills = skill_decay_detector.detect(gap_analysis.get('known_skills', []), request.engagement_metrics)

        return OnboardingResponse(
            skills_analysis={
                'resume_skills': resume_skills_full,
                'job_requirements': effective_required_skills,
                'role_track': {
                    'matched_role': role_match['role'],
                    'confidence': role_match['confidence'],
                    'typical_stack': role_match.get('typical_stack', ''),
                    'skills_added_from_role': hybrid_result['added_from_role'],
                    'mode': hybrid_result['source'],
                }
            },
            detected_domain=domain_result,
            gap_analysis=gap_analysis,
            learning_path=learning_path,
            reasoning_trace=reasoning_trace,
            resume_feedback=resume_feedback,
            efficiency_metrics=efficiency_metrics,
            learning_style=learning_style,
            burnout_status=burnout_status,
            career_paths=career_predictions['next_roles'],
            market_insights=market_insights,
            goal=learning_path.get('goal'),
            efficiency_score=efficiency_result['efficiency_score'],
            doubt_status=doubt_status,
            decayed_skills=decayed_skills
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


@app.post("/analyze/resume-feedback", tags=["Analysis"])
async def get_resume_feedback(request: OnboardingRequest):
    """
    Generate actionable feedback for the resume.
    
    Input: Resume text and job description text
    Output: List of actionable suggestions, projects, and keywords
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
        
        # Generate feedback
        feedback = feedback_generator.generate_feedback(gap_analysis, request.resume_text)
        
        return {"resume_feedback": feedback}
    except Exception as e:
        logger.error(f"Error generating resume feedback: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.post("/update-progress", tags=["Adaptive Re-evaluation"])
async def update_progress(request: ProgressUpdateRequest, current_user=Depends(RoleChecker([RoleEnum.USER, RoleEnum.HR]))):
    """
    Adaptive Re-evaluation Loop — recalculate the full roadmap after user progress.

    How it works:
    1. Merge `completed_skills` into the resume skill pool (marked as fully known)
    2. Re-run role matching against the JD
    3. Re-run skill gap analysis (completed skills now appear as 'known')
    4. Re-generate the learning path (completed skills removed from roadmap)
    5. Return an updated analysis with progress stats

    Input:
        resume_text:         Original resume text
        job_description_text: Original job description
        completed_skills:    List of skill names the user has just mastered
        session_id:          Optional tracking ID

    Output:
        Updated gap analysis, updated learning path, progress summary
    """
    try:
        if not request.resume_text or len(request.resume_text.strip()) < 10:
            raise HTTPException(status_code=400, detail="Resume text too short")
        if not request.job_description_text or len(request.job_description_text.strip()) < 10:
            raise HTTPException(status_code=400, detail="Job description text too short")
        if not isinstance(request.completed_skills, list):
            raise HTTPException(status_code=400, detail="completed_skills must be a list")

        completed_lower = {s.lower() for s in request.completed_skills}
        logger.info(
            f"Re-evaluating progress: {len(request.completed_skills)} skills completed "
            f"({', '.join(request.completed_skills[:5])}{'...' if len(request.completed_skills) > 5 else ''})"
        )

        # Step 1: Extract original resume skills
        resume_result = skill_extractor.extract_from_resume(request.resume_text)
        original_skills = resume_result['skills']

        # Step 2: Merge completed skills into resume pool as fully known, Advanced level
        existing_names_lower = {s['name'].lower() for s in original_skills}
        injected = []
        for skill_name in request.completed_skills:
            if skill_name.lower() not in existing_names_lower:
                injected.append({
                    'name': skill_name,
                    'category': 'Completed',
                    'level': 'Advanced',
                    'required_level': 'Advanced',
                    'confidence': 1.0,
                    'confidence_signals': ['Marked as completed by user'],
                    'prerequisites': [],
                    'source': 'user_progress',
                })

        augmented_resume_skills = original_skills + injected
        # Ensure all have level
        for skill in augmented_resume_skills:
            skill['level'] = skill.get('level', 'Intermediate')

        # Step 3: Extract JD skills + role match + hybrid merge
        job_result = skill_extractor.extract_from_job_description(request.job_description_text)
        role_match = role_matcher.match_role(request.job_description_text)
        hybrid_result = role_matcher.hybrid_skill_set(
            jd_skills=list(job_result['required_skills']),
            jd_text=request.job_description_text,
            match_result=role_match,
        )
        effective_required_skills = hybrid_result['skills']

        # Step 3b: Determine Learning Style and Burnout
        if request.learning_style_override:
            learning_style = request.learning_style_override
            logger.info(f"Learning style overridden to: {learning_style}")
        else:
            learning_style = learning_style_analyzer.detect_style(request.interactions or {})
            logger.info(f"Detected learning style: {learning_style}")
            
        burnout_status = burnout_detector.detect(request.engagement_metrics or {})
        logger.info(f"Burnout detection: {burnout_status['burnout']}")

        # Step 4: Re-run gap analysis (completed skills now in resume pool → show as known)
        updated_gap_analysis = gap_analyzer.analyze_gaps(augmented_resume_skills, effective_required_skills)
        
        # For learning path generation, we need the full set of skills that are considered 'known'
        # This includes original resume skills + newly injected completed skills
        hybrid_skills_for_path = augmented_resume_skills 

        # Step 5: Re-generate learning path (completed skills skipped by DependencyResolver)
        gaps_to_address = gap_analyzer.prioritize_skills_to_learn(updated_gap_analysis)
        updated_learning_path = learning_path_generator.generate_learning_path(
            gaps_to_address, hybrid_skills_for_path, learning_style=learning_style, burnout_detected=burnout_status['burnout']
        )

        # Step 6: Build progress summary
        total_required = updated_gap_analysis['statistics']['total_required_skills']
        newly_known = updated_gap_analysis['statistics']['known_count']
        remaining_gaps = (
            updated_gap_analysis['statistics']['missing_count'] +
            updated_gap_analysis['statistics']['partial_count']
        )

        # Verify which completed skills are confirmed in known list
        confirmed_completed = [
            s['name'] for s in updated_gap_analysis['known_skills']
            if s['name'].lower() in completed_lower
        ]
        not_yet_matched = [
            s for s in request.completed_skills
            if s.lower() not in {c.lower() for c in confirmed_completed}
        ]

        # Step 5b: Predict next roles based on updated skills
        all_known_skill_names = [s['name'] for s in updated_gap_analysis['known_skills']]
        career_predictions = career_path_predictor.predict(all_known_skill_names)

        # Step 5c: Market Trend Analysis
        market_insights = market_trend_analyzer.analyze(all_known_skill_names)

        # Step 5d: Learning Efficiency Score
        efficiency_result = learning_efficiency_calculator.calculate(request.engagement_metrics)

        # Step 5e: Doubt Detection
        doubt_status = doubt_detector.detect(request.engagement_metrics)

        # Step 5f: Skill Decay Detection
        decayed_skills = skill_decay_detector.detect(updated_gap_analysis.get('known_skills', []), request.engagement_metrics)

        progress_summary = {
            'completed_skills_submitted': request.completed_skills,
            'confirmed_as_known': confirmed_completed,
            'not_matched_in_jd': not_yet_matched,
            'skills_newly_injected_to_resume': [s['name'] for s in injected],
            'total_required_skills': total_required,
            'now_known': newly_known,
            'remaining_gaps': remaining_gaps,
            'new_coverage_percentage': updated_gap_analysis['statistics']['coverage_percentage'],
            'new_readiness_score': updated_gap_analysis['statistics']['readiness_score'],
            'remaining_modules': len(updated_learning_path['modules']),
            'remaining_hours': updated_learning_path['total_duration_hours'],
            'remaining_weeks': updated_learning_path.get('timeline', {}).get('estimated_weeks', 'N/A'),
            'role_track': role_match['role'],
            'role_confidence': role_match['confidence'],
            'session_id': request.session_id,
            'message': (
                f"Great progress! You've completed {len(confirmed_completed)} required skill(s). "
                f"Your roadmap is adapted to a {learning_style} learning style."
            )
        }

        return {
            'progress_summary': progress_summary,
            'updated_gap_analysis': updated_gap_analysis,
            'updated_learning_path': updated_learning_path,
            'learning_style': learning_style,
            'burnout_status': burnout_status,
            'career_paths': career_predictions['next_roles'],
            'market_insights': market_insights,
            'goal': updated_learning_path.get('goal'),
            'efficiency_score': efficiency_result['efficiency_score'],
            'doubt_status': doubt_status,
            'decayed_skills': decayed_skills,
            'reasoning': {
                'approach': 'Adaptive Re-evaluation Loop',
                'methodology': (
                    'Completed skills merged into resume pool → '
                    'Gap analysis re-run → '
                    'Roadmap regenerated without mastered skills'
                ),
                'role_match': {
                    'role': role_match['role'],
                    'confidence': role_match['confidence'],
                    'mode': hybrid_result['source'],
                },
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating progress: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error updating progress: {str(e)}")


@app.get("/roles/list", tags=["Role Tracks"])
async def list_roles():
    """
    List all predefined role-based learning tracks.

    Returns:
        List of roles with description, core skills, and typical stack.
    """
    return {
        "roles": role_matcher.list_roles(),
        "total": len(role_matcher.roles),
    }


@app.post("/roles/match", tags=["Role Tracks"])
async def match_role_to_jd(request: JobDescription):
    """
    Match a job description to the closest predefined role.

    Uses keyword + TF-IDF cosine similarity scoring.
    Returns confidence score and all role scores for transparency.

    Input: Job description text
    Output: Best-match role, confidence, and scores for all roles
    """
    try:
        if not request.text or len(request.text.strip()) < 10:
            raise HTTPException(status_code=400, detail="Job description text too short")
        result = role_matcher.match_role(request.text)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error matching role: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.get("/roles/{role_name}/skills", tags=["Role Tracks"])
async def get_role_skills(role_name: str, include_secondary: bool = True):
    """
    Get the predefined skill set for a specific role.

    Path param:
        role_name: Exact role name (use /roles/list to see options).
    Query param:
        include_secondary: Include secondary skills (default true).

    Returns:
        core_skills, secondary_skills, nice_to_have, level_expectations
    """
    try:
        skills = role_matcher.get_role_skills(role_name, include_secondary)
        return {"role": role_name, **skills}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error getting role skills: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.get("/graph/skills", tags=["Dependency Graph"])
async def get_skill_graph(skills: str = None):
    """
    Return the full skill dependency graph for visualization.

    Query param:
        skills: Optional comma-separated list of skill names to scope the graph.
                If omitted, returns the complete graph.

    Returns:
        nodes: List of skill nodes with category/level metadata
        edges: List of prerequisite edges (from → to)
    """
    try:
        skill_list = [s.strip() for s in skills.split(",")] if skills else None
        graph = dependency_resolver.build_full_graph(skill_list)
        return graph
    except Exception as e:
        logger.error(f"Error building skill graph: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error building graph: {str(e)}")


@app.post("/graph/prerequisites/{skill_name}", tags=["Dependency Graph"])
async def get_skill_prerequisites(skill_name: str, request: Resume):
    """
    Return ordered prerequisite chain for a specific skill,
    excluding skills already present in the provided resume text.

    Args:
        skill_name: Target skill to resolve prerequisites for.
        request.text: Resume text (used to extract known skills to skip).

    Returns:
        prerequisites: Ordered list of prerequisite skill names
        dependency_chain_length: Number of prerequisites needed
    """
    try:
        resume_result = skill_extractor.extract_from_resume(request.text)
        known_skills = {s['name'].lower() for s in resume_result['skills']}
        prereqs = dependency_resolver.get_prerequisites(skill_name, known_skills)
        return {
            "skill": skill_name,
            "prerequisites": prereqs,
            "dependency_chain_length": len(prereqs),
            "known_skills_skipped": len(known_skills),
        }
    except Exception as e:
        logger.error(f"Error resolving prerequisites for {skill_name}: {str(e)}")
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
