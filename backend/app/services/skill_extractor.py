import json
import logging
import os
import re
import google.generativeai as genai
from typing import List, Dict, Set, Optional

logger = logging.getLogger(__name__)

class SkillExtractor:
    """
    Extracts skills from resume and job descriptions using Gemini AI with a robust fallback.
    """
    
    def __init__(self, taxonomy_path: Optional[str] = None):
        """Initialize skill extractor with Gemini API."""
        api_key = os.getenv("GEMINI_API_KEY")
        print(f"CALLED SkillExtractor.__init__ - API KEY found: {bool(api_key)}")
        if not api_key:
            logger.warning("GEMINI_API_KEY not found in environment! Skill Extraction will fail.")
        else:
            genai.configure(api_key=api_key)
            
        self.model = genai.GenerativeModel(
            model_name="models/gemini-2.0-flash"
        )
        
        # Skill keywords for fallback extraction
        self.tech_keywords = {
            'Frontend': ['React', 'Vue', 'Angular', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Next.js', 'Tailwind', 'Sass'],
            'Backend': ['Node.js', 'Python', 'Go', 'Java', 'C++', 'Django', 'Flask', 'FastAPI', 'Express', 'Spring'],
            'Cloud/DevOps': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Lambda', 'EC2'],
            'Database': ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase', 'SQL', 'NoSQL', 'Supabase'],
            'General': ['Git', 'Agile', 'GraphQL', 'REST', 'API', 'Testing', 'Jest', 'Machine Learning', 'AI']
        }

    def _fallback_extraction(self, text: str) -> List[Dict]:
        """Simple keyword-based extraction as a fallback."""
        skills = []
        text_lower = text.lower()
        
        for category, keywords in self.tech_keywords.items():
            for kw in keywords:
                if re.search(r'\b' + re.escape(kw.lower()) + r'\b', text_lower):
                    skills.append({
                        "name": kw,
                        "category": category,
                        "level": "Intermediate",
                        "prerequisites": [],
                        "confidence": 0.7
                    })
        return skills

    def extract_from_resume(self, resume_text: str) -> Dict:
        """
        Extract comprehensive information from resume using LLM.
        """
        print(f"CALLED SkillExtractor.extract_from_resume - Text length: {len(resume_text)}")
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
            # Remove markdown backticks if present
            raw_text = response.text.strip()
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.startswith("```"):
                raw_text = raw_text[3:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
            raw_text = raw_text.strip()
            
            data = json.loads(raw_text)
            skills = data.get('skills', [])
        except Exception as e:
            print(f"LLM resume extraction failed, using fallback: {e}")
            skills = self._fallback_extraction(resume_text)

        # Ensure we return SOMETHING
        if not skills:
            skills = [{"name": "Software Development", "category": "General", "level": "Intermediate", "prerequisites": [], "confidence": 0.5}]

        for s in skills:
            if 'confidence' not in s: s['confidence'] = 0.9
            if 'prerequisites' not in s: s['prerequisites'] = []
            if 'level' not in s: s['level'] = 'Intermediate'

        return {
            'skills': skills,
            'total_skills_count': len(skills),
            'skill_categories': self._categorize_skills(skills)
        }

    def extract_from_job_description(self, job_desc_text: str) -> Dict:
        """
        Extract requirements from job description using LLM.
        """
        print(f"CALLED SkillExtractor.extract_from_job_description - Text length: {len(job_desc_text)}")
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
            # Remove markdown backticks if present
            raw_text = response.text.strip()
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.startswith("```"):
                raw_text = raw_text[3:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
            raw_text = raw_text.strip()
            
            data = json.loads(raw_text)
            required = data.get('required_skills', [])
            nice_to_have = data.get('nice_to_have_skills', [])
        except Exception as e:
            print(f"LLM JD extraction failed, using fallback: {e}")
            required = self._fallback_extraction(job_desc_text)
            nice_to_have = []

        if not required:
            # Emergency fallback for JD
            required = [{"name": "Software Development", "category": "General", "level": "Intermediate", "prerequisites": [], "confidence": 0.5}]
            print("JD extraction returned NO skills. Using emergency fallback.")
        
        print(f"JD extraction complete. Required: {len(required)}, Nice to have: {len(nice_to_have)}")

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

    def _categorize_skills(self, skills: List[Dict]) -> Dict[str, List]:
        """Group skills by category."""
        categories = {}
        for skill in skills:
            category = skill.get('category', 'Other')
            if category not in categories:
                categories[category] = []
            categories[category].append(skill['name'])
        return categories
