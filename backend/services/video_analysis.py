"""Video analysis service using AssemblyAI for transcription."""
import os
from typing import TypedDict, Optional
import assemblyai as aai

from core.config import settings
from .sentiment import summarize_text, analyze_communication, generate_behavioral_insights

# Initialize AssemblyAI
aai.settings.api_key = settings.assemblyai_api_key
transcriber = aai.Transcriber()


class VideoAnalysisResult(TypedDict):
    summary: str
    filename: str
    transcript: str
    communication_analysis: dict
    enthusiasm_timestamps: list
    behavioral_insights: dict


def analyze_video(
    video_url: str,
    job_description: Optional[str] = None
) -> VideoAnalysisResult:
    """
    Analyze video and return comprehensive results.
    
    Args:
        video_url: URL of the video to analyze
        job_description: Optional job description for behavioral insights
        
    Returns:
        VideoAnalysisResult with summary, transcript, and analysis
    """
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
                "communication_analysis": {},
                "enthusiasm_timestamps": [],
                "behavioral_insights": {}
            }

        print(f"Transcription successful. Length: {len(transcript.text)}")

        # Process transcript
        transcript_text = transcript.text
        summary = summarize_text(transcript_text)
        communication_analysis = analyze_communication(transcript_text)
        
        # Generate behavioral insights if job description is provided
        behavioral_insights = {}
        if job_description:
            behavioral_insights = generate_behavioral_insights(transcript_text, job_description)

        # Save summary to file
        os.makedirs("txt_files", exist_ok=True)
        filename = f"summary_{abs(hash(video_url))}.txt"
        with open(os.path.join("txt_files", filename), "w") as file:
            file.write(summary)
        
        return {
            "summary": summary,
            "filename": filename,
            "transcript": transcript_text,
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
            "communication_analysis": {},
            "enthusiasm_timestamps": [],
            "behavioral_insights": {}
        }

