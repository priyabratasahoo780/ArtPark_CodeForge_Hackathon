import time
from typing import List, Dict

class DecayService:
    def __init__(self):
        # Time-based decay factor (Ebbinghaus approximation)
        # R = e^(-t/S) where S is stability
        self.DEFAULT_STABILITY = 7 * 24 * 3600  # 1 week in seconds

    def calculate_decay(self, mastered_skills: List[Dict]) -> List[Dict]:
        """
        mastered_skills example: [{"name": "React", "mastered_at": timestamp}]
        """
        now = time.time()
        results = []
        
        for skill in mastered_skills:
            t = float(now - skill.get("mastered_at", now))
            # Retention R
            retention = 100.0 * (2.718 ** (-t / float(self.DEFAULT_STABILITY)))
            
            status = "mastered"
            if retention < 50.0:
                status = "fading"
            if retention < 20.0:
                status = "forgotten"
                
            results.append({
                "name": skill["name"],
                "retention": round(float(retention), 1),
                "status": status,
                "days_since_mastery": round(float(t / (24.0 * 3600.0)), 1)
            })
            
        return results

    def get_neural_load_stats(self, daily_progress: List[int]) -> Dict:
        """
        daily_progress: [5, 10, 2, 0, 1] - number of skills mastered last 5 days
        """
        total_velocity = float(sum(daily_progress))
        avg_velocity = total_velocity / float(max(1, len(daily_progress)))
        
        # High velocity in short time = high load/burnout risk
        load_score = min(100.0, float(avg_velocity * 20.0))
        
        stability_index = max(0.0, 10.0 - (float(load_score) / 10.0))
        
        return {
            "load_score": round(float(load_score), 1),
            "efficiency": round(100.0 - (float(load_score) * 0.3), 1),
            "stability_index": round(float(stability_index), 1),
            "risk_level": "High" if load_score > 80.0 else ("Moderate" if load_score > 50.0 else "Optimal")
        }
