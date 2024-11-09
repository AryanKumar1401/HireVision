import assemblyai as aai  
from supabase import create_client, Client
from openai import OpenAI
from dotenv import load_dotenv
import os
# Directly setting the API keys (not recommended for production)
load_dotenv()
ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLY")

OPEN_AI_API_KEY = os.getenv("OPEN_AI_API_KEY")
# Set up AssemblyAI API key
aai.settings.api_key = ASSEMBLYAI_API_KEY
transcriber = aai.Transcriber()

# Set up OpenAI client
client = OpenAI(api_key = OPEN_AI_API_KEY)

# Transcribe the video file (replace with a valid file URL)
transcript = transcriber.transcribe("https://usbvchfamioprsvxhazt.supabase.co/storage/v1/object/sign/videos/video_1731159627469.webm?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2aWRlb3MvdmlkZW9fMTczMTE1OTYyNzQ2OS53ZWJtIiwiaWF0IjoxNzMxMTYwMzMyLCJleHAiOjE3MzE3NjUxMzJ9.HsnfHXeXg8UaIP5RLk5vNoSN_WBs8D_HdXBkfFMGb60&t=2024-11-09T13%3A52%3A12.288Z")

def summarize_text(text):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Provide a balanced analysis of an applicant's job application video, where they discuss their qualifications, skills, and experiences. Summarize the applicant’s responses in a way that presents a neutral overview of their key qualities and achievements. Additionally, break down the applicant's strengths and areas for improvement:" +
"Pros: Highlight the applicant's strongest qualities, focusing on positive attributes in their responses. These could include effective communication, relevant experiences, strong examples, or clear explanations that showcase their strengths for the role." + 

"Cons: Identify aspects of the applicant's responses that could be improved. These may include areas where they lack detail, appear unprepared, show signs of nervousness, or miss opportunities to connect their experience with the job requirements." +

"Summarize the video and provide the pros and cons in bullet points for easy reference."},
            {"role": "user", "content": text}
        ],
        max_tokens=150
    )
    return response.choices[0].message.content

# After transcription, get the summary
transcript_text = transcript.text
summary = summarize_text(transcript_text)
print("Summary:", summary)