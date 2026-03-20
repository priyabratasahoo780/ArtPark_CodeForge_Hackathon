import urllib.request
import json

url = "http://localhost:8000/onboarding/complete"
data = {
    "resume_text": "I am an experienced Marketing Manager with a strong background in SEO, SEM, and Google Analytics. I have managed social media campaigns and have strong copywriting skills.",
    "job_description_text": "Looking for a Marketing Leader. Requirements: SEO, Content Strategy, Google Analytics, Lead Generation, and Team Management."
}

try:
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as response:
        status_code = response.getcode()
        body = response.read().decode('utf-8')
        result = json.loads(body)
        print(f"Status Code: {status_code}")
        print(f"Detected Domain: {result.get('detected_domain', {}).get('domain')}")
        print(f"Confidence: {result.get('detected_domain', {}).get('confidence')}")
        print("\nExtracted Skills (Summary):")
        for skill in result.get('skills_analysis', {}).get('skills', []):
            print(f"- {skill['name']} ({skill['category']})")
        
        print("\nGap Analysis (Missing):")
        for skill in result.get('gap_analysis', {}).get('missing_skills', []):
            print(f"- {skill['name']} ({skill['category']})")

except Exception as e:
    print(f"Error: {e}")
