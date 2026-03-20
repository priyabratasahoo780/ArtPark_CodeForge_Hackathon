"""
Role-Based Learning Track Matcher.

Strategy (hybrid — confidence-gated):
1. Keyword matching against role keywords for a fast score.
2. TF-IDF cosine similarity between JD text and role descriptions for
   a semantic score (no heavy model needed at startup).
3. Weighted average of both scores → match confidence.
4. If best-match confidence ≥ ROLE_CONFIDENCE_THRESHOLD:
       use role skills MERGED with JD skills (hybrid)
   Else:
       fall back entirely to JD-extracted skills (JD wins).
"""

import json
import re
import math
import logging
from typing import Dict, List, Tuple, Optional
from pathlib import Path
from collections import Counter

logger = logging.getLogger(__name__)

# How confident we must be before applying role-based skills
ROLE_CONFIDENCE_THRESHOLD = 0.30  # 0.0 – 1.0


class RoleMatcher:
    """
    Matches a job description to the closest predefined role and
    enriches the skill set using a hybrid JD + role approach.
    """

    def __init__(self, roles_path: str = None):
        if roles_path is None:
            roles_path = Path(__file__).parent.parent / "datasets" / "roles.json"
        else:
            roles_path = Path(roles_path)

        with open(roles_path, "r") as f:
            data = json.load(f)

        self.roles: Dict[str, Dict] = data.get("roles", {})
        logger.info(f"RoleMatcher loaded {len(self.roles)} roles from {roles_path.name}")

        # Pre-compute TF-IDF vectors for all role descriptions + keywords
        self._role_vectors: Dict[str, Dict[str, float]] = {
            name: self._tfidf_vector(self._role_corpus(meta))
            for name, meta in self.roles.items()
        }

    # ------------------------------------------------------------------ #
    # Public API                                                           #
    # ------------------------------------------------------------------ #

    def match_role(self, jd_text: str) -> Dict:
        """
        Match a job description to the closest role.

        Returns:
            {
                "role": str,
                "confidence": float,
                "keyword_score": float,
                "semantic_score": float,
                "is_confident": bool,
                "all_scores": {role_name: score, ...}
            }
        """
        scores = self._score_all_roles(jd_text)
        best_role, best_score = max(scores.items(), key=lambda x: x[1]["combined"])

        keyword_score = scores[best_role]["keyword"]
        semantic_score = scores[best_role]["semantic"]
        confidence = scores[best_role]["combined"]

        return {
            "role": best_role,
            "confidence": round(confidence, 3),
            "keyword_score": round(keyword_score, 3),
            "semantic_score": round(semantic_score, 3),
            "is_confident": confidence >= ROLE_CONFIDENCE_THRESHOLD,
            "description": self.roles[best_role]["description"],
            "typical_stack": self.roles[best_role].get("typical_stack", ""),
            "all_scores": {
                name: round(v["combined"], 3)
                for name, v in sorted(scores.items(), key=lambda x: -x[1]["combined"])
            },
        }

    def get_role_skills(self, role_name: str, include_secondary: bool = True) -> Dict:
        """
        Return the skill set for a named role.

        Returns:
            {
                "core_skills": [...],
                "secondary_skills": [...],
                "nice_to_have": [...],
                "all_skills": [...],  # core + secondary
                "level_expectations": {...}
            }
        """
        if role_name not in self.roles:
            raise ValueError(f"Role '{role_name}' not found. Available: {list(self.roles.keys())}")

        meta = self.roles[role_name]
        core = meta.get("core_skills", [])
        secondary = meta.get("secondary_skills", [])
        nice = meta.get("nice_to_have", [])

        return {
            "core_skills": core,
            "secondary_skills": secondary if include_secondary else [],
            "nice_to_have": nice,
            "all_skills": core + (secondary if include_secondary else []),
            "level_expectations": meta.get("level_expectations", {}),
        }

    def hybrid_skill_set(
        self,
        jd_skills: List[Dict],
        jd_text: str,
        match_result: Optional[Dict] = None,
    ) -> Dict:
        """
        Produce a hybrid skill list that merges JD skills with role skills.

        Strategy:
        - If role match is confident → add role core skills missing from JD
        - If role match is not confident → return JD skills unchanged
        - Role-sourced skills are tagged with source='role'
        - JD-sourced skills are tagged with source='jd'

        Args:
            jd_skills:     Skills extracted from the JD.
            jd_text:       Raw JD text (used for matching if match_result not given).
            match_result:  Pre-computed match result (avoids re-matching).

        Returns:
            {
                "skills": [...],         # merged skill list
                "source": "hybrid"|"jd", # which strategy was used
                "role": str | None,
                "role_confidence": float,
                "added_from_role": [...]  # skill names injected from role
            }
        """
        if match_result is None:
            match_result = self.match_role(jd_text)

        role_name = match_result["role"]
        confidence = match_result["confidence"]
        is_confident = match_result["is_confident"]

        # Tag JD skills with source
        jd_skill_names_lower = {s["name"].lower() for s in jd_skills}
        for skill in jd_skills:
            skill.setdefault("source", "jd")

        if not is_confident:
            return {
                "skills": jd_skills,
                "source": "jd",
                "role": None,
                "role_confidence": confidence,
                "added_from_role": [],
                "reasoning": (
                    f"JD-only mode: best role match was '{role_name}' "
                    f"(confidence {confidence:.2f} < threshold {ROLE_CONFIDENCE_THRESHOLD}). "
                    "Using JD skills exclusively."
                ),
            }

        # Confident match → inject missing core skills from role
        role_skills_meta = self.get_role_skills(role_name, include_secondary=False)
        core_skills = role_skills_meta["core_skills"]
        level_map = role_skills_meta["level_expectations"]

        # Determine default level for role-injected skills
        injected_level = "Intermediate"
        for lvl, lvl_skills in level_map.items():
            # Use the most appropriate level
            injected_level = lvl
            break

        added_from_role = []
        merged = list(jd_skills)

        for skill_name in core_skills:
            if skill_name.lower() not in jd_skill_names_lower:
                merged.append({
                    "name": skill_name,
                    "category": "Role Core Skill",
                    "level": injected_level,
                    "required_level": injected_level,
                    "confidence": 0.70,
                    "source": "role",
                    "gap_score": 2,
                    "reason": f"Core skill for {role_name} role",
                })
                added_from_role.append(skill_name)

        return {
            "skills": merged,
            "source": "hybrid",
            "role": role_name,
            "role_confidence": confidence,
            "added_from_role": added_from_role,
            "reasoning": (
                f"Hybrid mode: matched role '{role_name}' "
                f"(confidence {confidence:.2f}). "
                f"Added {len(added_from_role)} core role skills not in JD: "
                f"{added_from_role}."
            ),
        }

    def list_roles(self) -> List[Dict]:
        """Return a summary list of all available roles."""
        return [
            {
                "role": name,
                "description": meta["description"],
                "core_skills": meta.get("core_skills", []),
                "typical_stack": meta.get("typical_stack", ""),
            }
            for name, meta in self.roles.items()
        ]

    # ------------------------------------------------------------------ #
    # Private — scoring                                                    #
    # ------------------------------------------------------------------ #

    def _score_all_roles(self, jd_text: str) -> Dict[str, Dict[str, float]]:
        """Score JD text against every role, returning keyword + semantic + combined."""
        jd_lower = jd_text.lower()
        jd_vector = self._tfidf_vector(jd_lower)

        results = {}
        for role_name, meta in self.roles.items():
            keyword_score = self._keyword_score(jd_lower, meta.get("keywords", []))
            semantic_score = self._cosine_similarity(jd_vector, self._role_vectors[role_name])

            # Weighted: keyword signal is reliable but narrow; semantic fills in gaps
            combined = 0.55 * keyword_score + 0.45 * semantic_score
            results[role_name] = {
                "keyword": keyword_score,
                "semantic": semantic_score,
                "combined": combined,
            }
        return results

    def _keyword_score(self, jd_lower: str, keywords: List[str]) -> float:
        """Fraction of role keywords that appear in the JD (word-boundary aware)."""
        if not keywords:
            return 0.0
        hits = sum(
            1 for kw in keywords
            if re.search(r"\b" + re.escape(kw.lower()) + r"\b", jd_lower)
        )
        return hits / len(keywords)

    # ------------------------------------------------------------------ #
    # Private — TF-IDF helpers                                            #
    # ------------------------------------------------------------------ #

    def _role_corpus(self, meta: Dict) -> str:
        """Build a text corpus from role metadata for TF-IDF."""
        parts = [
            meta.get("description", ""),
            " ".join(meta.get("keywords", [])),
            " ".join(meta.get("core_skills", [])),
            " ".join(meta.get("secondary_skills", [])),
        ]
        return " ".join(parts).lower()

    def _tokenize(self, text: str) -> List[str]:
        """Simple whitespace + punctuation tokenizer."""
        return re.findall(r"[a-z0-9]+(?:\.[a-z0-9]+)*", text.lower())

    def _tfidf_vector(self, text: str) -> Dict[str, float]:
        """Compute a simple TF vector (IDF approximated via term presence)."""
        tokens = self._tokenize(text)
        if not tokens:
            return {}
        counts = Counter(tokens)
        total = len(tokens)
        return {term: count / total for term, count in counts.items()}

    def _cosine_similarity(self, vec_a: Dict, vec_b: Dict) -> float:
        """Cosine similarity between two TF dict vectors."""
        if not vec_a or not vec_b:
            return 0.0
        common = set(vec_a) & set(vec_b)
        if not common:
            return 0.0
        dot = sum(vec_a[t] * vec_b[t] for t in common)
        mag_a = math.sqrt(sum(v * v for v in vec_a.values()))
        mag_b = math.sqrt(sum(v * v for v in vec_b.values()))
        if mag_a == 0 or mag_b == 0:
            return 0.0
        return dot / (mag_a * mag_b)
