class CareerPredictor:
    def __init__(self):
        self.market_data = {
            "Software Developer": {"salary_range": "$80k - $120k", "growth": "+15%"},
            "Data Scientist": {"salary_range": "$95k - $140k", "growth": "+22%"},
            "DevOps Engineer": {"salary_range": "$100k - $150k", "growth": "+18%"},
            "AI Engineer": {"salary_range": "$110k - $180k", "growth": "+35%"}
        }

    def predict_trajectory(self, completed_roadmap_data, target_role):
        """
        Predict the user's career trajectory based on their progress and market trends.
        """
        # Mock calculation based on role and skills
        market_stats = self.market_data.get(target_role, {"salary_range": "$70k - $100k", "growth": "+10%"})
        
        # Readiness score based on completed modules
        modules = completed_roadmap_data.get('modules', [])
        completed_count = sum(1 for m in modules if m.get('is_completed'))
        total_count = len(modules) if modules else 1
        readiness_score = int((completed_count / total_count) * 100)
        
        return {
            "target_role": target_role,
            "market_outlook": market_stats,
            "readiness_score": readiness_score,
            "estimated_time_to_hire": "2 - 4 months" if readiness_score < 80 else "Ready Now",
            "next_steps": [
                "Complete the remaining specialized modules",
                "Build a capstone project to demonstrate mastery",
                "Apply for Senior Level roles after 3 more modules"
            ]
        }
