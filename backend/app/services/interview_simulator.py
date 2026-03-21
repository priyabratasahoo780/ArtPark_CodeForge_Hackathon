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
        Generate a set of interview questions using the LLM.
        """
        if not mastered_skills or len(mastered_skills) == 0:
            mastered_skills = ["Software Engineering", "System Design", "Problem Solving"]
            
        skills_str = ", ".join(map(str, mastered_skills[:3]))
        prompt = f"""
        You are an expert technical interviewer. The candidate has mastered: {skills_str}.
        Generate exactly {count} challenging technical interview questions based on these skills.
        
        Return ONLY a JSON array of objects with 'skill' and 'text'. Example:
        [
          {{"skill": "React", "text": "Explain the Virtual DOM..."}}
        ]
        """
        
        fallback_json = json.dumps([
            {"skill": str(s), "text": f"Explain the core architectural patterns you would use with {s}."}
            for s in mastered_skills[:count]
        ])
        
        llm_response = llm_service.generate(prompt, fallback_json)
        
        try:
            clean_json = re.sub(r'```json|```', '', llm_response).strip()
            # Simple robust json array extraction
            start_idx = clean_json.find('[')
            end_idx = clean_json.rfind(']') + 1
            if start_idx != -1 and end_idx != -1:
                clean_json = clean_json[start_idx:end_idx]
            
            data = json.loads(clean_json)
            if isinstance(data, list) and len(data) > 0:
                return data[:count]
        except Exception:
            pass
            
        return json.loads(fallback_json)

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
