from typing import Dict, Any

class DoubtDetector:
    """
    Analyzes engagement metrics to determine if a user is struggling
    and needs AI assistance.
    """
    def detect(self, engagement_metrics: Dict[str, Any]) -> Dict[str, Any]:
        if not engagement_metrics:
            return {"help_triggered": False}
        
        quiz_scores = engagement_metrics.get("quiz_scores", [])
        days_inactive = engagement_metrics.get("days_inactive", 0)
        
        help_triggered = False
        reason = ""
        suggestion = ""
        
        # Check for repeated failures (e.g., last two scores under 60)
        recent_scores = quiz_scores[-2:] if len(quiz_scores) >= 2 else quiz_scores
        if len(recent_scores) >= 2 and all(score < 60 for score in recent_scores):
            help_triggered = True
            reason = "Repeated low quiz scores detected"
            suggestion = "It looks like you're struggling with this topic. Would you like the AI Tutor to explain it differently?"
            
        # Check for long inactivity
        elif days_inactive >= 3:
            help_triggered = True
            reason = "Long inactivity on current skill"
            suggestion = "You've been stuck here for a while. Let me break this down into smaller steps for you."
            
        return {
            "help_triggered": help_triggered,
            "suggestion": suggestion if help_triggered else None,
            "reason": reason if help_triggered else None
        }
