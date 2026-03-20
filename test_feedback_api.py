import urllib.request
import json

url = "http://localhost:8000/analyze/resume-feedback"
data = {
    "resume_text": "I am a Python developer with experience in SQL and Git.",
    "job_description_text": "We are looking for a Full Stack Developer with experience in React, Node.js, and Docker."
}

try:
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as response:
        status_code = response.getcode()
        body = response.read().decode('utf-8')
        print(f"Status Code: {status_code}")
        print("Response JSON:")
        print(json.dumps(json.loads(body), indent=2))
except Exception as e:
    print(f"Error: {e}")
