from typing import List, Dict, Set, Tuple
from pathlib import Path
import json
import logging

logger = logging.getLogger(__name__)


class DependencyResolver:
    """
    Resolves skill dependencies using the skill_graph.json.

    Key capabilities:
    - Transitive prerequisite resolution (deep dependencies)
    - Topological ordering (prerequisites always appear first)
    - Known-skill skipping (don't re-learn what you already know)
    - Cycle detection (graceful skip on circular dependencies)
    - Full graph export (for frontend visualization)
    """

    def __init__(self, graph_path: str = None):
        """Load skill dependency graph from JSON."""
        if graph_path is None:
            graph_path = Path(__file__).parent.parent / "datasets" / "skill_graph.json"
        else:
            graph_path = Path(graph_path)

        with open(graph_path, "r") as f:
            data = json.load(f)

        self.graph: Dict[str, Dict] = data.get("skills", {})
        # Normalize all keys to lowercase for case-insensitive lookup
        self.graph_lower: Dict[str, Dict] = {
            k.lower(): v for k, v in self.graph.items()
        }
        logger.info(
            f"DependencyResolver loaded {len(self.graph)} skills from {graph_path.name}"
        )

    # ------------------------------------------------------------------ #
    # Public API                                                           #
    # ------------------------------------------------------------------ #

    def resolve(
        self,
        target_skills: List[Dict],
        known_skills: Set[str],
    ) -> List[Dict]:
        """
        Return an ordered list of skills to learn, prerequisites first.

        Args:
            target_skills: Skills from gap analysis (dicts with at least 'name').
            known_skills:  Lowercase skill names the user already has.

        Returns:
            Ordered list of skill dicts ready for module generation.
            Each dict is enriched with a 'dependency_chain' key.
        """
        known_lower = {s.lower() for s in known_skills}

        # Collect all skills to learn (targets + missing prereqs)
        all_skills_map: Dict[str, Dict] = {}
        for skill in target_skills:
            name_lower = skill["name"].lower()
            if name_lower not in known_lower:
                all_skills_map[name_lower] = skill

            # Inject transitive prerequisites that are not already known
            for prereq_lower, meta in self._get_all_prerequisites(
                skill["name"], known_lower
            ).items():
                if prereq_lower not in known_lower and prereq_lower not in all_skills_map:
                    all_skills_map[prereq_lower] = {
                        "name": meta.get("canonical_name", prereq_lower.title()),
                        "category": meta.get("category", "Prerequisite"),
                        "required_level": meta.get("level", "Intermediate"),
                        "prerequisites": meta.get("requires", []),
                        "gap_score": 2,
                        "reason": f"Prerequisite for learning other required skills",
                        "is_injected_prerequisite": True,
                    }

        # Topological sort
        ordered = self._topological_sort(list(all_skills_map.values()), known_lower)

        # Attach dependency chain metadata to each skill
        for skill in ordered:
            chain = self._get_dependency_chain(skill["name"], known_lower)
            skill["dependency_chain"] = chain

        return ordered

    def get_prerequisites(self, skill_name: str, known_skills: Set[str] = None) -> List[str]:
        """
        Return ordered list of prerequisite names for a single skill
        (excluding already known skills).

        Args:
            skill_name:   Target skill name.
            known_skills: Set of lowercase known skill names.

        Returns:
            List of prerequisite skill names in learning order.
        """
        known_lower = {s.lower() for s in (known_skills or set())}
        prereqs = self._get_all_prerequisites(skill_name, known_lower)
        return [meta.get("canonical_name", k.title()) for k, meta in prereqs.items()]

    def build_full_graph(self, skills: List[str] = None) -> Dict:
        """
        Build a graph structure suitable for frontend visualization.

        Args:
            skills: Optional list of skill names to restrict graph to.
                    If None, returns the full graph.

        Returns:
            Dict with 'nodes' and 'edges' arrays.
        """
        if skills:
            skill_set = {s.lower() for s in skills}
            # Expand to include all prereqs
            for s in list(skill_set):
                for prereq in self._get_all_prerequisites(s, set()):
                    skill_set.add(prereq)
        else:
            skill_set = set(self.graph_lower.keys())

        nodes = []
        edges = []

        for skill_lower in skill_set:
            if skill_lower not in self.graph_lower:
                continue
            meta = self.graph_lower[skill_lower]
            canonical = self._get_canonical_name(skill_lower)
            nodes.append({
                "id": skill_lower,
                "label": canonical,
                "category": meta.get("category", "Other"),
                "level": meta.get("level", "Intermediate"),
                "description": meta.get("description", ""),
            })
            for req in meta.get("requires", []):
                if req.lower() in skill_set:
                    edges.append({
                        "from": req.lower(),
                        "to": skill_lower,
                        "type": "prerequisite",
                    })

        return {
            "nodes": nodes,
            "edges": edges,
            "total_nodes": len(nodes),
            "total_edges": len(edges),
        }

    # ------------------------------------------------------------------ #
    # Private helpers                                                      #
    # ------------------------------------------------------------------ #

    def _get_all_prerequisites(
        self, skill_name: str, known_lower: Set[str]
    ) -> Dict[str, Dict]:
        """
        DFS to collect all transitive prerequisites not already known.
        Handles cycles gracefully.

        Returns:
            Ordered dict {skill_lower: graph_meta}, prerequisites first.
        """
        result: Dict[str, Dict] = {}
        visiting: Set[str] = set()

        def dfs(name: str):
            name_lower = name.lower()
            if name_lower in visiting:
                return  # Cycle detected — skip
            if name_lower in known_lower:
                return  # Already known — skip
            if name_lower not in self.graph_lower:
                return  # Not in graph — can't resolve

            visiting.add(name_lower)
            meta = self.graph_lower[name_lower]
            for req in meta.get("requires", []):
                if req.lower() not in known_lower:
                    dfs(req)

            visiting.discard(name_lower)
            if name_lower not in result:
                meta_copy = dict(meta)
                meta_copy["canonical_name"] = self._get_canonical_name(name_lower)
                result[name_lower] = meta_copy

        dfs(skill_name)
        # Remove the target skill itself (we only want its prerequisites)
        result.pop(skill_name.lower(), None)
        return result

    def _get_dependency_chain(self, skill_name: str, known_lower: Set[str]) -> List[str]:
        """
        Return human-readable dependency chain string list.

        Example: ["HTML", "CSS", "JavaScript"] → ["React"]
        """
        prereqs = self.get_prerequisites(skill_name, known_lower)
        return prereqs  # already in learning order

    def _topological_sort(self, skills: List[Dict], known_lower: Set[str]) -> List[Dict]:
        """
        Sort skill dicts ensuring prerequisites come before dependents.
        Secondary sort by gap_score desc (critical gaps first).
        """
        skills_map = {s["name"].lower(): s for s in skills}
        ordered: List[Dict] = []
        visited: Set[str] = set()
        visiting: Set[str] = set()

        def visit(name_lower: str):
            if name_lower in visited or name_lower in known_lower:
                return
            if name_lower in visiting:
                return  # Cycle — skip

            visiting.add(name_lower)
            # Visit prerequisites first
            meta = self.graph_lower.get(name_lower, {})
            for req in meta.get("requires", []):
                req_lower = req.lower()
                if req_lower in skills_map and req_lower not in known_lower:
                    visit(req_lower)

            visiting.discard(name_lower)
            visited.add(name_lower)

            if name_lower in skills_map:
                ordered.append(skills_map[name_lower])

        # Process highest gap_score first so critical skills drive ordering
        for skill in sorted(skills, key=lambda x: -x.get("gap_score", 0)):
            visit(skill["name"].lower())

        return ordered

    def _get_canonical_name(self, name_lower: str) -> str:
        """Return the original-cased name from graph keys."""
        for original in self.graph:
            if original.lower() == name_lower:
                return original
        return name_lower.title()
