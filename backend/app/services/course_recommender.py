"""
Course Recommendation Engine.

Maps skills to real, curated courses from course_dataset.json.
No hallucination — all courses are dataset-based.

Recommendation strategy per skill:
1. Return all matching courses sorted by:
   - Level match to required_level first
   - Free courses preferred at equal relevance
   - Video > interactive > article for engagement
2. Fall back to a generic "search" stub if skill not in dataset.
"""

import json
import logging
from pathlib import Path
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)

# Level priority for sorting (closer to required level = better)
LEVEL_ORDER = {"Beginner": 1, "Intermediate": 2, "Advanced": 3}

# Type preference for sorting
TYPE_PREFERENCE = {"interactive": 1, "video": 2, "article": 3}


class CourseRecommender:
    """
    Recommends real learning courses for a given skill from the dataset.
    Strictly dataset-based — no AI generation of course names or URLs.
    """

    def __init__(self, dataset_path: str = None):
        if dataset_path is None:
            dataset_path = Path(__file__).parent.parent / "datasets" / "course_dataset.json"
        else:
            dataset_path = Path(dataset_path)

        with open(dataset_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.courses: Dict[str, List[Dict]] = data.get("courses", {})
        # Build lowercase index for case-insensitive lookup
        self._index: Dict[str, str] = {k.lower(): k for k in self.courses}
        logger.info(
            f"CourseRecommender loaded {len(self.courses)} skill mappings "
            f"from {dataset_path.name}"
        )

    # ------------------------------------------------------------------ #
    # Public API                                                           #
    # ------------------------------------------------------------------ #

    def recommend(
        self,
        skill_name: str,
        required_level: str = "Intermediate",
        max_results: int = 3,
        prefer_free: bool = False,
    ) -> List[Dict]:
        """
        Return ranked course recommendations for a skill.

        Args:
            skill_name:     Name of the skill (case-insensitive lookup).
            required_level: "Beginner" | "Intermediate" | "Advanced".
            max_results:    Maximum number of courses to return.
            prefer_free:    If True, free courses always rank first.

        Returns:
            List of course dicts with added 'relevance_score' field.
            Returns empty list (not stubs) if skill not in dataset.
        """
        canonical = self._index.get(skill_name.lower())
        if canonical is None:
            logger.debug(f"No courses found for skill '{skill_name}' in dataset.")
            return []

        raw_courses = self.courses[canonical]
        scored = [
            {**c, "relevance_score": self._score(c, required_level, prefer_free)}
            for c in raw_courses
        ]
        scored.sort(key=lambda x: -x["relevance_score"])
        return scored[:max_results]

    def recommend_batch(
        self,
        skills: List[Dict],
        max_per_skill: int = 3,
        prefer_free: bool = False,
    ) -> Dict[str, List[Dict]]:
        """
        Recommend courses for a list of skill dicts.

        Args:
            skills:        List of skill dicts (must have 'name' and 'required_level').
            max_per_skill: Max courses to return per skill.
            prefer_free:   Prefer free courses.

        Returns:
            Dict mapping skill_name → list of recommended courses.
        """
        results = {}
        for skill in skills:
            name = skill.get("name", "")
            level = skill.get("required_level", skill.get("level", "Intermediate"))
            recommendations = self.recommend(name, level, max_per_skill, prefer_free)
            if recommendations:
                results[name] = recommendations
        return results

    def get_all_skills_with_courses(self) -> List[str]:
        """Return list of all skills that have course mappings."""
        return list(self.courses.keys())

    def enrich_modules(
        self,
        modules: List[Dict],
        max_per_skill: int = 3,
        prefer_free: bool = False,
    ) -> List[Dict]:
        """
        Enrich learning path modules with course recommendations in-place.

        Replaces the default generic 'resources' list with real, curated courses.
        If no courses are found for a skill, the original resources list is kept.

        Args:
            modules:       List of learning path module dicts.
            max_per_skill: Max courses per module.
            prefer_free:   Prefer free courses.

        Returns:
            Same list of modules, each enriched with 'recommended_courses' key.
        """
        for module in modules:
            skill_name = module.get("skill_name", "")
            level = module.get("level", "Intermediate")
            courses = self.recommend(skill_name, level, max_per_skill, prefer_free)

            module["recommended_courses"] = courses
            module["has_course_data"] = len(courses) > 0

            # If we found real courses, also update the 'resources' field
            # so existing API consumers still get useful data
            if courses:
                module["resources"] = [
                    {
                        "title": c["course"],
                        "platform": c["platform"],
                        "url": c["url"],
                        "duration": c["duration"],
                        "type": c.get("type", "video"),
                        "free": c.get("free", True),
                    }
                    for c in courses
                ]
        return modules

    # ------------------------------------------------------------------ #
    # Private — scoring                                                    #
    # ------------------------------------------------------------------ #

    def _score(self, course: Dict, required_level: str, prefer_free: bool) -> float:
        """
        Compute a relevance score for a course given target skill level.

        Scoring:
          - Level match: +3 if exact, +1 if adjacent, 0 if 2 levels away
          - Free bonus: +1.5 if prefer_free and course is free
          - Type preference: interactive=3, video=2, article=1
        """
        score = 0.0

        # Level match
        course_lvl = LEVEL_ORDER.get(course.get("level", "Intermediate"), 2)
        req_lvl = LEVEL_ORDER.get(required_level, 2)
        diff = abs(course_lvl - req_lvl)
        if diff == 0:
            score += 3.0
        elif diff == 1:
            score += 1.5
        else:
            score += 0.0

        # Free bonus
        if prefer_free and course.get("free", False):
            score += 1.5
        elif course.get("free", False):
            score += 0.5  # small boost even without explicit preference

        # Type preference
        score += TYPE_PREFERENCE.get(course.get("type", "article"), 1) * 0.3

        return score
