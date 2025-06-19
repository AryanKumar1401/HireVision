from datetime import datetime
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
# Removed emotion_recognition import
from services.sentiment import summarize_text, generate_behavioral_scores_rule_based, analyze_communication, generate_behavioral_scores
from services.resume_parser import ResumeParser
from email.message import EmailMessage
import smtplib
import re
from email.utils import parseaddr
import librosa
import numpy as np
import shutil

# Function to generate placeholder emotion data instead of using facial recognition
def generate_placeholder_emotion_data():
    return {
        "summary": {
            "total_frames_analyzed": 0,
            "dominant_emotion": "neutral",
            "dominant_emotion_confidence": 0.7,
            "average_emotions": {
                "angry": 0.05, 
                "disgust": 0.02, 
                "fear": 0.03,
                "happy": 0.15, 
                "sad": 0.05, 
                "surprise": 0.10, 
                "neutral": 0.60
            }
        },
        "detailed_results": []
    }

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
    try:
        print(f"Attempting to transcribe video from URL: {video_url}")
        if not video_url or not video_url.startswith('http'):
            raise ValueError("Invalid video URL format")

        # Transcribe the video file
        transcript = transcriber.transcribe(video_url)

        # Check if transcript exists and has text
        if not transcript or not hasattr(transcript, 'text') or not transcript.text:
            print("Transcription failed or returned empty result")

            # Replace emotion analysis with placeholder data
            emotion_results = generate_placeholder_emotion_data()

            return {
                "summary": "Transcription could not be completed. Only basic analysis is available.",
                "filename": f"summary_{abs(hash(video_url))}.txt",
                "transcript": "",
                "behavioral_scores": {},
                "communication_analysis": {},
                "emotion_results": emotion_results,
                "enthusiasm_timestamps": []
            }

        print(f"Transcription successful. Length: {len(transcript.text)}")
        print(f"Transcription text: {transcript.text[:100]}...")  # Print first 100 characters for debugging

        # Get transcript text etc.
        transcript_text = transcript.text
        summary = summarize_text(transcript_text)
        behavioral_scores = generate_behavioral_scores(summary)
        communication_analysis = analyze_communication(summary)

        # Replace emotion analysis with placeholder data
        emotion_results = generate_placeholder_emotion_data()

        # Extract main themes from the transcript
        #main_themes = extract_main_themes(transcript_text, num_themes=4)

        # Create txt_files directory if it doesn't exist
        os.makedirs("txt_files", exist_ok=True)

        # Generate a unique filename
        filename = f"summary_{abs(hash(video_url))}.txt"
        file_path = os.path.join("txt_files", filename)

        # Write the summary to a file
        with open(os.path.join("txt_files", filename), "w") as file:
            file.write(summary)
        
        # Extract audio from video and then detect enthusiastic moments
        try:
            extract_audio_from_video(video_url, audio_filename)
            enthusiasm_timestamps = detect_enthusiasm(audio_filename)
        except Exception as audio_e:
            print(f"Audio extraction/analysis failed: {str(audio_e)}")
            enthusiasm_timestamps = []
        
        return {
            "summary": summary,
            "filename": filename,
            "transcript": transcript_text,
            "behavioral_scores": behavioral_scores,
            "communication_analysis": communication_analysis,
            "emotion_results": emotion_results,
            "enthusiasm_timestamps": enthusiasm_timestamps
        }
    except Exception as e:
        print(f"Error in analyze_video: {str(e)}")
        return {
            "summary": f"Error analyzing video: {str(e)}",
            "filename": "",
            "transcript": "",
            "behavioral_scores": {},
            "communication_analysis": {},
            "emotion_results": {},
            "enthusiasm_timestamps": []
        }

def clean_address(addr: str) -> str:
    ADDR_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    """Return a safe RFC‑2822 address or raise ValueError."""
    realname, email = parseaddr(addr)
    email = email.strip().replace("\r", "").replace("\n", "")
    if not ADDR_RE.match(email):
        raise ValueError(f"Invalid e‑mail address: {addr!r}")
    return email

def send_invite_email(invite: Invite):
    """
    Function for sending an invite email for a candidate to complete a HireVision assessment using SMTP.
    """
    try:
        email_host = "smtp.gmail.com"
        email_port = 587
        email_user = "pradhipakk@gmail.com"
        email_pswd = "ilbsk4me"
        # sender_email = "pradhipakk@gmail.com"

        sender = clean_address(email_user)
        recipient = clean_address(invite.email)

        msg = EmailMessage()
        msg['Subject'] = "HireVision Assessment Invite"
        msg['From'] = sender
        msg['To'] = recipient

        email_content = (
            "Hello,\n\n"
            "You have been invited to complete a HireVision assessment. "
            "Please click the link below to start your assessment:\n\n"
            "http://localhost:3000/candidates\n\n"
            "If you have any questions, feel free to reach out.\n\n"
            "Best regards,\n"
            "HireVision Team"
        )
        msg.set_content(email_content)

        with smtplib.SMTP(email_host, email_port) as server:
            server.starttls()  # Secure the connection
            server.login(email_user, email_pswd)  # Log in to your email account
            server.send_message(msg)

        # Optionally, store the invite record in the database if needed.
        supabase.table("candidate_invites").insert(
            {
                "email": recipient,
                "status": "sent",
            }
        ).execute()

        return {"success": True, "message": f"Invitation sent to {recipient}"}
    except smtplib.SMTPException as e:
        print(f"SMTP error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send email")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/invite")
async def invite_cand(invite: Invite):
    """
    Endpoint for sending invite to candidates through supabase native email system api call 
    """
    try:
        # The Python client doesn't accept redirect_to parameter
        send_invite_email(invite)
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

@app.post("/generate-resume-questions")
async def generate_resume_questions(resume_data: ResumeText):
    """
    Generate hyper-specific questions from resume experiences
    """
    try:
        parser = ResumeParser()
        result = parser.parse_resume_and_generate_questions(resume_data.resume_text)
        
        # Store the generated questions in the database if user_id is provided
        if resume_data.user_id and result.get('experiences'):
            try:
                # Store in a new table for resume questions
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
                # Continue anyway to return results
        
        return result
    except Exception as e:
        print(f"Error generating resume questions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "HireVision API"}

ACCEPTED_RESUME_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/rtf"
]
MAX_RESUME_SIZE_MB = 5

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...), user_id: str = Form(...)):
    # Validate file type
    if file.content_type not in ACCEPTED_RESUME_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF, DOCX, and RTF are allowed.")
    # Validate file size
    contents = await file.read()
    if len(contents) > MAX_RESUME_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File too large. Max size is {MAX_RESUME_SIZE_MB}MB.")
    # Upload to Supabase Storage
    filename = f"{user_id}_{int(time.time())}_{file.filename}"
    try:
        # Upload file to Supabase Storage bucket 'resumes'
        storage_response = supabase.storage.from_('resumes').upload(filename, contents, {"content-type": file.content_type})
        # Get public URL
        public_url = supabase.storage.from_('resumes').get_public_url(filename)
        # Insert record into Supabase
        result = supabase.table("resumes").insert({
            "user_id": user_id,
            "filename": filename,
            "file_path": public_url,
            "original_name": file.filename,
            "mime_type": file.content_type,
            "uploaded_at": datetime.utcnow().isoformat()
        }).execute()
        if hasattr(result, 'data') and result.data:
            db_record = result.data[0]
        else:
            db_record = None
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload resume: {str(e)}")
    return {"success": True, "file_path": public_url, "filename": filename, "db_record": db_record}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

