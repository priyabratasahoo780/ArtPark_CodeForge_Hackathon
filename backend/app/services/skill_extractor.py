import json
import logging
import os
import google.generativeai as genai
from typing import List, Dict, Set, Optional

logger = logging.getLogger(__name__)

class SkillExtractor:
    """
    Extracts skills from resume and job descriptions using Gemini AI for robust, dynamic interpretation.
    """
    
    def __init__(self, taxonomy_path: Optional[str] = None):
        """Initialize skill extractor with Gemini API."""
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            logger.warning("GEMINI_API_KEY not found in environment! Skill Extraction will fail.")
        else:
            genai.configure(api_key=api_key)
            
        self.model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            generation_config={"response_mime_type": "application/json"}
        )

    def extract_from_resume(self, resume_text: str) -> Dict:
        """
        Extract comprehensive information from resume using LLM.
        """
        prompt = f"""
        Analyze the following resume text and extract all technical and soft skills.
        Return a JSON object strictly matching this schema:
        {{
            "skills": [
                {{
                    "name": "Skill Name (e.g., React, Node.js, AWS)",
                    "category": "Broad category (e.g., Frontend Framework, Runtime, Cloud Platform)",
                    "level": "Beginner | Intermediate | Advanced",
                    "prerequisites": ["List", "of", "basic", "dependencies"],
                    "confidence": 0.95
                }}
            ]
        }}

        Resume Text:
        {resume_text}
        """

        try:
            response = self.model.generate_content(prompt)
            data = json.loads(response.text)
            skills = data.get('skills', [])
            
            # Ensure proper structure
            for s in skills:
                if 'confidence' not in s: s['confidence'] = 0.9
                if 'prerequisites' not in s: s['prerequisites'] = []
                if 'level' not in s: s['level'] = 'Intermediate'

            return {
                'skills': skills,
                'total_skills_count': len(skills),
                'skill_categories': self._categorize_skills(skills)
            }
        except Exception as e:
            logger.error(f"LLM Resume Extraction failed: {e}")
            return {'skills': [], 'total_skills_count': 0, 'skill_categories': {}}

    def extract_from_job_description(self, job_desc_text: str) -> Dict:
        """
        Extract requirements from job description using LLM.
        """
        prompt = f"""
        Analyze the following job description text. Extract and separate the 'required' skills from the 'nice-to-have' skills.
        Return a JSON object strictly matching this schema:
        {{
            "required_skills": [
                {{
                    "name": "Skill Name",
                    "category": "Broad category",
                    "level": "Intermediate",
                    "prerequisites": []
                }}
            ],
            "nice_to_have_skills": [
                {{
                    "name": "Skill Name",
                    "category": "Broad category",
                    "level": "Intermediate",
                    "prerequisites": []
                }}
            ]
        }}

        Job Description Text:
        {job_desc_text}
        """

        try:
            response = self.model.generate_content(prompt)
            data = json.loads(response.text)
            
            required = data.get('required_skills', [])
            nice_to_have = data.get('nice_to_have_skills', [])

            for s in required + nice_to_have:
                if 'prerequisites' not in s: s['prerequisites'] = []
                if 'level' not in s: s['level'] = 'Intermediate'

            return {
                'required_skills': required,
                'nice_to_have_skills': nice_to_have,
                'total_required': len(required),
                'total_nice_to_have': len(nice_to_have),
                'skill_categories': self._categorize_skills(required + nice_to_have)
            }
        except Exception as e:
            logger.error(f"LLM JD Extraction failed: {e}")
            return {
                'required_skills': [],
                'nice_to_have_skills': [],
                'total_required': 0,
                'total_nice_to_have': 0,
                'skill_categories': {}
            }

    def _categorize_skills(self, skills: List[Dict]) -> Dict[str, List]:
        """Group skills by category."""
        categories = {}
        for skill in skills:
            category = skill.get('category', 'Other')
            if category not in categories:
                categories[category] = []
            categories[category].append(skill['name'])
        return categories
