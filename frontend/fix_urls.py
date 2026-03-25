import os

def replace_url_in_files(directory, old_url, new_url):
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if '.git' in dirs:
            dirs.remove('.git')
        for file in files:
            if file.endswith(('.jsx', '.js', '.tsx', '.ts', '.html')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    if old_url in content:
                        new_content = content.replace(old_url, new_url)
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated: {filepath}")
                except Exception as e:
                    print(f"Error processing {filepath}: {e}")

if __name__ == "__main__":
    frontend_dir = r"c:\Users\priyabrata\Desktop\iisc_Hackathon\ArtPark_CodeForge_Hackathon\frontend"
    old_url = "https://artpark-codeforge-hackathon.onrender.com"
    new_url = "http://localhost:8000"
    replace_url_in_files(frontend_dir, old_url, new_url)
