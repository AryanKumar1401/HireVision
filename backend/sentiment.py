import assemblyai as aai  
from supabase import create_client, Client
from openai import OpenAI
from dotenv import load_dotenv
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Directly setting the API keys (not recommended for production)
load_dotenv()
ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLY")
OPEN_AI_API_KEY = os.getenv("OPEN_AI_API_KEY")
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

aai.settings.api_key = ASSEMBLYAI_API_KEY
transcriber = aai.Transcriber()

client = OpenAI(api_key=OPEN_AI_API_KEY)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class VideoURL(BaseModel):
    video_url: str

def summarize_text(text):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[

            {"role": "system", "content": "Read the provided transcript of an interview. Write a summary of the interview, and then provide a pros and cons list based on what you think are relevant points for an interview."},

            {"role": "user", "content": text}
        ],
        max_tokens=150
    )
    return response.choices[0].message.content

def analyze_video(video_url: str):
    try:
        print(f"Attempting to transcribe video from URL: {video_url}")
        # Check if URL is accessible
        if not video_url or not video_url.startswith('http'):
            raise ValueError("Invalid video URL format")
            
        # Transcribe the video file
        transcript = transcriber.transcribe(video_url)
        
        if not transcript:
            raise ValueError("Transcription failed - no transcript returned")
            
        print(f"Transcription successful. Length: {len(transcript.text)}")
        
        # Get the summary
        transcript_text = transcript.text
        summary = summarize_text(transcript_text)
        
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
            "transcript": transcript_text
        }
    except Exception as e:
        print(f"Error in analyze_video: {str(e)}")
        raise

@app.post("/analyze-video")
async def analyze_video_endpoint(video: VideoURL):
    try:
        print(f"Received request to analyze video: {video.video_url}")
        result = analyze_video(video.video_url)
        if result:
            return result
        raise HTTPException(status_code=400, detail="Failed to analyze video")
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(f"Error in endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

