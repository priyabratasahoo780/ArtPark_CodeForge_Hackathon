import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client

# Add app directory to path to use existing client if possible
sys.path.append(os.path.join(os.getcwd(), 'app'))

def test_connection():
    load_dotenv()
    
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    service_key = os.environ.get("SUPABASE_SERVICE_KEY")
    
    if not url or not key:
        print("❌ Error: SUPABASE_URL or SUPABASE_KEY missing in .env")
        return

    print(f"Connecting to: {url}...")
    
    try:
        with open("supabase_test_result.txt", "w", encoding="utf-8") as f:
            f.write(f"Connecting to: {url}\n")
            
            # Test 1: Standard Client (Anon Key)
            supabase: Client = create_client(url, key)
            f.write("Testing Anon Client...\n")
            # Try a simple request - even if no tables exist, we should get a valid response
            response = supabase.table("users").select("count", count="exact").limit(0).execute()
            f.write("✅ Anon Client Connected successfully!\n")
            
            # Test 2: Admin Client (Service Key)
            if service_key:
                f.write("\nTesting Admin Client...\n")
                supabase_admin: Client = create_client(url, service_key)
                response_admin = supabase_admin.table("users").select("count", count="exact").limit(0).execute()
                f.write("✅ Admin Client Connected successfully!\n")
            else:
                f.write("\n⚠️ Service Key missing, skipping Admin Client test.\n")
            
            print("Tests completed. Check supabase_test_result.txt")

    except Exception as e:
        with open("supabase_test_result.txt", "a", encoding="utf-8") as f:
            f.write(f"\n❌ Connection failed: {str(e)}\n")
            if "relation \"public.users\" does not exist" in str(e):
                f.write("\n💡 Tip: The connection is working, but you haven't executed the schema yet!\n")
                f.write("Please run the supabase_schema.sql in your Supabase SQL Editor.\n")
        print(f"Tests failed. Check supabase_test_result.txt")

if __name__ == "__main__":
    test_connection()
