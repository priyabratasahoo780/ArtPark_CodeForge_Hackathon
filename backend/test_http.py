import requests
import traceback
try:
    payload = {
        'resumes': ['react resume text 1', 'github resume text 2'],
        'job_description_text': 'need a react dev',
        'candidate_names': ['react', 'github']
    }
    resp = requests.post('http://localhost:8000/hr/analyze-multiple', json=payload)
    with open('api_result.txt', 'w', encoding='utf-8') as f:
        f.write(str(resp.status_code) + '\n')
        f.write(resp.text)
except Exception as e:
    with open('api_result.txt', 'w', encoding='utf-8') as f:
        f.write(traceback.format_exc())
