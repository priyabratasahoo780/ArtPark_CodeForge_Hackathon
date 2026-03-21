import random
import json
import re
from app.services.llm_service import llm_service

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
        Grade a user's answer using the LLM.
        """
        prompt = f"""
        You are an expert technical interviewer. The user was asked: "{question}"
        The user's answer is: "{answer}"
        
        Evaluate the answer strictly and provide:
        1. A score from 0 to 100
        2. Brief feedback focusing on what they missed or did well.
        3. A boolean indicating if they passed (score >= 80).
        
        Return ONLY valid JSON:
        {{"score": 85, "feedback": "Good answer...", "is_pass": true}}
        """
        
        fallback_json = json.dumps({
            "score": random.randint(70, 95),
            "feedback": "Great explanation! (Mocked fallback due to LLM limit)",
            "is_pass": True
        })
        
        llm_response = llm_service.generate(prompt, fallback_json)
        
        try:
            # Clean possible markdown block backticks
            clean_json = re.sub(r'```json|```', '', llm_response).strip()
            data = json.loads(clean_json)
            return {
                "score": int(data.get("score", 75)),
                "feedback": str(data.get("feedback", "No feedback.")),
                "is_pass": bool(data.get("is_pass", False))
            }
        except:
            # Fallback if parsing fails
            return {
                "score": 75,
                "feedback": "Your response was recorded. (LLM Parse Error)",
                "is_pass": True
            }
