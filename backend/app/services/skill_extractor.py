import json
import re
from typing import List, Dict, Set
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

class SkillExtractor:
    """
    Extracts skills from resume and job descriptions using pattern matching and NLP.
    """
    
    def __init__(self, taxonomy_path: str = None):
        """Initialize skill extractor with taxonomy."""
        if taxonomy_path is None:
            # Default to local taxonomy
            current_dir = Path(__file__).parent.parent / "datasets" / "skills_taxonomy.json"
        else:
            current_dir = Path(taxonomy_path)
            
        with open(current_dir, 'r') as f:
            self.taxonomy = json.load(f)
        
        # Build skill index for faster lookup
        self.all_skills = self._build_skill_index()
        
    def _build_skill_index(self) -> Dict[str, Dict]:
        """Build a flat index of all skills for quick lookup."""
        skills = {}
        for category, category_skills in self.taxonomy['skills'].items():
            for skill_name, skill_data in category_skills.items():
                skills[skill_name.lower()] = {
                    'name': skill_name,
                    'category': skill_data.get('category'),
                    'prerequisites': skill_data.get('prerequisites', []),
                    'description': skill_data.get('description', '')
                }
        return skills
    
    def extract_skills_from_text(self, text: str) -> List[Dict]:
        """
        Extract skills from text (resume or job description).
        Returns list of detected skills with metadata.
        """
        if not text:
            return []
            
        text_lower = text.lower()
        extracted = []
        seen = set()
        
        # Direct skill matching
        for skill_lower, skill_data in self.all_skills.items():
            if self._skill_appears_in_text(text_lower, skill_lower, skill_data['name']):
                if skill_lower not in seen:
                    extracted.append({
                        'name': skill_data['name'],
                        'category': skill_data['category'],
                        'confidence': 0.95,  # Exact match has high confidence
                        'prerequisites': skill_data['prerequisites']
                    })
                    seen.add(skill_lower)
        
        # Fuzzy matching for partial matches
        fuzzy_matches = self._fuzzy_skill_matching(text_lower, seen)
        extracted.extend(fuzzy_matches)
        
        return extracted
    
    def _skill_appears_in_text(self, text: str, skill_lower: str, skill_name: str) -> bool:
        """Check if skill appears in text with word boundaries."""
        # Convert to word pattern for word boundary matching
        pattern = r'\b' + re.escape(skill_lower) + r'\b'
        return bool(re.search(pattern, text, re.IGNORECASE))
    
    def _fuzzy_skill_matching(self, text: str, seen: Set) -> List[Dict]:
        """
        Perform fuzzy matching for related skills or acronyms.
        """
        fuzzy_matches = []
        
        # Common acronyms and abbreviations
        acronyms = {
            'ml': 'Machine Learning',
            'ai': 'Machine Learning',  # Related to AI
            'nlp': 'Deep Learning',  # NLP uses deep learning
            'oop': 'Programming Languages',
            'rest': 'Backend Knowledge',
            'http': 'Backend Knowledge',
        }
        
        for acronym, category in acronyms.items():
            if acronym in text and acronym not in seen:
                pattern = r'\b' + acronym + r'\b'
                if re.search(pattern, text, re.IGNORECASE):
                    # Try to find exact skill match for category
                    for skill_lower, skill_data in self.all_skills.items():
                        if category.lower() in skill_data['category'].lower():
                            fuzzy_matches.append({
                                'name': skill_data['name'],
                                'category': skill_data['category'],
                                'confidence': 0.70,  # Fuzzy match has lower confidence
                                'prerequisites': skill_data['prerequisites']
                            })
                            break
                    seen.add(acronym)
        
        return fuzzy_matches
    
    def infer_skill_level(self, text: str, skill_name: str) -> str:
        """
        Infer proficiency level (Beginner, Intermediate, Advanced) from context.
        """
        text_lower = text.lower()
        skill_context = self._extract_context_around_skill(text_lower, skill_name.lower())
        
        advanced_keywords = ['expert', 'mastery', 'architect', 'lead', 'principal', 'senior', '10+', '5+ years']
        intermediate_keywords = ['proficient', 'strong', '2-3 years', 'professional', 'production']
        
        if any(keyword in skill_context for keyword in advanced_keywords):
            return 'Advanced'
        elif any(keyword in skill_context for keyword in intermediate_keywords):
            return 'Intermediate'
        else:
            return 'Beginner'
    
    def _extract_context_around_skill(self, text: str, skill: str, context_size: int = 100) -> str:
        """Extract surrounding context around skill mention."""
        pattern = r'\b' + re.escape(skill) + r'\b'
        match = re.search(pattern, text, re.IGNORECASE)
        
        if match:
            start = max(0, match.start() - context_size)
            end = min(len(text), match.end() + context_size)
            return text[start:end]
        return ""
    
    def extract_from_resume(self, resume_text: str) -> Dict:
        """
        Extract comprehensive information from resume.
        """
        skills = self.extract_skills_from_text(resume_text)
        
        # Add experience levels
        for skill in skills:
            skill['level'] = self.infer_skill_level(resume_text, skill['name'])
        
        return {
            'skills': skills,
            'total_skills_count': len(skills),
            'skill_categories': self._categorize_skills(skills)
        }
    
    def extract_from_job_description(self, job_desc_text: str) -> Dict:
        """
        Extract requirements from job description.
        """
        skills = self.extract_skills_from_text(job_desc_text)
        
        # Prioritize required skills (usually mentioned first or with "required")
        required_pattern = r'\b(required|must have|essential|mandatory)\b'
        nice_to_have_pattern = r'\b(nice to have|preferred|bonus|optional)\b'
        
        required = []
        nice_to_have = []
        
        for i, skill in enumerate(skills):
            # Simple heuristic: skills mentioned in first half are more likely required
            if i < len(skills) * 0.4:
                required.append(skill)
            else:
                nice_to_have.append(skill)
        
        return {
            'required_skills': required,
            'nice_to_have_skills': nice_to_have,
            'total_required': len(required),
            'total_nice_to_have': len(nice_to_have),
            'skill_categories': self._categorize_skills(skills)
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
