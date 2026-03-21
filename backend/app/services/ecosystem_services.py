import random

class PairProgrammerService:
    def __init__(self):
        self.hints = {
            "React": [
                "Try using the `useEffect` hook to handle this side-effect.",
                "Remember that state updates are asynchronous.",
                "Consider lifting state up if multiple components need this data."
            ],
            "Python": [
                "Use list comprehensions for more idiomatic code.",
                "Don't forget to handle potential exceptions with `try-except`.",
                "Consider using a generator if you're dealing with a large dataset."
            ],
            "FastAPI": [
                "Use `Depends` for clean dependency injection.",
                "Keep your path operations focused and delegate logic to services.",
                "Leverage Pydantic models for robust data validation."
            ],
            "General": [
                "What's the time complexity of this approach?",
                "Can we make this logic more modular?",
                "How would you test this specific edge case?"
            ]
        }

    def get_hint(self, context_skill: str = "General") -> str:
        category = context_skill if context_skill in self.hints else "General"
        return random.choice(self.hints[category])

class FlashcardGenerator:
    def generate_cards(self, mastered_skills: list) -> list:
        cards = []
        for skill in mastered_skills:
            # Mock logic to generate a QA pair for the skill
            cards.append({
                "id": f"card-{random.randint(1000, 9999)}",
                "skill": skill,
                "question": f"What is the primary purpose of {skill} in modern architectures?",
                "answer": f"{skill} is essential for building scalable and maintainable systems by providing abstracted logic and standardized interfaces.",
                "difficulty": "Medium"
            })
            cards.append({
                "id": f"card-{random.randint(1000, 9999)}",
                "skill": skill,
                "question": f"Identify a common anti-pattern when implementing {skill}.",
                "answer": f"A common pitfall is over-engineering the implementation of {skill} before the actual requirements are fully understood.",
                "difficulty": "Hard"
            })
        return cards

class EcosystemService:
    def get_market_trends(self) -> dict:
        return {
            "trending_skills": ["Rust", "Go", "Kubernetes", "GraphQL", "PyTorch"],
            "hotspots": [
                {"city": "San Francisco", "active_users": 1240, "top_skill": "GenAI"},
                {"city": "Bengaluru", "active_users": 850, "top_skill": "Cloud Native"},
                {"city": "London", "active_users": 620, "top_skill": "FinTech"},
                {"city": "Tokyo", "active_users": 410, "top_skill": "Web3"}
            ],
            "global_readiness_avg": 68
        }
