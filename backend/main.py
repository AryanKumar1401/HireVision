from datetime import datetime, timedelta
import assemblyai as aai  
from supabase import create_client, Client
from openai import OpenAI
from dotenv import load_dotenv
import os
import time
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import spacy
import json
from services.sentiment import summarize_text, generate_behavioral_scores, analyze_communication, generate_behavioral_insights
from services.resume_parser import ResumeParser
import requests
import subprocess
import librosa
import numpy as np
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Load environment variables
load_dotenv()
ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLY")
OPEN_AI_API_KEY = os.getenv("OPEN_AI_API_KEY")
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")  # Add this to your .env file

# Initialize services
aai.settings.api_key = ASSEMBLYAI_API_KEY
transcriber = aai.Transcriber()
client = OpenAI(api_key=OPEN_AI_API_KEY)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
nlp = spacy.load("en_core_web_sm")

# FastAPI app setup
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class InterviewInvite(BaseModel):
    email: EmailStr
    invite_code: str
    interview_title: str
    recruiter_name: str

class VideoURL(BaseModel):
    video_url: str
    user_id: str = None
    question_index: int = None
    question_text: str = None

class ResumeText(BaseModel):
    resume_text: str
    user_id: str = None

def extract_main_themes(transcript: str, num_themes: int = 4) -> list:
    prompt = (
        f"Extract {num_themes} main themes from the following transcript. "
        "Make sure each theme is a short descriptive phrase.\n\n"
        f"Transcript: {transcript}\n\n"
        "Themes (comma-separated):"
    )

    response = client.completions.create(engine="text-davinci-003",  # or another suitable engine
    prompt=prompt,
    max_tokens=100,
    temperature=0.5)

    raw_themes = response.choices[0].text.strip()
    # Split and clean the themes
    themes = [theme.strip() for theme in raw_themes.split(",") if theme.strip()]
    return themes[:num_themes]

def detect_enthusiasm(audio_file: str, sr: int = 22050, energy_threshold: float = 0.6) -> list:
    """
    Given an audio file, return a list of timestamps (in seconds) where the energy peaks.
    This is a simplistic approach; you can adapt it to use pitch or a pretrained model.
    """
    # Load the audio file
    y, sr = librosa.load(audio_file, sr=sr)

    # Compute RMS energy for short frames
    hop_length = 512
    frame_length = 1024
    rms = librosa.feature.rms(y=y, frame_length=frame_length, hop_length=hop_length)[0]

    # Normalize energy to 0-1 range
    rms_norm = (rms - np.min(rms)) / (np.max(rms) - np.min(rms) + 1e-6)

    # Identify frames where normalized energy exceeds the threshold
    enthusiastic_frames = np.where(rms_norm > energy_threshold)[0]

    # Convert frame indices to timestamps
    timestamps = librosa.frames_to_time(enthusiastic_frames, sr=sr, hop_length=hop_length)
    # Optionally, filter out timestamps that are close together
    filtered_timestamps = []
    prev = -999
    for t in timestamps:
        if t - prev > 1.0:  # at least 1 second apart
            filtered_timestamps.append(round(t, 2))
            prev = t
    return filtered_timestamps

def extract_audio_from_video(video_url: str, output_audio: str) -> None:
    """
    Extract audio from a video URL and save it to output_audio.
    This example assumes that the video_url is accessible to ffmpeg.
    """
    command = f"ffmpeg -y -i {video_url} -q:a 0 -map a {output_audio}"
    subprocess.run(command, shell=True, check=True)

def analyze_video(video_url: str):
    """Analyze video and return comprehensive results"""
    try:
        print(f"Attempting to transcribe video from URL: {video_url}")
        if not video_url or not video_url.startswith('http'):
            raise ValueError("Invalid video URL format")

        # Transcribe the video file
        transcript = transcriber.transcribe(video_url)

        # Check if transcript exists and has text
        if not transcript or not hasattr(transcript, 'text') or not transcript.text:
            print("Transcription failed or returned empty result")
            return {
                "summary": "Transcription could not be completed. Only basic analysis is available.",
                "filename": f"summary_{abs(hash(video_url))}.txt",
                "transcript": "",
                "behavioral_scores": {},
                "communication_analysis": {},
                "enthusiasm_timestamps": [],
                "behavioral_insights": {}
            }

        print(f"Transcription successful. Length: {len(transcript.text)}")

        # Process transcript
        transcript_text = transcript.text
        summary = summarize_text(transcript_text)
        behavioral_scores = generate_behavioral_scores(summary)
        communication_analysis = analyze_communication(summary)
        behavioral_insights = generate_behavioral_insights(summary)

        # Save summary to file
        os.makedirs("txt_files", exist_ok=True)
        filename = f"summary_{abs(hash(video_url))}.txt"
        with open(os.path.join("txt_files", filename), "w") as file:
            file.write(summary)
        
        return {
            "summary": summary,
            "filename": filename,
            "transcript": transcript_text,
            "behavioral_scores": behavioral_scores,
            "communication_analysis": communication_analysis,
            "enthusiasm_timestamps": [],
            "behavioral_insights": behavioral_insights
        }

    except Exception as e:
        print(f"Error in video analysis: {str(e)}")
        return {
            "summary": f"Error analyzing video: {str(e)}",
            "filename": "",
            "transcript": "",
            "behavioral_scores": {},
            "communication_analysis": {},
            "enthusiasm_timestamps": [],
            "behavioral_insights": {}
        }

