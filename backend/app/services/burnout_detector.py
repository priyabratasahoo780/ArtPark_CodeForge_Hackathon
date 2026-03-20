from typing import Dict, Any

class BurnoutDetector:
    """
    Analyzes user engagement metrics to detect burnout or fatigue.
    Signals:
    - Low quiz scores
    - Reduced activity
    - Long inactivity gaps
    """
    
    def detect(self, metrics: Dict[str, Any]) -> Dict[str, Any]:
        if not metrics:
            return {"burnout": False, "suggestion": None}
            
        is_burnout = False
        reasons = []
        
        # 1. Low quiz scores
        scores = metrics.get("recent_quiz_scores", [])
        if scores and (sum(scores) / len(scores)) < 60:
            is_burnout = True
            reasons.append("Low quiz scores")
            
        # 2. Reduced activity
        modules_today = metrics.get("modules_completed_today", None)
        if modules_today is not None and modules_today == 0:
            # If they are requesting progress update but haven't completed anything
            is_burnout = True
            reasons.append("Reduced activity")
            
        # 3. Long inactivity gaps
        last_active = metrics.get("last_active_days", 0)
        if last_active > 3:
            is_burnout = True
            reasons.append("Long inactivity gaps")
            
        # Overrides for testing/demo
        if metrics.get("force_burnout") is True:
            is_burnout = True
            reasons.append("Simulated burnout")
            
        if is_burnout:
            return {
                "burnout": True,
                "suggestion": "Take a break or switch topic",
                "reasons": reasons
            }
            
        return {
            "burnout": False,
            "suggestion": None,
            "reasons": []
        }
