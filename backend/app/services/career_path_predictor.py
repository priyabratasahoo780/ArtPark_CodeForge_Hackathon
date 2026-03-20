from typing import List, Dict, Any

ONET_ROLES = {
    "Senior Frontend Developer": ["react", "javascript", "typescript", "css", "html", "vue", "angular", "system design", "performance optimization", "accessibility"],
    "Full Stack Developer": ["react", "node.js", "python", "javascript", "sql", "postgresql", "mongodb", "docker", "api design"],
    "Backend Engineer": ["python", "java", "go", "sql", "redis", "kafka", "microservices", "docker", "kubernetes", "aws", "flask", "fastapi"],
    "Data Scientist": ["python", "sql", "machine learning", "pandas", "numpy", "statistics", "scikit-learn", "deep learning", "tensorflow"],
    "DevOps Engineer": ["linux", "docker", "kubernetes", "aws", "terraform", "ci/cd", "python", "bash", "monitoring"],
    "Mobile Developer": ["swift", "kotlin", "react native", "flutter", "ios", "android", "mobile ui"],
    "Cloud Solutions Architect": ["aws", "azure", "gcp", "system design", "networking", "security", "kubernetes", "terraform"],
    "Security Analyst": ["cybersecurity", "networking", "python", "linux", "penetration testing", "siem", "cryptography"],
    "Data Engineer": ["python", "sql", "spark", "hadoop", "kafka", "airflow", "data modeling", "etl"],
    "AI/ML Engineer": ["python", "pytorch", "tensorflow", "machine learning", "deep learning", "nlp", "computer vision", "mlops"]
}

class CareerPathPredictor:
    """
    Suggests future career roles based on current skills.
    Matches skills against predefined O*NET style roles.
    """
    
    def predict(self, current_skills: List[str]) -> Dict[str, List[str]]:
        if not current_skills:
            return {"next_roles": ["Full Stack Developer", "Backend Engineer"]}
            
        current_skills_lower = {s.lower() for s in current_skills}
        role_scores = []
        
        for role_name, required_skills in ONET_ROLES.items():
            req_set = set(required_skills)
            match_count = len(current_skills_lower.intersection(req_set))
            
            if len(req_set) > 0:
                score = match_count / len(req_set)
                
                # Only suggest if there is SOME overlap
                if score >= 0.1:
                    role_scores.append((role_name, score))
                    
        # Sort by best fit
        role_scores.sort(key=lambda x: x[1], reverse=True)
        top_roles = [role for role, score in role_scores[:3]]
        
        # Fallback if no specific overlap found but skills exist
        if not top_roles and current_skills:
            top_roles = ["Senior Frontend Developer", "Full Stack Developer"]
            
        return {"next_roles": top_roles}
