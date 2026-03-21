import urllib.request
import json

url = "http://localhost:8000/onboarding/complete"
data = {
    "resume_text": "I am an experienced Marketing Manager with a strong background in SEO, SEM, and Google Analytics. I have managed social media campaigns and have strong copywriting skills.",
    "job_description_text": "Looking for a Marketing Leader. Requirements: SEO, Content Strategy, Google Analytics, Lead Generation, and Team Management."
}

try:
    # Get token for authentication
    import random
    import string
    
    # Generate a random test email to avoid "already registered" errors
    rand_id = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
    test_email = f"test_{rand_id}@example.com"
    test_password = "testpassword"
    
    # Register/Login
    auth_url = "http://localhost:8000/auth/register"
    auth_req_data = {"email": test_email, "password": test_password, "role": "USER"}
    auth_req = urllib.request.Request(auth_url, data=json.dumps(auth_req_data).encode('utf-8'), headers={'Content-Type': 'application/json'})
    
    with urllib.request.urlopen(auth_req) as auth_response:
        auth_body = json.loads(auth_response.read().decode('utf-8'))
        token = auth_body['access_token']
        print(f"Authenticated as: {test_email}")

    # Main request with auth header
    headers = {'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'}
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers)
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
