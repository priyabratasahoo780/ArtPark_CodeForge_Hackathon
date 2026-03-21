from typing import List, Dict
import json
import re
from app.services.llm_service import llm_service

TRENDING_BY_DOMAIN = {
    "Frontend": ["Next.js", "TypeScript", "React", "Tailwind CSS", "GraphQL", "WebAssembly"],
    "Backend": ["Python", "Go", "Rust", "Node.js", "GraphQL", "Kafka", "Redis", "PostgreSQL"],
    "Full Stack": ["Next.js", "TypeScript", "Docker", "AWS", "GraphQL", "React", "Node.js", "Kubernetes"],
    "DevOps/Cloud": ["Kubernetes", "Docker", "Terraform", "AWS", "CI/CD", "Prometheus", "Linux", "GCP"],
    "Data / ML": ["Python", "PyTorch", "TensorFlow", "LLMs", "Generative AI", "Pandas", "Snowflake", "SQL"],
    "Cybersecurity": ["Penetration Testing", "Security Architecture", "Cloud Security", "Cryptography", "Python"],
    "Mobile": ["Flutter", "React Native", "Swift", "Kotlin", "Mobile UI"]
}

class MarketTrendAnalyzer:
    """
    Compares user skills with industry demand to find missing trending skills.
    """
    def analyze(self, current_skills: List[str], domain: str = "Full Stack") -> Dict[str, List[str]]:
        if not current_skills:
            return {"missing_trending_skills": TRENDING_BY_DOMAIN.get(domain, TRENDING_BY_DOMAIN["Full Stack"])[:3]}
            
        prompt = f"""
        You are an expert tech recruiter and market analyst.
        The user is in the '{domain}' domain.
        Their current skills are: {', '.join(current_skills)}
        
        Based on the latest industry trends, identify exactly 4 highly demanded, trending skills 
        in their domain that they do NOT currently have.
        
        Return ONLY a JSON array of 4 strings. Example:
        ["Kubernetes", "GraphQL", "Rust", "WebAssembly"]
        """
        
        current_skills_lower = {s.lower() for s in current_skills}
        domain_trends = TRENDING_BY_DOMAIN.get(domain, TRENDING_BY_DOMAIN.get("Full Stack", []))
        fallback_missing = [skill for skill in domain_trends if skill.lower() not in current_skills_lower][:4]
        
        fallback_json = json.dumps(fallback_missing)
        
        llm_response = llm_service.generate(prompt, fallback_json)
        
        try:
            clean_json = re.sub(r'```json|```', '', llm_response).strip()
            data = json.loads(clean_json)
            if isinstance(data, list):
                return {"missing_trending_skills": data[:4]}
        except:
            pass
            
        return {"missing_trending_skills": fallback_missing}
