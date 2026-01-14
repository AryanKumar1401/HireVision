"""Configuration management for HireVision backend."""
import os
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()


class Settings(BaseModel):
    """Application settings loaded from environment variables."""
    
    # API Keys
    assemblyai_api_key: str = os.getenv("ASSEMBLY", "")
    openai_api_key: str = os.getenv("OPEN_AI_API_KEY", "")
    
    # Supabase
    supabase_url: str = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")
    supabase_anon_key: str = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")
    supabase_service_key: str = os.getenv("SUPABASE_SERVICE_KEY", "")
    supabase_jwt_secret: str = os.getenv("SUPABASE_JWT_SECRET", "")
    
    # Email
    gmail_user: str = os.getenv("GMAIL_USER", "")
    gmail_app_password: str = os.getenv("GMAIL_APP_PASSWORD", "")
    
    # CORS - Add your production domains here
    cors_origins: list[str] = ["*"]
    class Config:
        env_file = ".env"


settings = Settings()

