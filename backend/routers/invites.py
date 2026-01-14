"""Interview invitation management router."""
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException

from core.database import supabase
from models.requests import InterviewInvite
from services.email_service import send_interview_invite_email

router = APIRouter(prefix="/api/invites", tags=["Invitations"])


@router.post("/send")
async def send_interview_invite(invite: InterviewInvite):
    """Send interview invitation email."""
    try:
        return send_interview_invite_email(
            email=invite.email,
            invite_code=invite.invite_code,
            interview_title=invite.interview_title,
            recruiter_name=invite.recruiter_name
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/manage")
async def manage_interview_invite(invite: InterviewInvite):
    """Manage interview invitation - update existing or create new."""
    try:
        return send_interview_invite_email(
            email=invite.email,
            invite_code=invite.invite_code,
            interview_title=invite.interview_title,
            recruiter_name=invite.recruiter_name
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/bulk")
async def bulk_manage_invites(invites: list[InterviewInvite]):
    """Handle multiple interview invites with automatic duplicate management."""
    try:
        results = []
        
        for invite in invites:
            email_result = send_interview_invite_email(
                email=invite.email,
                invite_code=invite.invite_code,
                interview_title=invite.interview_title,
                recruiter_name=invite.recruiter_name
            )
            results.append({
                "email": invite.email,
                "success": email_result.get("success", False),
                "message": email_result.get("message", "Unknown error")
            })
        
        return {
            "success": True,
            "results": results,
            "total_sent": len([r for r in results if r["success"]]),
            "total_failed": len([r for r in results if not r["success"]])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status/{invite_code}")
async def get_invite_status(invite_code: str):
    """Get the status of an interview invite."""
    try:
        result = supabase.table('interview_invites').select(
            'id, email, status, created_at, interview_id, interviews(title, description)'
        ).eq('invite_code', invite_code).single().execute()
        
        if not result.data:
            return {"valid": False, "message": "Invalid invite code"}
        
        invite = result.data
        
        # Check if invite is expired (older than 30 days)
        invite_date = datetime.fromisoformat(invite['created_at'].replace('Z', '+00:00'))
        thirty_days_ago = datetime.now(invite_date.tzinfo) - timedelta(days=30)
        
        if invite_date < thirty_days_ago and invite['status'] == 'pending':
            # Update status to expired
            supabase.table('interview_invites').update({
                'status': 'expired'
            }).eq('id', invite['id']).execute()
            invite['status'] = 'expired'
        
        return {
            "valid": True,
            "status": invite['status'],
            "email": invite['email'],
            "created_at": invite['created_at'],
            "interview": invite['interviews'],
            "expired": invite['status'] == 'expired'
        }
    except Exception as e:
        return {"valid": False, "message": f"Error checking invite status: {str(e)}"}


@router.post("/cleanup-expired")
async def cleanup_expired_invites():
    """Clean up expired interview invites (older than 30 days)."""
    try:
        # Calculate date 30 days ago
        thirty_days_ago = datetime.now() - timedelta(days=30)
        
        # Update expired invites
        result = supabase.table('interview_invites').update({
            'status': 'expired'
        }).lt('created_at', thirty_days_ago.isoformat()).eq('status', 'pending').execute()
        
        return {
            "success": True, 
            "message": f"Cleaned up {len(result.data) if result.data else 0} expired invites",
            "expired_count": len(result.data) if result.data else 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Legacy endpoints for backwards compatibility
@router.post("/send-interview-invite", include_in_schema=False)
async def send_interview_invite_legacy(invite: InterviewInvite):
    """Legacy endpoint."""
    return await send_interview_invite(invite)

