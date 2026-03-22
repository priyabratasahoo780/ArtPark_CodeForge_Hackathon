"""Test PDF extraction endpoint with the two sample PDF files."""
import urllib.request
import urllib.error
import json
import os

BASE_URL = "http://localhost:8000"

def upload_pdf(filepath, label):
    filename = os.path.basename(filepath)
    boundary = "----FormBoundaryPDFTest1234"

    with open(filepath, "rb") as f:
        file_content = f.read()

    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'
        f"Content-Type: application/pdf\r\n\r\n"
    ).encode("utf-8") + file_content + f"\r\n--{boundary}--\r\n".encode("utf-8")

    req = urllib.request.Request(
        f"{BASE_URL}/extract/text",
        data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            print(f"\n{'='*60}")
            print(f" [{label}] {filename}")
            print(f" Chars extracted: {data['chars']}")
            print(f"{'='*60}")
            print(data["text"][:800])
            print("...")
            return data["text"]
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"\n[ERROR] {label}: HTTP {e.code} - {error_body}")
        return None
    except Exception as e:
        print(f"\n[ERROR] {label}: {e}")
        return None

print("Testing PDF extraction endpoint...")
print(f"Backend: {BASE_URL}")

resume_path = r"c:\Users\priyabrata\Desktop\iisc_Hackathon\ArtPark_CodeForge_Hackathon\docs\images\Jagjeet Dangar Resume.pdf"
jd_path = r"c:\Users\priyabrata\Desktop\iisc_Hackathon\ArtPark_CodeForge_Hackathon\docs\images\Vasara Sujal Resume (6).pdf"

resume_text = upload_pdf(resume_path, "RESUME (Jagjeet Dangar)")
jd_text = upload_pdf(jd_path, "JD / Resume 2 (Vasara Sujal)")

if resume_text and jd_text:
    print("\n\n" + "="*60)
    print(" BOTH PDFs EXTRACTED SUCCESSFULLY!")
    print(f" Resume length: {len(resume_text)} chars")
    print(f" JD length:     {len(jd_text)} chars")
    print(" PDF upload fix is working correctly.")
    print("="*60)
else:
    print("\n[PARTIAL FAILURE] Check errors above.")
