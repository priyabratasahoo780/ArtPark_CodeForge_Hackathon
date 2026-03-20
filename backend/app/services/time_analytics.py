"""
Time Saved Analytics Service.

Computes a clear, explainable comparison between:
  - Traditional learning (one-size-fits-all, no personalisation)
  - Adaptive learning (this engine: gap-filtered, dependency-ordered, role-aware)

Traditional model assumptions (industry benchmarks):
  - Average learner studies every required skill from scratch (ignores prior knowledge)
  - ~8 hours/skill at Beginner, 20 hours at Intermediate, 40 hours at Advanced
  - Linear sequence with no prerequisite optimisation
  - Industry average: 5 hours/week (same as this engine)

Adaptive model:
  - Only studies GAP skills (known skills are skipped)
  - Actual hours come from the generated learning_path
  - Prerequisite deduplication avoids re-learning shared foundations
"""

import math
import logging
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)

# Traditional hours per skill level (no personalisation baseline)
TRADITIONAL_HOURS = {
    "Beginner": 8,
    "Intermediate": 20,
    "Advanced": 40,
}

# Hours studied per week (used to convert hours → weeks → days)
HOURS_PER_WEEK = 5
HOURS_PER_DAY = 2  # Assume 2 hrs/day studying


class TimeAnalytics:
    """
    Computes time-saved metrics comparing traditional vs. adaptive learning.
    """

    def calculate(
        self,
        gap_analysis: Dict,
        learning_path: Dict,
        resume_skills: Optional[List[Dict]] = None,
    ) -> Dict:
        """
        Calculate time-saved analytics.

        Args:
            gap_analysis:   Full gap_analysis dict from gap_analyzer.
            learning_path:  Full learning_path dict from learning_path_generator.
            resume_skills:  Optional list of resume skills (for context).

        Returns:
            {
                "traditional_hours":  float,
                "traditional_days":   int,
                "traditional_weeks":  int,
                "optimized_hours":    float,
                "optimized_days":     int,
                "optimized_weeks":    int,
                "hours_saved":        float,
                "days_saved":         int,
                "time_saved_percent": float,   # 0–100
                "time_saved_label":   str,     # "60%"
                "efficiency_gain":    str,     # "2.5x faster"
                "known_skills_skipped": int,
                "prerequisites_deduped": int,
                "breakdown": { ... }
            }
        """
        stats = gap_analysis.get("statistics", {})
        total_required = stats.get("total_required_skills", 0)
        known_count = stats.get("known_count", 0)
        missing_count = stats.get("missing_count", 0)
        partial_count = stats.get("partial_count", 0)

        # ---- Traditional learning ----
        # Assumes learner must study ALL required skills from scratch
        required_skills = (
            gap_analysis.get("known_skills", [])
            + gap_analysis.get("partial_skills", [])
            + gap_analysis.get("missing_skills", [])
        )

        traditional_hours = 0.0
        for skill in required_skills:
            level = skill.get("required_level", skill.get("level", "Intermediate"))
            traditional_hours += TRADITIONAL_HOURS.get(level, 20)

        # Add overhead: 20% for unstructured searching, re-learning, context switching
        overhead_factor = 1.20
        traditional_hours_total = traditional_hours * overhead_factor

        # ---- Adaptive (optimised) learning ----
        # Actual hours from the generated learning path
        optimized_hours = float(learning_path.get("total_duration_hours", 0))

        # Prerequisites deduped: auto-injected prereqs that would otherwise be
        # re-learned multiple times in a traditional path
        modules = learning_path.get("modules", [])
        injected_prereq_modules = [m for m in modules if m.get("is_injected_prerequisite", False)]
        prerequisites_deduped = len(injected_prereq_modules)

        # ---- Derived metrics ----
        hours_saved = max(0.0, traditional_hours_total - optimized_hours)
        time_saved_percent = (
            (hours_saved / traditional_hours_total * 100)
            if traditional_hours_total > 0
            else 0.0
        )

        efficiency_multiplier = (
            traditional_hours_total / optimized_hours
            if optimized_hours > 0
            else 1.0
        )

        traditional_days = math.ceil(traditional_hours_total / HOURS_PER_DAY)
        optimized_days = math.ceil(optimized_hours / HOURS_PER_DAY)
        days_saved = max(0, traditional_days - optimized_days)

        traditional_weeks = math.ceil(traditional_hours_total / HOURS_PER_WEEK)
        optimized_weeks = math.ceil(optimized_hours / HOURS_PER_WEEK)

        # ---- Breakdown by component ----
        known_hours_skipped = 0.0
        for skill in gap_analysis.get("known_skills", []):
            level = skill.get("required_level", skill.get("level", "Intermediate"))
            known_hours_skipped += TRADITIONAL_HOURS.get(level, 20) * overhead_factor

        overhead_hours_saved = traditional_hours * (overhead_factor - 1.0)
        prereq_dedup_saving = sum(
            m.get("time_estimate_hours", 0) for m in injected_prereq_modules
        ) * 0.5  # Prereqs shared across multiple skills in traditional path

        breakdown = {
            "known_skills_hours_skipped": round(known_hours_skipped, 1),
            "overhead_hours_eliminated": round(overhead_hours_saved, 1),
            "prerequisite_dedup_saving_hours": round(prereq_dedup_saving, 1),
            "total_traditional_overhead_hours": round(
                traditional_hours * (overhead_factor - 1.0), 1
            ),
            "modules_in_adaptive_path": len(modules),
            "modules_skipped_as_known": known_count,
        }

        return {
            "traditional_hours": round(traditional_hours_total, 1),
            "traditional_days": traditional_days,
            "traditional_weeks": traditional_weeks,
            "optimized_hours": round(optimized_hours, 1),
            "optimized_days": optimized_days,
            "optimized_weeks": optimized_weeks,
            "hours_saved": round(hours_saved, 1),
            "days_saved": days_saved,
            "weeks_saved": max(0, traditional_weeks - optimized_weeks),
            "time_saved_percent": round(time_saved_percent, 1),
            "time_saved_label": f"{round(time_saved_percent)}%",
            "efficiency_gain": f"{efficiency_multiplier:.1f}x faster",
            "known_skills_skipped": known_count,
            "prerequisites_deduped": prerequisites_deduped,
            "hours_per_week_assumed": HOURS_PER_WEEK,
            "hours_per_day_assumed": HOURS_PER_DAY,
            "breakdown": breakdown,
            "assumptions": {
                "traditional_model": (
                    "All required skills studied from scratch with 20% overhead "
                    "for unstructured searching and context switching."
                ),
                "adaptive_model": (
                    "Only gap skills are studied. Actual module hours from "
                    "dependency-ordered, prerequisite-deduplicated roadmap."
                ),
            },
        }
