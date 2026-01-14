"""Main FastAPI application for HireVision backend."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from routers import (
    interviews_router,
    resumes_router,
    invites_router,
    jobs_router,
    chat_router,
    health_router,
)

# Create FastAPI app
app = FastAPI(
    title="HireVision API",
    description="AI-powered video interview platform API",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health_router)
app.include_router(interviews_router, prefix="/api")
app.include_router(resumes_router, prefix="/api")
app.include_router(invites_router, prefix="/api")
app.include_router(jobs_router, prefix="/api")
app.include_router(chat_router, prefix="/api")


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to HireVision API",
        "docs": "/docs",
        "health": "/health",
    }


if __name__ == "__main__":
    import uvicorn
    import os
    
    port = int(os.getenv("PORT", 8000))
    reload = os.getenv("ENV", "development") == "development"
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=reload,
    )
