import urllib.request
import json

url = "http://localhost:8000/onboarding/complete"
payload = {
    "resume_text": "Experienced React Developer with 5 years of experience in JavaScript, HTML, CSS, and Node.js. Familiar with AWS and Docker.",
    "job_description_text": "We are looking for a Senior Full-Stack Engineer who is proficient in React, Node.js, and TypeScript. Experience with GraphQL and AWS is required."
}

data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})

try:
    print(f"Sending request to {url}...")
    with urllib.request.urlopen(req, timeout=60) as response:
        print(f"Status: {response.getcode()}")
        data = json.loads(response.read().decode('utf-8'))
        print(json.dumps(data, indent=2))  # Debug full response
        
        skills_analysis = data.get('skills_analysis', {})
        resume_skills_list = skills_analysis.get('resume_skills', [])
        print(f"Resume Skills count: {len(resume_skills_list)}")
        print(f"Resume Skills: {[s.get('name') for s in resume_skills_list]}")
        
        # job_requirements is a LIST in the backend response
        job_reqs_list = skills_analysis.get('job_requirements', [])
        print(f"Job Requirements count: {len(job_reqs_list)}")
        print(f"Job Requirements: {[s.get('name') for s in job_reqs_list]}")
            
        gap_analysis = data.get('gap_analysis', {})
        missing = gap_analysis.get('missing_skills', [])
        partial = gap_analysis.get('partial_skills', [])
        print(f"Missing Skills count: {len(missing)}")
        print(f"Partial Skills count: {len(partial)}")
        
        learning_path = data.get('learning_path', {})
        modules = learning_path.get('modules', [])
        print(f"Learning Path Modules count: {len(modules)}")
        if modules:
            print(f"Learning Path Modules: {[m.get('skill_name') for m in modules]}")
            
except Exception as e:
    import traceback
    print(f"Error: {e}")
    traceback.print_exc()
