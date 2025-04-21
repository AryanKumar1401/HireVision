from datetime import datetime
import assemblyai as aai  
from supabase import create_client, Client
from openai import OpenAI
from dotenv import load_dotenv
import os
import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import spacy
import json
from services.emotion_recognition import analyze_emotions_from_url
from services.sentiment import summarize_text, generate_behavioral_scores_rule_based, analyze_communication, generate_behavioral_scores
nlp = spacy.load("en_core_web_sm")

# Directly setting the API keys (not recommended for production)
load_dotenv()
ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLY")
OPEN_AI_API_KEY = os.getenv("OPEN_AI_API_KEY")
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")  # Add this to your .env file

aai.settings.api_key = ASSEMBLYAI_API_KEY
transcriber = aai.Transcriber()

client = OpenAI(api_key=OPEN_AI_API_KEY)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class Invite(BaseModel):
    email: EmailStr

class VideoURL(BaseModel):
    video_url: str
    user_id: str = None
    question_index: int = None
    question_text: str = None
 
def analyze_video(video_url: str):
    try:
        print(f"Attempting to transcribe video from URL: {video_url}")
        # Check if URL is accessible
        if not video_url or not video_url.startswith('http'):
            raise ValueError("Invalid video URL format")
            
        # Transcribe the video file
        transcript = transcriber.transcribe(video_url)
        
        # Check if transcript exists and has text
        if not transcript or not hasattr(transcript, 'text') or not transcript.text:
            # Return a partial analysis without transcript-dependent parts
            print("Transcription failed or returned empty result")
            emotion_results = analyze_emotions_from_url(video_url, 10)
            
            return {
                "summary": "Transcription could not be completed. Only emotion analysis is available.",
                "filename": f"summary_{abs(hash(video_url))}.txt",
                "transcript": "",
                "behavioral_scores": {},
                "communication_analysis": {},
                "emotion_results": emotion_results
            }
            
        print(f"Transcription successful. Length: {len(transcript.text)}")
        print(f"Transcription text: {transcript.text[:100]}...")  # Print first 100 characters for debugging
        
        # Get the summary and behavioral analysis
        transcript_text = transcript.text
        summary = summarize_text(transcript_text)
        behavioral_scores = generate_behavioral_scores(summary)
        communication_analysis = analyze_communication(summary)
        emotion_results = analyze_emotions_from_url(video_url, 10)
        
        # Create txt_files directory if it doesn't exist
        os.makedirs("txt_files", exist_ok=True)
        
        # Generate a unique filename
        filename = f"summary_{abs(hash(video_url))}.txt"
        file_path = os.path.join("txt_files", filename)
        
        # Write the summary to a file
        with open(file_path, "w") as file:
            file.write(summary)

        return {
            "summary": summary,
            "filename": filename,
            "transcript": transcript_text,
            "behavioral_scores": behavioral_scores,
            "communication_analysis": communication_analysis,
            "emotion_results": emotion_results
        }
    except Exception as e:
        print(f"Error in analyze_video: {str(e)}")
        # Return a minimal response with the error message
        return {
            "summary": f"Error analyzing video: {str(e)}",
            "filename": "",
            "transcript": "",
            "behavioral_scores": {},
            "communication_analysis": {},
            "emotion_results": {}
        }

@app.post("/invite")
async def invite_cand(invite: Invite):
    """
    Endpoint for sending invite to candidates through supabase native email system api call 
    """
    try:
        # The Python client doesn't accept redirect_to parameter
        result = supabase.auth.admin.invite_user_by_email(invite.email)
        
        # Store the invite in the database
        supabase.table("candidate_invites").insert(
            {
                "email": invite.email,
                "status": "sent",
            }
        ).execute()
        
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-video")
async def analyze_video_endpoint(video: VideoURL):
    try:
        print(f"Received request to analyze video: {video.video_url}")
        result = analyze_video(video.video_url)
        
        # If result is None, return an appropriate error
        if not result:
            return {"error": "Failed to analyze video", "details": "No result returned from analysis"}
        
        # Store results in Supabase if user_id is provided
        if video.user_id and result:
            try:
                # Check if we have a question index (multi-question mode)
                if video.question_index is not None:
                    # Store in the interview_answers table with question index
                    supabase.table('interview_answers').upsert({
                        'user_id': video.user_id,
                        'question_index': video.question_index,
                        'question_text': video.question_text or '',
                        'video_url': video.video_url,
                        'summary': result.get('summary', ''),
                        'transcript': result.get('transcript', ''),
                        'behavioral_scores': json.dumps(result.get('behavioral_scores', {})),
                        'communication_analysis': json.dumps(result.get('communication_analysis', {})),
                        'emotion_results': json.dumps(result.get('emotion_results', {})),
                        'created_at': datetime.now().isoformat()
                    }).execute()
                    
                    print(f"Analysis results stored for user {video.user_id}, question {video.question_index}")
                else:
                    # Legacy single-question mode - store in analysis_results
                    supabase.table('analysis_results').upsert({
                        'id': video.user_id,
                        'summary': result.get('summary', ''),
                        'transcript': result.get('transcript', ''),
                        'behavioral_scores': json.dumps(result.get('behavioral_scores', {})),
                        'communication_analysis': json.dumps(result.get('communication_analysis', {})),
                        'emotion_results': json.dumps(result.get('emotion_results', {})),
                        'updated_at': datetime.now().isoformat()
                    }).execute()
                    
                    print(f"Analysis results stored for user {video.user_id}")
            except Exception as e:
                print(f"Error storing analysis results: {str(e)}")
                # Continue anyway to return results
        
        return result
    except ValueError as ve:
        print(f"Value error in endpoint: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(f"Error in endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "HireVision API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

