from typing import Dict, Any

class LearningEfficiencyCalculator:
    """
    Measures learning performance using metrics:
    - Quiz scores
    - Time taken
    - Completion rate
    """
    def calculate(self, engagement_metrics: Dict[str, Any]) -> Dict[str, int]:
        if not engagement_metrics:
            return {"efficiency_score": 0}
            
        quiz_scores = engagement_metrics.get("quiz_scores", [])
        avg_quiz = sum(quiz_scores) / len(quiz_scores) if quiz_scores else 50
        
        completed = engagement_metrics.get("completed_count", 0)
        total = engagement_metrics.get("total_assigned", 1)
        completion_rate = (completed / total * 100) if total > 0 else 0
        
        hours_spent = engagement_metrics.get("hours_spent_this_week", 0)
        
        # Base efficiency: 40% quiz, 60% completion
        efficiency = (avg_quiz * 0.4) + (completion_rate * 0.6)
        
        # Time factor
        expected_hours_per_module = 2
        expected_total_hours = completed * expected_hours_per_module
        
        if hours_spent > 0 and expected_total_hours > 0:
            time_ratio = expected_total_hours / hours_spent
            time_ratio = max(0.5, min(1.5, time_ratio)) # Cap between 0.5x and 1.5x
            efficiency = efficiency * time_ratio
            
        final_score = min(100, max(0, int(efficiency)))
        
        # Give a neutral starting score if no progress yet but system is initialized
        if final_score == 0 and completed == 0 and not quiz_scores:
            final_score = 50
            
        return {"efficiency_score": final_score}
