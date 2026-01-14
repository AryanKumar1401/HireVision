"""Test script to verify Supabase database connection and schema."""
import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

def test_connection():
    """Test basic Supabase connection."""
    print("🔍 Testing Supabase Connection...")
    
    supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    supabase_service_key = os.getenv("SUPABASE_SERVICE_KEY")
    
    if not supabase_url or not supabase_service_key:
        print("❌ Missing environment variables!")
        print(f"   SUPABASE_URL: {'✓' if supabase_url else '✗'}")
        print(f"   SUPABASE_SERVICE_KEY: {'✓' if supabase_service_key else '✗'}")
        return False
    
    try:
        supabase: Client = create_client(supabase_url, supabase_service_key)
        print("✅ Connection established!")
        return supabase
    except Exception as e:
        print(f"❌ Connection failed: {str(e)}")
        return None

def test_tables(supabase: Client):
    """Test if key tables exist and are accessible."""
    print("\n🔍 Testing Database Tables...")
    
    tables_to_test = [
        "resumes",
        "resume_questions",
        "job_descriptions",
        "interview",
        "interview_questions",
        "interview_invites",
        "interview_participants",
        "interview_answers"
    ]
    
    results = {}
    for table in tables_to_test:
        try:
            # Try to fetch a single row (limit 1) to test table access
            result = supabase.table(table).select("*").limit(1).execute()
            results[table] = "✅ Accessible"
            print(f"   {table}: ✅ ({len(result.data) if hasattr(result, 'data') else 0} rows found)")
        except Exception as e:
            results[table] = f"❌ Error: {str(e)}"
            print(f"   {table}: ❌ {str(e)[:50]}")
    
    return results

def test_storage(supabase: Client):
    """Test Supabase Storage buckets."""
    print("\n🔍 Testing Storage Buckets...")
    
    try:
        # List buckets
        buckets = supabase.storage.list_buckets()
        if buckets:
            print(f"   ✅ Found {len(buckets)} bucket(s):")
            for bucket in buckets:
                bucket_name = bucket.get('name', 'unknown')
                print(f"      - {bucket_name}")
                
                # Check if 'resumes' bucket exists
                if bucket_name == 'resumes':
                    try:
                        files = supabase.storage.from_('resumes').list()
                        print(f"        └─ Contains {len(files)} file(s)")
                    except Exception as e:
                        print(f"        └─ ⚠️  Cannot list files: {str(e)[:50]}")
            return True
        else:
            print("   ⚠️  No storage buckets found")
            return False
    except Exception as e:
        print(f"   ❌ Storage test failed: {str(e)}")
        return False

def test_sample_queries(supabase: Client):
    """Test sample queries on key tables."""
    print("\n🔍 Testing Sample Queries...")
    
    try:
        # Test counting records in key tables
        print("\n   Record Counts:")
        
        # Count resumes
        result = supabase.table("resumes").select("*", count="exact").execute()
        resume_count = result.count if hasattr(result, 'count') else 0
        print(f"      Resumes: {resume_count}")
        
        # Count interviews
        result = supabase.table("interview").select("*", count="exact").execute()
        interview_count = result.count if hasattr(result, 'count') else 0
        print(f"      Interviews: {interview_count}")
        
        # Count interview answers
        result = supabase.table("interview_answers").select("*", count="exact").execute()
        answer_count = result.count if hasattr(result, 'count') else 0
        print(f"      Interview Answers: {answer_count}")
        
        print("\n   ✅ Queries executed successfully!")
        return True
        
    except Exception as e:
        print(f"   ❌ Query test failed: {str(e)}")
        return False

def test_auth_config():
    """Test authentication configuration."""
    print("\n🔍 Testing Auth Configuration...")
    
    jwt_secret = os.getenv("SUPABASE_JWT_SECRET")
    anon_key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    
    print(f"   JWT Secret: {'✅ Set' if jwt_secret else '❌ Missing'}")
    print(f"   Anon Key: {'✅ Set' if anon_key else '❌ Missing'}")
    
    return bool(jwt_secret and anon_key)

def main():
    """Run all database tests."""
    print("=" * 60)
    print("   HireVision Database Connection Test")
    print("=" * 60)
    
    # Test connection
    supabase = test_connection()
    if not supabase:
        print("\n❌ Cannot proceed without database connection")
        sys.exit(1)
    
    # Test tables
    table_results = test_tables(supabase)
    
    # Test storage
    storage_ok = test_storage(supabase)
    
    # Test queries
    query_ok = test_sample_queries(supabase)
    
    # Test auth
    auth_ok = test_auth_config()
    
    # Summary
    print("\n" + "=" * 60)
    print("   Test Summary")
    print("=" * 60)
    
    all_tables_ok = all("✅" in str(v) for v in table_results.values())
    
    print(f"   Database Connection: ✅")
    print(f"   Tables Accessible: {'✅' if all_tables_ok else '⚠️  Some issues found'}")
    print(f"   Storage Buckets: {'✅' if storage_ok else '⚠️  Issues found'}")
    print(f"   Sample Queries: {'✅' if query_ok else '⚠️  Issues found'}")
    print(f"   Auth Config: {'✅' if auth_ok else '⚠️  Incomplete'}")
    
    if all_tables_ok and storage_ok and query_ok and auth_ok:
        print("\n🎉 All tests passed! Database is properly configured.")
        sys.exit(0)
    else:
        print("\n⚠️  Some tests failed. Check the details above.")
        sys.exit(1)

if __name__ == "__main__":
    main()