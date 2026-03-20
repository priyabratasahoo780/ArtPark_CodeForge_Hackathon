import re
from typing import Dict, List

class DomainClassifier:
    """
    Classifies the domain of a text (Resume or Job Description) 
    using weighted keyword matching.
    """
    
    # Domain keywords and weights
    DOMAIN_KEYWORDS = {
        'Technology': {
            'keywords': [
                'python', 'javascript', 'react', 'node.js', 'fastapi', 'sql', 'docker', 
                'kubernetes', 'aws', 'backend', 'frontend', 'software', 'developer', 
                'engineer', 'code', 'git', 'fullstack', 'machine learning', 'ai', 'devops'
            ],
            'weight': 1.0
        },
        'Marketing': {
            'keywords': [
                'seo', 'sem', 'content strategy', 'google analytics', 'social media', 
                'copywriting', 'campaign', 'branding', 'email marketing', 'digital marketing', 
                'adwords', 'marketing manager', 'engagement', 'conversion'
            ],
            'weight': 1.2
        },
        'Human Resources': {
            'keywords': [
                'recruitment', 'onboarding', 'payroll', 'hris', 'talent acquisition', 
                'employee relations', 'compliance', 'screening', 'hr generalist', 
                'retention', 'benefits', 'performance management', 'workplace'
            ],
            'weight': 1.2
        },
        'Sales': {
            'keywords': [
                'lead generation', 'crm', 'negotiation', 'b2b', 'account management', 
                'cold calling', 'salesforce', 'leads', 'revenue', 'quota', 'prospecting', 
                'pipeline', 'sales executive', 'business development'
            ],
            'weight': 1.2
        },
        'Finance': {
            'keywords': [
                'financial analyst', 'accounting', 'audit', 'tax', 'budgeting', 
                'forecasting', 'ledger', 'balance sheet', 'investment', 'portfolio', 
                'reconciliation', 'sap', 'fintech', 'banking'
            ],
            'weight': 1.2
        }
    }

    def __init__(self):
        pass

    def classify_domain(self, text: str) -> Dict:
        """
        Classifies the text into a domain based on keyword frequency.
        """
        if not text:
            return {'domain': 'Unknown', 'confidence': 0.0}

        text_lower = text.lower()
        domain_scores = {}

        for domain, data in self.DOMAIN_KEYWORDS.items():
            score = 0
            for keyword in data['keywords']:
                # count occurrences with word boundaries
                pattern = r'\b' + re.escape(keyword) + r'\b'
                count = len(re.findall(pattern, text_lower))
                score += count * data['weight']
            
            domain_scores[domain] = score

        # Identify the domain with the highest score
        if not any(domain_scores.values()):
            return {'domain': 'General/Other', 'confidence': 0.5}

        best_domain = max(domain_scores, key=domain_scores.get)
        total_score = sum(domain_scores.values())
        confidence = domain_scores[best_domain] / total_score if total_score > 0 else 0

        # Heuristic: If confidence is very low, fall back to Technology if any tech keywords exist
        if confidence < 0.3 and domain_scores.get('Technology', 0) > 0:
            best_domain = 'Technology'
            confidence = 0.4

        return {
            'domain': best_domain,
            'confidence': round(confidence, 2),
            'scores': domain_scores
        }
