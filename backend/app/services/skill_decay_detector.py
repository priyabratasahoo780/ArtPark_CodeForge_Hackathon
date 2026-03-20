from typing import Dict, List, Any

class SkillDecayDetector:
    """
    Simulates skill attrition over time.
    Calculates confidence decay for competencies not utilized recently.
    """
    def detect(self, known_skills: List[Dict], engagement_metrics: Dict[str, Any]) -> List[Dict]:
        if not known_skills:
            return []
            
        force_decay = engagement_metrics.get("force_decay", False) if engagement_metrics else False
        
        decayed_skills = []
        
        # If force_decay is active, arbitrarily decay the first 1-2 known skills
        if force_decay:
            # Pick up to 2 skills to decay
            skills_to_decay = known_skills[:2]
            
            for i, skill in enumerate(skills_to_decay):
                days_ago = 90 + (i * 60) # 90 days, 150 days
                original_level = skill.get("level", "Intermediate")
                
                decayed_skills.append({
                    "skill": skill.get("name", "Unknown Skill"),
                    "last_used_days": days_ago,
                    "previous_level": original_level,
                    "status": "Needs Refresh" if days_ago > 120 else "Review Recommended",
                    "suggestion": "We recommend a quick refresher module to restore neural readiness."
                })
                
        return decayed_skills
