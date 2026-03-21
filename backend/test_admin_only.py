import os
from dotenv import load_dotenv
from supabase import create_client, Client

def test_admin_connection():
    load_dotenv()
    url = os.environ.get("SUPABASE_URL")
    service_key = os.environ.get("SUPABASE_SERVICE_KEY")
    
    if not url or not service_key:
        print("❌ Error: SUPABASE_URL or SUPABASE_SERVICE_KEY missing")
        return

    try:
        supabase_admin: Client = create_client(url, service_key)
        # Bypasses RLS, so this should work if credentials are valid and network is open
        response = supabase_admin.table("users").select("count", count="exact").limit(0).execute()
        print("✅ ADMIN CONNECTION SUCCESSFUL!")
        print(f"Server response: {response.count} users found (schema is likely initialized).")
    except Exception as e:
        print(f"❌ ADMIN CONNECTION FAILED: {str(e)}")

if __name__ == "__main__":
    test_admin_connection()
