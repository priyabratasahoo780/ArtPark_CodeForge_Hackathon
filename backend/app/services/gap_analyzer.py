from typing import List, Dict, Tuple, Optional
from enum import Enum
import logging

logger = logging.getLogger(__name__)

class SkillStatus(str, Enum):
    """Skill status categories."""
    KNOWN = "known"
    PARTIAL = "partial"
    MISSING = "missing"


class SkillGapAnalyzer:
    """
    Analyzes gaps between current skills (from resume) and required skills (from job description).
    """
    
    LEVEL_HIERARCHY = {
        'Beginner': 1,
        'Intermediate': 2,
        'Advanced': 3
    }
    
    def __init__(self):
        pass
    
    def analyze_gaps(self, resume_skills: List[Dict], job_skills: List[Dict], role_name: Optional[str] = None) -> Dict:
        """
        Analyze skill gaps between resume and job requirements.
        
        Args:
            resume_skills: Skills extracted from resume
            job_skills: Skills required by job
            
        Returns:
            Gap analysis with categorized skills and scores
        """
        # Normalize skill names for comparison
        resume_skill_map = {skill['name'].lower(): skill for skill in resume_skills}
        job_skill_map = {skill['name'].lower(): skill for skill in job_skills}
        
        known_skills = []
        partial_skills = []
        missing_skills = []
        
        # Analyze each required skill
        for job_skill_key, job_skill in job_skill_map.items():
            if job_skill_key in resume_skill_map:
                resume_skill = resume_skill_map[job_skill_key]
                gap_score = self._calculate_gap_score(resume_skill, job_skill)
                
                skill_entry = {
                    'name': job_skill['name'],
                    'category': job_skill['category'],
                    'resume_level': resume_skill.get('level', 'Unknown'),
                    'required_level': job_skill.get('level', 'Intermediate'),
                    'gap_score': gap_score,
                    'reason': self._generate_gap_reason(resume_skill, job_skill, gap_score, role_name)
                }
                
                if gap_score <= 0:
                    known_skills.append(skill_entry)
                else:
                    partial_skills.append(skill_entry)
            else:
                # Skill is completely missing
                missing_skills.append({
                    'name': job_skill['name'],
                    'category': job_skill['category'],
                    'required_level': job_skill.get('level', 'Intermediate'),
                    'prerequisites': job_skill.get('prerequisites', []),
                    'gap_score': 3,
                    'reason': f"{job_skill['name']} recommended because missing and required" + (f" for {role_name} role" if role_name else "")
                })
        
        # Sort by gap score (descending - most critical first)
        partial_skills.sort(key=lambda x: x['gap_score'], reverse=True)
        missing_skills.sort(key=lambda x: x['gap_score'], reverse=True)
        
        # Calculate statistics
        total_required = len(job_skills)
        total_known = len(known_skills)
        total_partial = len(partial_skills)
        total_missing = len(missing_skills)
        
        coverage_percentage = (total_known / total_required * 100) if total_required > 0 else 0
        
        return {
            'known_skills': known_skills,
            'partial_skills': partial_skills,
            'missing_skills': missing_skills,
            'statistics': {
                'total_required_skills': total_required,
                'known_count': total_known,
                'partial_count': total_partial,
                'missing_count': total_missing,
                'coverage_percentage': round(coverage_percentage, 2),
                'readiness_score': self._calculate_readiness_score(
                    total_known, total_partial, total_missing, total_required
                )
            }
        }
    
    def _calculate_gap_score(self, resume_skill: Dict, job_skill: Dict) -> float:
        """
        Calculate gap score between resume skill and job requirement.
        Negative/zero = enough, Positive = needs improvement
        """
        resume_level = resume_skill.get('level', 'Beginner')
        required_level = job_skill.get('level', 'Intermediate')
        
        resume_rank = self.LEVEL_HIERARCHY.get(resume_level, 1)
        required_rank = self.LEVEL_HIERARCHY.get(required_level, 2)
        
        return required_rank - resume_rank
    
    def _generate_gap_reason(self, resume_skill: Dict, job_skill: Dict, gap_score: float, role_name: Optional[str] = None) -> str:
        """Generate human-readable reason for gap."""
        resume_level = resume_skill.get('level', 'Beginner')
        required_level = job_skill.get('level', 'Intermediate')
        role_context = f" for {role_name} role" if role_name else ""
        
        if gap_score <= 0:
            return f"Already mastered at {resume_level} level"
        else:
            return f"{job_skill['name']} recommended because current level ({resume_level}) needs improvement to {required_level}{role_context}"
    
    def _calculate_readiness_score(self, known: int, partial: int, missing: int, total: int) -> float:
        """
        Calculate overall readiness score (0-100).
        """
        if total == 0:
            return 0
        
        # Weighted calculation
        score = (known / total * 100) + (partial / total * 50)
        return round(min(score, 100), 2)
    
    def prioritize_skills_to_learn(self, gap_analysis: Dict) -> List[Dict]:
        """
        Prioritize skills to learn based on:
        1. Gap score (critical gaps first)
        2. Prerequisites (dependencies)
        3. Category (related skills together)
        """
        all_gaps = gap_analysis['partial_skills'] + gap_analysis['missing_skills']
        
        # Sort by gap score (descending) then by number of prerequisites
        prioritized = sorted(
            all_gaps,
            key=lambda x: (-x['gap_score'], -len(x.get('prerequisites', [])))
        )
        
        return prioritized
    
    def generate_explainability_trace(self, skill_name: str, gap_analysis: Dict) -> Dict:
        """
        Generate detailed explanation for why a skill is recommended.
        """
        # Find skill in analysis
        skill = None
        status = None
        
        for skill_data in gap_analysis['known_skills']:
            if skill_data['name'].lower() == skill_name.lower():
                skill = skill_data
                status = SkillStatus.KNOWN
                break
        
        if not skill:
            for skill_data in gap_analysis['partial_skills']:
                if skill_data['name'].lower() == skill_name.lower():
                    skill = skill_data
                    status = SkillStatus.PARTIAL
                    break
        
        if not skill:
            for skill_data in gap_analysis['missing_skills']:
                if skill_data['name'].lower() == skill_name.lower():
                    skill = skill_data
                    status = SkillStatus.MISSING
                    break
        
        if not skill:
            return {'error': f'Skill {skill_name} not found in analysis'}
        
        return {
            'skill_name': skill['name'],
            'status': status,
            'category': skill['category'],
            'reason': skill['reason'],
            'gap_score': skill.get('gap_score', 0),
            'explanation_trace': self._build_explanation_trace(skill, status)
        }
    
    def _build_explanation_trace(self, skill: Dict, status: SkillStatus) -> List[str]:
        """Build step-by-step explanation."""
        trace = [f"Analyzing skill: {skill['name']}"]
        
        if status == SkillStatus.KNOWN:
            trace.append(f"✅ Status: YOU ALREADY HAVE THIS SKILL")
            trace.append(f"Your level: {skill.get('resume_level', 'Unknown')}")
            trace.append(f"Job requires: {skill.get('required_level', 'Intermediate')}")
            trace.append(f"✓ No action needed for this skill")
        
        elif status == SkillStatus.PARTIAL:
            trace.append(f"⚠️  Status: SKILL GAP EXISTS")
            trace.append(f"Your current level: {skill.get('resume_level', 'Beginner')}")
            trace.append(f"Job requirement: {skill.get('required_level', 'Intermediate')}")
            trace.append(f"Gap score: {skill.get('gap_score', 0)}/3")
            trace.append(f"→ Recommendation: Invest in improving this skill")
        
        elif status == SkillStatus.MISSING:
            trace.append(f"❌ Status: SKILL COMPLETELY MISSING")
            trace.append(f"Job requires: {skill.get('required_level', 'Intermediate')}")
            prereqs = skill.get('prerequisites', [])
            if prereqs:
                trace.append(f"Prerequisites: {', '.join(prereqs)}")
            trace.append(f"→ Recommendation: PRIORITY - Learn this skill from scratch")
        
        return trace
