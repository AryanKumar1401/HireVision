"""API routers for HireVision backend."""
from .interviews import router as interviews_router
from .resumes import router as resumes_router
from .invites import router as invites_router
from .jobs import router as jobs_router
from .chat import router as chat_router
from .health import router as health_router

__all__ = [
    "interviews_router",
    "resumes_router", 
    "invites_router",
    "jobs_router",
    "chat_router",
    "health_router",
]

