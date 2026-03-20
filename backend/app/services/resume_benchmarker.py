"""
Resume Benchmarker Service — Feature 8.

Accepts multiple candidate resumes + a single job description and produces
a ranked leaderboard with composite scores.

Ranking formula (composite 0-100):
  - Skill coverage (known / total required)    -> 40% weight
  - Readiness score (from gap_analyzer)        -> 35% weight
  - Confidence (avg confidence of known skills)-> 15% weight
  - Depth bonus (advanced skills in resume)    -> 10% weight

Each candidate also receives:
  - Per-skill match breakdown (known / partial / missing)
  - Gap score  (weighted sum of missing + partial penalties)
  - Competitive percentile within this batch
"""

import logging
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)


class ResumeBenchmarker:
    """
    Computes and ranks multiple candidates against a single job description.
    """

    # Composite score weights (must sum to 1.0)
    WEIGHTS = {
        "coverage": 0.40,
        "readiness": 0.35,
        "confidence": 0.15,
        "depth":      0.10,
    }

    def __init__(self, skill_extractor, gap_analyzer, role_matcher=None):
        self.skill_extractor = skill_extractor
        self.gap_analyzer    = gap_analyzer
        self.role_matcher    = role_matcher

    # ------------------------------------------------------------------ #
    # Public API                                                           #
    # ------------------------------------------------------------------ #

    def benchmark(
        self,
        candidates: List[Dict],          # [{"name": str, "resume_text": str}]
        job_description_text: str,
        max_candidates: int = 20,        # safety cap
    ) -> Dict:
        """
        Score and rank all candidates.

        Returns:
            {
                "ranked_candidates": [...],   # sorted best→worst
                "summary": {...},
                "job_description_skills": [...],
            }
        """
        if not candidates:
            return {"ranked_candidates": [], "summary": {}, "job_description_skills": []}
        if len(candidates) > max_candidates:
            candidates = candidates[:max_candidates]

        # Extract JD skills once (shared across all candidates)
        jd_result = self.skill_extractor.extract_from_job_description(job_description_text)
        required_skills = list(jd_result.get("required_skills", []))
        nice_to_have    = list(jd_result.get("nice_to_have_skills", []))

        # Optional: enrich with role skills
        effective_required = required_skills
        matched_role = None
        if self.role_matcher:
            try:
                role_match = self.role_matcher.match_role(job_description_text)
                hybrid     = self.role_matcher.hybrid_skill_set(
                    jd_skills=required_skills,
                    jd_text=job_description_text,
                    match_result=role_match,
                )
                effective_required = hybrid["skills"]
                matched_role = {
                    "role": role_match["role"],
                    "confidence": role_match["confidence"],
                }
            except Exception as e:
                logger.warning(f"Role matching skipped: {e}")

        # Score every candidate
        scored = []
        for candidate in candidates:
            name        = candidate.get("name", "Candidate").strip() or "Candidate"
            resume_text = candidate.get("resume_text", "")
            if not resume_text or len(resume_text.strip()) < 10:
                scored.append(self._empty_candidate(name, "Resume text too short"))
                continue
            try:
                entry = self._score_candidate(
                    name, resume_text, effective_required, nice_to_have
                )
                scored.append(entry)
            except Exception as e:
                logger.error(f"Error scoring '{name}': {e}")
                scored.append(self._empty_candidate(name, str(e)))

        # Sort by composite score descending, then by coverage as tiebreaker
        scored.sort(
            key=lambda c: (c["composite_score"], c["skill_match_pct"]),
            reverse=True,
        )

        # Assign rank + percentile
        total = len(scored)
        for i, c in enumerate(scored):
            c["rank"] = i + 1
            c["percentile"] = round(100 - (i / total * 100), 1) if total > 1 else 100.0

        # Summary stats
        valid   = [c for c in scored if not c.get("error")]
        summary = self._build_summary(valid, effective_required, matched_role)

        return {
            "ranked_candidates": scored,
            "summary": summary,
            "job_description_skills": effective_required,
            "nice_to_have_skills": nice_to_have,
        }

    # ------------------------------------------------------------------ #
    # Private helpers                                                      #
    # ------------------------------------------------------------------ #

    def _score_candidate(
        self,
        name: str,
        resume_text: str,
        required_skills: List,
        nice_to_have: List,
    ) -> Dict:
        """Extract skills and compute composite score for one candidate."""
        resume_result = self.skill_extractor.extract_from_resume(resume_text)
        resume_skills = resume_result.get("skills", [])

        # Ensure each skill has level
        for s in resume_skills:
            s.setdefault("level", "Intermediate")

        # Gap analysis
        gap = self.gap_analyzer.analyze_gaps(resume_skills, required_skills)
        stats = gap.get("statistics", {})

        total_required = stats.get("total_required_skills", 1) or 1
        known_count    = stats.get("known_count", 0)
        partial_count  = stats.get("partial_count", 0)
        missing_count  = stats.get("missing_count", 0)
        coverage_pct   = stats.get("coverage_percentage", 0.0)
        readiness      = stats.get("readiness_score", 0.0)

        # Confidence: avg across known skills (falls back to 0.5)
        known_skills  = gap.get("known_skills", [])
        confidences   = [s.get("confidence", 0.5) for s in known_skills]
        avg_confidence = (sum(confidences) / len(confidences)) if confidences else 0.0

        # Depth bonus: % of resume skills at Advanced level
        advanced_count = sum(
            1 for s in resume_skills if s.get("level", "") == "Advanced"
        )
        depth_pct = (advanced_count / len(resume_skills) * 100) if resume_skills else 0.0

        # Gap score: lower is better (0 = perfect match)
        # Partial = 0.5 penalty per skill, Missing = 1.0 penalty per skill
        gap_score = (partial_count * 0.5 + missing_count * 1.0)

        # Composite score 0-100
        composite = (
            (coverage_pct  / 100) * self.WEIGHTS["coverage"]  * 100
            + (readiness   / 100) * self.WEIGHTS["readiness"] * 100
            + avg_confidence      * self.WEIGHTS["confidence"] * 100
            + (depth_pct   / 100) * self.WEIGHTS["depth"]     * 100
        )

        # Nice-to-have bonus (up to +3 pts)
        n2h_names   = {s.lower() if isinstance(s, str) else s.get("name", "").lower() for s in nice_to_have}
        resume_names = {s["name"].lower() for s in resume_skills}
        bonus = min(len(n2h_names & resume_names) / max(len(n2h_names), 1) * 3, 3)
        composite = min(composite + bonus, 100)

        # Determine recommendation tier
        if composite >= 75:
            recommendation = "Strong Fit 🟢"
        elif composite >= 55:
            recommendation = "Potential Fit 🟡"
        elif composite >= 35:
            recommendation = "Moderate Gap 🟠"
        else:
            recommendation = "Significant Gap 🔴"

        return {
            "name": name,
            "rank": 0,                       # filled in after sorting
            "percentile": 0.0,
            "composite_score": round(composite, 1),
            "skill_match_pct": round(coverage_pct, 1),
            "readiness_score": round(readiness, 1),
            "gap_score": round(gap_score, 2),
            "avg_confidence": round(avg_confidence, 2),
            "depth_pct": round(depth_pct, 1),
            "recommendation": recommendation,
            "known_count": known_count,
            "partial_count": partial_count,
            "missing_count": missing_count,
            "total_required": total_required,
            "total_resume_skills": len(resume_skills),
            "known_skills": [s["name"] for s in known_skills],
            "partial_skills": [s["name"] for s in gap.get("partial_skills", [])],
            "missing_skills": [s["name"] for s in gap.get("missing_skills", [])],
            "nice_to_have_bonus": round(bonus, 2),
            "error": None,
        }

    def _empty_candidate(self, name: str, error: str) -> Dict:
        return {
            "name": name, "rank": 0, "percentile": 0.0,
            "composite_score": 0.0, "skill_match_pct": 0.0,
            "readiness_score": 0.0, "gap_score": 99.0,
            "avg_confidence": 0.0, "depth_pct": 0.0,
            "recommendation": "Error ❌",
            "known_count": 0, "partial_count": 0, "missing_count": 0,
            "total_required": 0, "total_resume_skills": 0,
            "known_skills": [], "partial_skills": [], "missing_skills": [],
            "nice_to_have_bonus": 0.0, "error": error,
        }

    def _build_summary(self, valid: List[Dict], required_skills: List, matched_role) -> Dict:
        if not valid:
            return {"total_candidates": 0}
        scores = [c["composite_score"] for c in valid]
        return {
            "total_candidates": len(valid),
            "top_candidate": valid[0]["name"] if valid else None,
            "top_score": valid[0]["composite_score"] if valid else 0,
            "avg_composite_score": round(sum(scores) / len(scores), 1),
            "min_score": round(min(scores), 1),
            "max_score": round(max(scores), 1),
            "strong_fits": sum(1 for c in valid if c["composite_score"] >= 75),
            "potential_fits": sum(1 for c in valid if 55 <= c["composite_score"] < 75),
            "significant_gaps": sum(1 for c in valid if c["composite_score"] < 35),
            "total_required_skills": len(required_skills),
            "matched_role": matched_role,
        }
