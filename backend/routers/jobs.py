"""Job description management router."""
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends

from core.database import supabase
from core.auth import get_current_user_id
from models.requests import JobDescriptionUpdate

router = APIRouter(prefix="/api/jobs", tags=["Job Descriptions"])


@router.post("/description")
async def update_job_description(job_desc: JobDescriptionUpdate):
    """Update job description for an interview."""
    try:
        existing = supabase.table('job_descriptions').select('id').eq(
            'recruiter_id', job_desc.recruiter_id
        ).execute()
        
        if existing.data and len(existing.data) > 0:
            # Update existing job description
            result = supabase.table('job_descriptions').update({
                "description": job_desc.description,
            }).eq('recruiter_id', job_desc.recruiter_id).execute()
        else:
            # Create new job description
            result = supabase.table('job_descriptions').insert({
                "recruiter_id": job_desc.recruiter_id,
                "description": job_desc.description,
                "created_at": datetime.now().isoformat(),
            }).execute()
        
        return {"success": True, "data": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/description/{recruiter_id}")
async def get_job_description(recruiter_id: str):
    """Get job description for an interview."""
    try:
        result = supabase.table('job_descriptions').select('description').eq(
            'recruiter_id', recruiter_id
        ).execute()
        
        if result and hasattr(result, 'data') and result.data and len(result.data) > 0:
            return {"success": True, "description": result.data[0].get('description', '')}
        return {"success": True, "description": ""}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch job description for {recruiter_id}: {str(e)}"
        )


@router.get("/description/me")
async def get_job_description_me(user_id: str = Depends(get_current_user_id)):
    """Get job description for the authenticated recruiter using Authorization header."""
    try:
        result = supabase.table('job_descriptions').select('description').eq(
            'recruiter_id', user_id
        ).execute()
        
        if result.data and len(result.data) > 0:
            return {"success": True, "description": result.data[0].get('description', '')}
        else:
            return {"success": True, "description": ""}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Legacy endpoints for backwards compatibility
@router.post("/update-job-description", include_in_schema=False)
async def update_job_description_legacy(job_desc: JobDescriptionUpdate):
    """Legacy endpoint."""
    return await update_job_description(job_desc)


@router.get("/get-job-description/{recruiter_id}", include_in_schema=False)
async def get_job_description_legacy(recruiter_id: str):
    """Legacy endpoint."""
    return await get_job_description(recruiter_id)

