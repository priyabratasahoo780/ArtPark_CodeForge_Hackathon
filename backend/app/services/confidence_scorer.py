import re
from typing import Dict, List, Tuple
import logging

logger = logging.getLogger(__name__)


class ConfidenceScorer:
    """
    Assigns an explainable confidence score (0.0 – 1.0) to each extracted
    skill based on resume context signals.

    Scoring is fully rule-based and transparent — every score can be traced
    back to specific signals found in the resume text.

    Signal groups and their max contribution:
    ┌────────────────────────────┬──────────┐
    │ Signal                     │ Max pts  │
    ├────────────────────────────┼──────────┤
    │ Match type (exact / fuzzy) │  0.40    │
    │ Proficiency keywords       │  0.25    │
    │ Years of experience        │  0.20    │
    │ Project / usage mentions   │  0.10    │
    │ Section placement          │  0.05    │
    └────────────────────────────┴──────────┘
    """

    # ── Proficiency signal keywords ────────────────────────────────────────
    EXPERT_KEYWORDS = [
        "expert", "mastery", "master", "architect", "lead", "principal",
        "senior", "authority", "deep expertise", "extensive experience",
        "highly proficient", "specialist",
    ]
    PROFICIENT_KEYWORDS = [
        "proficient", "strong", "professional", "advanced knowledge",
        "solid", "production", "commercial", "hands-on", "experienced",
        "working knowledge", "skilled",
    ]
    FAMILIAR_KEYWORDS = [
        "familiar", "exposure", "basic", "learning", "beginner",
        "awareness", "introductory", "some experience", "exploring",
    ]

    # ── Year-of-experience patterns ────────────────────────────────────────
    # Matches things like "3 years", "3+ years", "2-4 years", "1 year"
    YEAR_PATTERN = re.compile(
        r"(\d+)\s*\+?\s*(?:to|-)\s*(\d+)\s+years?|(\d+)\s*\+\s*years?|(\d+)\s+years?",
        re.IGNORECASE,
    )

    # ── Project / usage signal patterns ───────────────────────────────────
    PROJECT_PATTERNS = [
        re.compile(p, re.IGNORECASE)
        for p in [
            r"\bbuilt\b", r"\bdeveloped\b", r"\bimplemented\b", r"\bdeployed\b",
            r"\bdesigned\b", r"\barchitected\b", r"\bmaintained\b", r"\bcreated\b",
            r"\bengineered\b", r"\bproduction\b", r"\bproject\b", r"\bsystem\b",
        ]
    ]

    # ── Section headers that imply primary skills ──────────────────────────
    PRIMARY_SECTION_HEADERS = [
        "skills", "technical skills", "core competencies",
        "expertise", "proficiencies", "key skills",
    ]

    # ── Context window around each skill mention (chars) ──────────────────
    CONTEXT_WINDOW = 200

    def __init__(self):
        pass

    # ------------------------------------------------------------------ #
    # Public API                                                           #
    # ------------------------------------------------------------------ #

    def score(
        self,
        skill_name: str,
        resume_text: str,
        match_type: str = "exact",  # "exact" | "fuzzy"
    ) -> Dict:
        """
        Compute a confidence score for a skill given the full resume text.

        Args:
            skill_name:   Name of the skill (e.g. "React").
            resume_text:  Full resume text.
            match_type:   How the skill was detected ("exact" or "fuzzy").

        Returns:
            {
                "confidence": float,       # 0.0 – 1.0
                "signals": List[str],      # Human-readable explanation
                "breakdown": Dict[str, float]  # Score per signal group
            }
        """
        context = self._extract_context(resume_text, skill_name)
        full_text_lower = resume_text.lower()

        breakdown: Dict[str, float] = {}
        signals: List[str] = []

        # 1. Base score from match type
        base = 0.40 if match_type == "exact" else 0.25
        breakdown["match_type"] = base
        signals.append(
            f"Exact name match in resume" if match_type == "exact"
            else "Inferred via acronym/alias match"
        )

        # 2. Proficiency keyword signal
        prof_score, prof_signal = self._score_proficiency_keywords(context)
        breakdown["proficiency_keywords"] = prof_score
        if prof_signal:
            signals.append(prof_signal)

        # 3. Years-of-experience signal
        yoe_score, yoe_signal = self._score_years_of_experience(context, full_text_lower, skill_name)
        breakdown["years_of_experience"] = yoe_score
        if yoe_signal:
            signals.append(yoe_signal)

        # 4. Project / usage mention signal
        proj_score, proj_signal = self._score_project_mentions(context)
        breakdown["project_mentions"] = proj_score
        if proj_signal:
            signals.append(proj_signal)

        # 5. Section-placement signal
        sec_score, sec_signal = self._score_section_placement(resume_text, skill_name)
        breakdown["section_placement"] = sec_score
        if sec_signal:
            signals.append(sec_signal)

        total = min(round(sum(breakdown.values()), 3), 1.0)

        return {
            "confidence": total,
            "signals": signals,
            "breakdown": breakdown,
        }

    def score_batch(
        self,
        skills: List[Dict],
        resume_text: str,
    ) -> List[Dict]:
        """
        Score a list of skill dicts in-place, enriching each with
        confidence, signals, and breakdown fields.

        Args:
            skills:       List of skill dicts (must have 'name' key).
            resume_text:  Full resume text.

        Returns:
            Same list, each dict enriched with confidence scoring fields.
        """
        for skill in skills:
            match_type = skill.get("_match_type", "exact")
            result = self.score(skill["name"], resume_text, match_type)
            skill["confidence"] = result["confidence"]
            skill["confidence_signals"] = result["signals"]
            skill["confidence_breakdown"] = result["breakdown"]
            # Remove internal sentinel key
            skill.pop("_match_type", None)
        return skills

    # ------------------------------------------------------------------ #
    # Private signal scorers                                               #
    # ------------------------------------------------------------------ #

    def _score_proficiency_keywords(self, context: str) -> Tuple[float, str]:
        """Score based on proficiency-indicating keywords near the skill."""
        ctx_lower = context.lower()

        for kw in self.EXPERT_KEYWORDS:
            if kw in ctx_lower:
                return 0.25, f"Expert-level keyword detected: '{kw}'"

        for kw in self.PROFICIENT_KEYWORDS:
            if kw in ctx_lower:
                return 0.18, f"Proficiency keyword detected: '{kw}'"

        for kw in self.FAMILIAR_KEYWORDS:
            if kw in ctx_lower:
                return 0.05, f"Familiarity keyword detected: '{kw}' (lower confidence)"

        return 0.10, ""  # Neutral — skill mentioned but no explicit qualifier

    def _score_years_of_experience(
        self, context: str, full_text: str, skill_name: str
    ) -> Tuple[float, str]:
        """Score based on years of experience mentioned near the skill."""
        # Search in context first, then fall-back to a broader window
        for search_text in (context, full_text):
            match = self.YEAR_PATTERN.search(search_text)
            if match:
                # Extract largest number found
                nums = [int(g) for g in match.groups() if g is not None]
                years = max(nums) if nums else 0

                if years >= 5:
                    return 0.20, f"{years}+ years of experience mentioned"
                elif years >= 3:
                    return 0.15, f"{years} years of experience mentioned"
                elif years >= 1:
                    return 0.08, f"{years} year(s) of experience mentioned"

        return 0.0, ""

    def _score_project_mentions(self, context: str) -> Tuple[float, str]:
        """Score based on active project/usage verbs near the skill."""
        matched = [
            p.pattern.replace(r"\b", "").replace("\\b", "")
            for p in self.PROJECT_PATTERNS
            if p.search(context)
        ]
        if len(matched) >= 3:
            return 0.10, f"Multiple usage signals: {', '.join(matched[:3])}"
        elif matched:
            return 0.06, f"Usage signal: '{matched[0]}'"
        return 0.0, ""

    def _score_section_placement(self, resume_text: str, skill_name: str) -> Tuple[float, str]:
        """
        Score +0.05 if the skill appears under a primary skills section header.
        """
        lines = resume_text.lower().splitlines()
        skill_lower = skill_name.lower()
        in_skills_section = False

        for line in lines:
            stripped = line.strip()
            # Detect section headers
            if any(header in stripped for header in self.PRIMARY_SECTION_HEADERS):
                in_skills_section = True
                continue
            # Detect section end (new uppercase/title header)
            if stripped and stripped[0].isupper() and len(stripped.split()) <= 4 and in_skills_section:
                if skill_lower not in stripped:
                    in_skills_section = False

            if in_skills_section and skill_lower in stripped:
                return 0.05, "Skill listed under a dedicated Skills section"

        return 0.0, ""

    # ------------------------------------------------------------------ #
    # Helper                                                               #
    # ------------------------------------------------------------------ #

    def _extract_context(self, text: str, skill_name: str) -> str:
        """Extract text window around first mention of the skill."""
        pattern = re.compile(r"\b" + re.escape(skill_name) + r"\b", re.IGNORECASE)
        match = pattern.search(text)
        if match:
            start = max(0, match.start() - self.CONTEXT_WINDOW)
            end = min(len(text), match.end() + self.CONTEXT_WINDOW)
            return text[start:end]
        return text[:self.CONTEXT_WINDOW]  # fallback: beginning of resume
