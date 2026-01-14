"""Interview and video analysis router."""
import json
from datetime import datetime
from fastapi import APIRouter, HTTPException

from core.database import supabase
from models.requests import VideoURL
from services.video_analysis import analyze_video

router = APIRouter(prefix="/api/interviews", tags=["Interviews"])


@router.post("/analyze-video")
async def analyze_video_endpoint(video: VideoURL):
    """Analyze video and store results."""
    try:
        print(f"Received request to analyze video: {video.video_url}")
        
        # Get job description if recruiter_id is provided
        job_description = None
        if video.recruiter_id:
            try:
                result = supabase.table('job_descriptions').select('description').eq(
                    'recruiter_id', video.recruiter_id
                ).execute()
                if result.data and len(result.data) > 0:
                    job_description = result.data[0].get('description')
            except Exception as e:
                print(f"Could not fetch job description: {e}")
        
        result = analyze_video(video.video_url, job_description)

        if not result:
            return {"error": "Failed to analyze video", "details": "No result returned from analysis"}

        # Store results in Supabase if user_id is provided
        if video.user_id and result:
            try:
                if video.question_index is not None:
                    # Store in the interview_answers table with question index
                    supabase.table('interview_answers').upsert({
                        'user_id': video.user_id,
                        'question_index': video.question_index,
                        'question_text': video.question_text or '',
                        'video_url': video.video_url,
                        'summary': result.get('summary', ''),
                        'transcript': result.get('transcript', ''),
                        'communication_analysis': json.dumps(result.get('communication_analysis', {})),
                        'behavioral_insights': json.dumps(result.get('behavioral_insights', {})),
                        'created_at': datetime.now().isoformat()
                    }).execute()
                    print(f"Analysis results stored for user {video.user_id}, question {video.question_index}")
            except Exception as e:
                print(f"Error storing analysis results: {str(e)}")

        return result
    except ValueError as ve:
        print(f"Value error in endpoint: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(f"Error in endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Legacy endpoint for backwards compatibility
@router.post("/analyze-video", include_in_schema=False)
async def analyze_video_legacy(video: VideoURL):
    """Legacy endpoint - redirects to new path."""
    return await analyze_video_endpoint(video)

