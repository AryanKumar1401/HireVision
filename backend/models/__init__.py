"""Pydantic models for HireVision API."""
from .requests import (
    InterviewInvite,
    VideoURL,
    ResumeText,
    ResumeQuestionsRequest,
    GetPersonalizedQuestionsRequest,
    RecruiterChatRequest,
    JobDescriptionUpdate,
)

__all__ = [
    "InterviewInvite",
    "VideoURL",
    "ResumeText",
    "ResumeQuestionsRequest",
    "GetPersonalizedQuestionsRequest",
    "RecruiterChatRequest",
    "JobDescriptionUpdate",
]

