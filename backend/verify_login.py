import requests
import time

def test_login():
    url = "http://localhost:8000/auth/login"
    payload = {
        "email": "test@example.com",
        "password": "wrong-password"
    }
    
    print(f"Testing login at {url}...")
    try:
        start_time = time.time()
        response = requests.post(url, json=payload, timeout=10)
        end_time = time.time()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Time: {end_time - start_time:.4f}s")
        
        if response.status_code in [401, 400, 404]:
            print("SUCCESS: Endpoint is alive and returned expected error for invalid credentials.")
        elif response.status_code == 200:
            print("SUCCESS: Login successful (if test user exists).")
        else:
            print(f"UNEXPECTED: Status code {response.status_code}")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("ERROR: Server is not running on localhost:8000. Manual verification required.")
    except Exception as e:
        print(f"ERROR: {str(e)}")

if __name__ == "__main__":
    test_login()
