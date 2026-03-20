from typing import List, Dict

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
            
        current_skills_lower = {s.lower() for s in current_skills}
        
        domain_trends = TRENDING_BY_DOMAIN.get(domain, TRENDING_BY_DOMAIN["Full Stack"])
        
        missing = [skill for skill in domain_trends if skill.lower() not in current_skills_lower]
        
        return {"missing_trending_skills": missing[:4]}
