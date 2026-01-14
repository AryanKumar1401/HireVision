"""Database client setup for Supabase."""
from supabase import create_client, Client
from .config import settings

# Initialize Supabase client with service key for admin operations
supabase: Client = create_client(settings.supabase_url, settings.supabase_service_key)


def get_supabase() -> Client:
    """Dependency to get Supabase client."""
    return supabase

