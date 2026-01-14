"""Request models for HireVision API."""
from pydantic import BaseModel, EmailStr
from typing import Optional


class InterviewInvite(BaseModel):
    """Model for interview invitation request."""
    email: EmailStr
    invite_code: str
    interview_title: str
    recruiter_name: str


class VideoURL(BaseModel):
    """Model for video analysis request."""
    video_url: str
    user_id: Optional[str] = None
    question_index: Optional[int] = None
    question_text: Optional[str] = None
    recruiter_id: Optional[str] = None  # Added to fix the undefined variable bug


class ResumeText(BaseModel):
    """Model for resume text submission."""
    resume_text: str
    user_id: Optional[str] = None


class ResumeQuestionsRequest(BaseModel):
    """Model for generating questions from resume."""
    user_id: str


class GetPersonalizedQuestionsRequest(BaseModel):
    """Model for fetching personalized questions."""
    user_id: str


class RecruiterChatRequest(BaseModel):
    """Model for recruiter chat request."""
    prompt: str
    recruiter_id: Optional[str] = None


class JobDescriptionUpdate(BaseModel):
    """Model for updating job description."""
    recruiter_id: str
    description: str

