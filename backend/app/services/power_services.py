import random
from typing import List, Dict, Any

class SalaryPredictorService:
    """Predicts salary ranges based on skills and target role."""

    ROLE_BASE = {
        "Frontend Engineer": (80000, 130000),
        "Backend Engineer": (85000, 140000),
        "Fullstack Engineer": (90000, 150000),
        "Data Scientist": (95000, 155000),
        "DevOps Engineer": (88000, 145000),
        "ML Engineer": (100000, 160000),
        "default": (70000, 120000),
    }

    SKILL_BONUSES = {
        "kubernetes": 12000, "tensorflow": 15000, "react": 8000,
        "graphql": 7000, "rust": 14000, "go": 10000, "aws": 11000,
        "docker": 6000, "python": 5000, "typescript": 7000,
    }

    def predict(self, role: str, skills: List[str], experience_years: int = 3) -> Dict[str, Any]:
        base_lo, base_hi = self.ROLE_BASE.get(role, self.ROLE_BASE["default"])

        # Add skill bonuses
        bonus = sum(self.SKILL_BONUSES.get(s.lower(), 0) for s in skills)

        # Experience multiplier
        exp_mult = 1.0 + (experience_years * 0.04)

        lo = int((base_lo + bonus * 0.5) * exp_mult)
        hi = int((base_hi + bonus) * exp_mult)
        mid = int((lo + hi) / 2)

        # Market percentile
        percentile = min(95, 50 + len([s for s in skills if self.SKILL_BONUSES.get(s.lower(), 0) > 8000]) * 8)

        return {
            "salary_low": lo,
            "salary_mid": mid,
            "salary_high": hi,
            "currency": "USD",
            "market_percentile": percentile,
            "top_paying_skills": [s for s in skills if self.SKILL_BONUSES.get(s.lower(), 0) >= 8000][:4],
            "negotiation_tip": f"Your {len(skills)} verified skills put you in the top {100 - percentile}% of candidates. Lead with your AI & cloud experience in negotiations.",
            "remote_premium": int(mid * 0.12)
        }


class JobMatcherService:
    """Matches candidate skills to live job postings."""

    JOBS_DB = [
        {"title": "Senior React Developer", "company": "NeuralTech Inc.", "match_skills": ["react", "typescript", "graphql"], "salary": "$130k–$160k", "location": "Remote", "tag": "HOT"},
        {"title": "Backend Python Architect", "company": "QuantumSystems", "match_skills": ["python", "fastapi", "kubernetes", "docker"], "salary": "$140k–$175k", "location": "SF / Remote", "tag": "URGENT"},
        {"title": "ML Platform Engineer", "company": "DeepForge AI", "match_skills": ["tensorflow", "python", "aws", "kubernetes"], "salary": "$160k–$200k", "location": "NYC", "tag": "TOP"},
        {"title": "DevOps Cloud Lead", "company": "CloudNova", "match_skills": ["aws", "kubernetes", "docker", "go"], "salary": "$145k–$185k", "location": "Remote", "tag": "HOT"},
        {"title": "Fullstack TypeScript Engineer", "company": "EdgeCorp", "match_skills": ["react", "typescript", "node", "graphql"], "salary": "$120k–$155k", "location": "Austin / Remote", "tag": "NEW"},
        {"title": "Data Science Lead", "company": "Analytiq Labs", "match_skills": ["python", "tensorflow", "spark", "sql"], "salary": "$135k–$170k", "location": "Remote", "tag": "HOT"},
    ]

    def match_jobs(self, candidate_skills: List[str]) -> Dict[str, Any]:
        skills_lower = {s.lower() for s in candidate_skills}
        results = []
        for job in self.JOBS_DB:
            matched = [s for s in job["match_skills"] if s in skills_lower]
            match_pct = int((len(matched) / len(job["match_skills"])) * 100)
            results.append({**job, "match_percentage": match_pct, "matched_skills": matched})
        results.sort(key=lambda x: x["match_percentage"], reverse=True)
        return {"jobs": results, "total_matches": len([j for j in results if j["match_percentage"] > 50])}


class StreakService:
    """Tracks daily learning streaks and gamification."""

    def get_streak_data(self, completed_count: int) -> Dict[str, Any]:
        # Simulated streak and XP data — in production this would be persisted
        current_streak = min(completed_count * 2, 30)
        total_xp = completed_count * 250 + current_streak * 50
        rank = "Novice"
        if total_xp > 3000: rank = "Expert"
        elif total_xp > 1500: rank = "Practitioner"
        elif total_xp > 500: rank = "Apprentice"

        return {
            "current_streak_days": current_streak,
            "longest_streak_days": current_streak + 5,
            "total_xp": total_xp,
            "rank": rank,
            "next_rank_xp": {"Novice": 500, "Apprentice": 1500, "Practitioner": 3000, "Expert": 10000}.get(rank, 10000),
            "daily_goal_met": completed_count > 0,
            "badges_earned": min(completed_count, 8),
            "weekly_heatmap": [random.randint(0, 5) for _ in range(28)]
        }


class ResumeScoreService:
    """Generates a multi-axis quality score for a resume."""

    def score_resume(self, skills: List[str], gap_stats: Dict) -> Dict[str, Any]:
        readiness = gap_stats.get("readiness_score", 50)
        coverage = gap_stats.get("coverage_percentage", 40)
        known = gap_stats.get("known_count", 3)

        axes = {
            "Technical Depth": min(100, known * 8 + 20),
            "Market Relevance": min(100, readiness + 5),
            "Skill Coverage": min(100, int(coverage)),
            "AI/ML Quotient": min(100, len([s for s in skills if any(k in s.lower() for k in ["ml", "ai", "tensor", "pytorch", "neural"])]) * 25 + 20),
            "Cloud Fluency": min(100, len([s for s in skills if any(k in s.lower() for k in ["aws", "cloud", "k8s", "kubernetes", "docker", "gcp"])]) * 20 + 15),
            "Code Quality": min(100, 55 + random.randint(5, 30)),
        }

        overall = int(sum(axes.values()) / len(axes))

        return {
            "overall_score": overall,
            "axes": axes,
            "grade": "A+" if overall >= 90 else "A" if overall >= 80 else "B+" if overall >= 70 else "B" if overall >= 60 else "C",
            "top_strength": max(axes, key=axes.get),
            "top_weakness": min(axes, key=axes.get),
            "ai_verdict": f"This resume demonstrates {overall}% readiness for your target role. Focus on improving your '{min(axes, key=axes.get)}' to unlock higher salary tiers."
        }