def send_interview_invite_email(invite: InterviewInvite):
    """Send interview invitation email using Gmail SMTP"""
    try:
        # Gmail SMTP configuration
        GMAIL_USER = os.getenv("GMAIL_USER")  # Your Gmail address
        GMAIL_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")  # Gmail App Password
        
        if not GMAIL_USER or not GMAIL_PASSWORD:
            print("Gmail credentials not configured. Falling back to simulation mode.")
            print(f"=== EMAIL SIMULATION (No Gmail Config) ===")
            print(f"To: {invite.email}")
            print(f"Subject: Interview Invitation: {invite.interview_title}")
            print(f"Content: Interview code {invite.invite_code} for {invite.interview_title}")
            print(f"=== END EMAIL SIMULATION ===")
            return {"success": True, "message": f"Interview invitation simulated for {invite.email}"}
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"Interview Invitation: {invite.interview_title}"
        msg['From'] = GMAIL_USER
        msg['To'] = invite.email
        
        # HTML content
        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Interview Invitation</h2>
            <p>Hello,</p>
            <p>You have been invited to participate in an interview: <strong>{invite.interview_title}</strong></p>
            <p>Your unique interview code is: <strong style="font-size: 18px; color: #2563eb;">{invite.invite_code}</strong></p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>To access your interview:</h3>
                <ol>
                    <li>Visit: <a href="http://localhost:3000/candidates">http://localhost:3000/candidates</a></li>
                    <li>If you have an account, log in and use the 'Add Interview' button</li>
                    <li>If you don't have an account, sign up and then use the 'Add Interview' button</li>
                    <li>Enter your interview code: <strong>{invite.invite_code}</strong></li>
                </ol>
            </div>
            <p>Please complete your interview within the specified timeframe.</p>
            <p>Best regards,<br><strong>{invite.recruiter_name}</strong></p>
        </div>
        """
        
        # Plain text content (fallback)
        text_content = f"""
        Interview Invitation
        
        Hello,
        
        You have been invited to participate in an interview: {invite.interview_title}
        
        Your unique interview code is: {invite.invite_code}
        
        To access your interview:
        1. Visit: http://localhost:3000/candidates
        2. If you have an account, log in and use the 'Add Interview' button
        3. If you don't have an account, sign up and then use the 'Add Interview' button
        4. Enter your interview code: {invite.invite_code}
        
        Please complete your interview within the specified timeframe.
        
        Best regards,
        {invite.recruiter_name}
        """
        
        # Attach both HTML and text versions
        text_part = MIMEText(text_content, 'plain')
        html_part = MIMEText(html_content, 'html')
        
        msg.attach(text_part)
        msg.attach(html_part)
        
        # Send email via Gmail SMTP
        try:
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(GMAIL_USER, GMAIL_PASSWORD)
            
            server.send_message(msg)
            server.quit()
            
            print(f"✅ Email sent successfully to {invite.email}")
            return {"success": True, "message": f"Interview invitation sent to {invite.email}"}
            
        except smtplib.SMTPAuthenticationError:
            print(f"❌ Gmail authentication failed for {invite.email}")
            return {"success": False, "message": "Gmail authentication failed. Please check your credentials."}
        except smtplib.SMTPException as e:
            print(f"❌ SMTP error for {invite.email}: {str(e)}")
            return {"success": False, "message": f"SMTP error: {str(e)}"}
        except Exception as e:
            print(f"❌ Unexpected error sending email to {invite.email}: {str(e)}")
            return {"success": False, "message": f"Unexpected error: {str(e)}"}
            
    except Exception as e:
        print(f"Email error: {str(e)}")
        # Fallback to simulation mode
        print(f"=== EMAIL SIMULATION (Error Fallback) ===")
        print(f"To: {invite.email}")
        print(f"Subject: Interview Invitation: {invite.interview_title}")
        print(f"Content: Interview code {invite.invite_code} for {invite.interview_title}")
        print(f"=== END EMAIL SIMULATION ===")
        return {"success": True, "message": f"Interview invitation simulated for {invite.email}"}

# API endpoints
@app.post("/send-interview-invite")
async def send_interview_invite(invite: InterviewInvite):
    """Send interview invitation email"""
    try:
        return send_interview_invite_email(invite)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-video")
async def analyze_video_endpoint(video: VideoURL):
    """Analyze video and store results"""
    try:
        print(f"Received request to analyze video: {video.video_url}")
        result = analyze_video(video.video_url)

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

@app.post("/generate-resume-questions")
async def generate_resume_questions(resume_data: ResumeText):
    """Generate questions from resume text"""
    try:
        parser = ResumeParser()
        result = parser.parse_resume_and_generate_questions(resume_data.resume_text)
        
        # Store the generated questions in the database if user_id is provided

        #TODO Table resume_questions doesn't exist in Supabase, create it
        if resume_data.user_id and result.get('experiences'):
            try:
                for i, experience in enumerate(result['experiences']):
                    supabase.table('resume_questions').insert({
                        'user_id': resume_data.user_id,
                        'experience_index': i,
                        'company': experience['company'],
                        'title': experience['title'],
                        'dates': experience['dates'],
                        'bullets': json.dumps(experience['bullets']),
                        'questions': json.dumps(experience['questions']),
                        'created_at': datetime.now().isoformat()
                    }).execute()
                print(f"Resume questions stored for user {resume_data.user_id}")
            except Exception as e:
                print(f"Error storing resume questions: {str(e)}")
        
        return result
    except Exception as e:
        print(f"Error generating resume questions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "HireVision API"}

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...), user_id: str = Form(...)):
    """Upload resume file to Supabase storage"""
    # Validate file type
    ACCEPTED_RESUME_TYPES = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "text/rtf"
    ]
    MAX_RESUME_SIZE_MB = 5
    
    if file.content_type not in ACCEPTED_RESUME_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF, DOCX, and RTF are allowed.")
    
    # Validate file size
    contents = await file.read()
    if len(contents) > MAX_RESUME_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File too large. Max size is {MAX_RESUME_SIZE_MB}MB.")
    
    # Upload to Supabase Storage
    filename = f"{user_id}_{int(time.time())}_{file.filename}"
    try:
        storage_response = supabase.storage.from_('resumes').upload(filename, contents, {"content-type": file.content_type})
        public_url = supabase.storage.from_('resumes').get_public_url(filename)
        
        result = supabase.table("resumes").insert({
            "user_id": user_id,
            "filename": filename,
            "file_path": public_url,
            "original_name": file.filename,
            "mime_type": file.content_type,
            "uploaded_at": datetime.utcnow().isoformat()
        }).execute()
        
        db_record = result.data[0] if hasattr(result, 'data') and result.data else None
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload resume: {str(e)}")
    
    return {"success": True, "file_path": public_url, "filename": filename, "db_record": db_record}

@app.post("/manage-interview-invite")
async def manage_interview_invite(invite: InterviewInvite):
    """Manage interview invitation - update existing or create new"""
    try:
        # Check if there's an existing invite for this email and interview
        # First, we need to get the interview_id from the invite_code or other means
        # For now, we'll assume the frontend sends the interview_id as well
        
        # This is a simplified version - in practice, you might want to pass interview_id
        # or use a different approach to identify the specific interview
        
        # For now, let's just send the email and let the frontend handle the database logic
        return send_interview_invite_email(invite)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/cleanup-expired-invites")
async def cleanup_expired_invites():
    """Clean up expired interview invites (older than 30 days)"""
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

@app.post("/bulk-manage-invites")
async def bulk_manage_invites(invites: list[InterviewInvite]):
    """Handle multiple interview invites with automatic duplicate management"""
    try:
        results = []
        
        for invite in invites:
            # For each invite, we'll send the email
            # The frontend will handle the database logic for duplicates
            email_result = send_interview_invite_email(invite)
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

@app.get("/invite-status/{invite_code}")
async def get_invite_status(invite_code: str):
    """Get the status of an interview invite"""
    try:
        result = supabase.table('interview_invites').select(
            'id, email, status, created_at, interview_id, interviews(title, description)'
        ).eq('invite_code', invite_code).single().execute()
        
        if not result.data:
            return {"valid": False, "message": "Invalid invite code"}
        
        invite = result.data
        
        # Check if invite is expired (older than 30 days)
        invite_date = datetime.fromisoformat(invite['created_at'].replace('Z', '+00:00'))
        thirty_days_ago = datetime.now() - timedelta(days=30)
        
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

