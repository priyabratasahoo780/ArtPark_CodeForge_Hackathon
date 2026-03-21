import random
from typing import Dict, List

class BenchmarkingService:
    def __init__(self):
        # Mock global data
        self.global_averages = {
            "Frontend Developer": {"readiness": 65, "velocity": 8.5},
            "Backend Developer": {"readiness": 60, "velocity": 7.2},
            "Fullstack Developer": {"readiness": 55, "velocity": 6.8},
            "AI Engineer": {"readiness": 45, "velocity": 5.5}
        }

    def get_market_rank(self, user_role: str, user_readiness: float) -> Dict:
        benchmark = self.global_averages.get(user_role, {"readiness": 50, "velocity": 6.0})
        
        # Calculate percentile (mock logic)
        diff = float(user_readiness - benchmark["readiness"])
        percentile = 50.0 + (diff * 2.0)
        percentile = max(1.0, min(99.0, float(percentile)))
        
        return {
            "role": user_role,
            "market_avg_readiness": benchmark["readiness"],
            "user_percentile": round(float(percentile), 1),
            "status": "Elite" if percentile > 90.0 else ("Competitive" if percentile > 60.0 else "Rising Star"),
            "market_demand": random.choice(["Very High", "High", "Steady"])
        }
