import random

class InterviewSimulator:
    def __init__(self):
        self.question_bank = {
            "FastAPI": [
                "Explain the difference between 'async def' and 'def' in FastAPI.",
                "How does Dependency Injection work in FastAPI?",
                "How do you handle background tasks in FastAPI?"
            ],
            "React": [
                "What is the Virtual DOM and how does reconciliation work?",
                "Explain the difference between useMemo and useCallback.",
                "How do you handle side effects in functional components?"
            ],
            "Python": [
                "What are decorators and how are they used?",
                "Explain the GIL (Global Interpreter Lock) in Python.",
                "What is the difference between list and tuple?"
            ]
        }

    def generate_questions(self, mastered_skills, count=3):
        """
        Generate a set of interview questions based on the user's mastered skills.
        """
        all_potential_questions = []
        for skill in mastered_skills:
            # Simple lookup, could be enhanced with LLM
            skill_str = str(skill)
            if skill_str in self.question_bank:
                all_potential_questions.extend([{"skill": skill_str, "text": q} for q in self.question_bank[skill_str]])
            else:
                # Default generic question if skill not in bank
                all_potential_questions.append({
                    "skill": skill, 
                    "text": f"Explain the core architectural patterns you would use when building a scalable system with {skill}."
                })
        
        if not all_potential_questions:
            return []
            
        return random.sample(all_potential_questions, min(len(all_potential_questions), count))

    def grade_answer(self, question, answer):
        """
        Grade a user's answer (Placeholder for LLM grading).
        """
        # In a real app, this would call an LLM to evaluate the answer
        # For now, we return a mock evaluation
        score = random.randint(70, 95)
        feedback = "Great explanation of the core concepts! To improve, try to mention specific edge cases or performance implications."
        
        return {
            "score": score,
            "feedback": feedback,
            "is_pass": score >= 80
        }
