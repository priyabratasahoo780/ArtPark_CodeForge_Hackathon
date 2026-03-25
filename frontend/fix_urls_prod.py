import os

d = r'c:\Users\priyabrata\Desktop\iisc_Hackathon\ArtPark_CodeForge_Hackathon\frontend\src'
original_str = "const API_BASE_URL = 'http://127.0.0.1:8000'"
original_str_2 = "const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'"
new_str = "const API_BASE_URL = import.meta.env.DEV ? 'http://127.0.0.1:8000' : 'https://artpark-codeforge-hackathon.onrender.com'"

for r, _, fs in os.walk(d):
    for f in fs:
        if f.endswith(('.jsx', '.js')):
            path = os.path.join(r, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            if original_str in content or original_str_2 in content:
                content = content.replace(original_str, new_str).replace(original_str_2, new_str)
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(content)
                print(f"Updated {f}")
