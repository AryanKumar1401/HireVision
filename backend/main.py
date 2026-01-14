"""
HireVision API - Main Application Entry Point

This module initializes the FastAPI application and includes all routers.
The codebase is organized into:
- core/: Configuration, database, and authentication
- models/: Pydantic request/response models
- services/: Business logic (video analysis, email, etc.)
- routers/: API endpoint definitions
"""
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

# Initialize FastAPI app
app = FastAPI(
    title="HireVision API",
    description="AI-powered video interview analysis platform",
    version="2.0.0",
)

# Configure CORS with explicit origins (security fix)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health_router)
app.include_router(interviews_router)
app.include_router(resumes_router)
app.include_router(invites_router)
app.include_router(jobs_router)
app.include_router(chat_router)


# =============================================================================
# Legacy Endpoints (for backwards compatibility)
# These map old endpoint paths to the new router structure
# =============================================================================

from models.requests import (
    InterviewInvite,
    VideoURL,
    ResumeQuestionsRequest,
    GetPersonalizedQuestionsRequest,
    RecruiterChatRequest,
    JobDescriptionUpdate,
)
from fastapi import UploadFile, File, Form


@app.post("/send-interview-invite")
async def legacy_send_interview_invite(invite: InterviewInvite):
    """Legacy endpoint - use /api/invites/send instead."""
    from routers.invites import send_interview_invite
    return await send_interview_invite(invite)


@app.post("/analyze-video")
async def legacy_analyze_video(video: VideoURL):
    """Legacy endpoint - use /api/interviews/analyze-video instead."""
    from routers.interviews import analyze_video_endpoint
    return await analyze_video_endpoint(video)


@app.post("/upload-resume")
async def legacy_upload_resume(file: UploadFile = File(...), user_id: str = Form(...)):
    """Legacy endpoint - use /api/resumes/upload instead."""
    from routers.resumes import upload_resume
    return await upload_resume(file, user_id)


@app.post("/generate-resume-questions-from-db")
async def legacy_generate_resume_questions(request: ResumeQuestionsRequest):
    """Legacy endpoint - use /api/resumes/generate-questions instead."""
    from routers.resumes import generate_resume_questions_from_db
    return await generate_resume_questions_from_db(request)


@app.post("/get-personalized-questions")
async def legacy_get_personalized_questions(request: GetPersonalizedQuestionsRequest):
    """Legacy endpoint - use /api/resumes/get-personalized-questions instead."""
    from routers.resumes import get_personalized_questions
    return await get_personalized_questions(request)


@app.post("/recruiter-chat")
async def legacy_recruiter_chat(req: RecruiterChatRequest):
    """Legacy endpoint - use /api/chat/recruiter instead."""
    from routers.chat import recruiter_chat
    return await recruiter_chat(req)


@app.post("/update-job-description")
async def legacy_update_job_description(job_desc: JobDescriptionUpdate):
    """Legacy endpoint - use /api/jobs/description instead."""
    from routers.jobs import update_job_description
    return await update_job_description(job_desc)


@app.get("/get-job-description/{recruiter_id}")
async def legacy_get_job_description(recruiter_id: str):
    """Legacy endpoint - use /api/jobs/description/{recruiter_id} instead."""
    from routers.jobs import get_job_description
    return await get_job_description(recruiter_id)


@app.post("/manage-interview-invite")
async def legacy_manage_interview_invite(invite: InterviewInvite):
    """Legacy endpoint - use /api/invites/manage instead."""
    from routers.invites import manage_interview_invite
    return await manage_interview_invite(invite)


@app.post("/cleanup-expired-invites")
async def legacy_cleanup_expired_invites():
    """Legacy endpoint - use /api/invites/cleanup-expired instead."""
    from routers.invites import cleanup_expired_invites
    return await cleanup_expired_invites()


@app.post("/bulk-manage-invites")
async def legacy_bulk_manage_invites(invites: list[InterviewInvite]):
    """Legacy endpoint - use /api/invites/bulk instead."""
    from routers.invites import bulk_manage_invites
    return await bulk_manage_invites(invites)


@app.get("/invite-status/{invite_code}")
async def legacy_get_invite_status(invite_code: str):
    """Legacy endpoint - use /api/invites/status/{invite_code} instead."""
    from routers.invites import get_invite_status
    return await get_invite_status(invite_code)


# =============================================================================
# Application entry point
# =============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
