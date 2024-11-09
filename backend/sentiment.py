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
client = OpenAI()
client.api_key = OPEN_AI_API_KEY

# Transcribe the video file (replace with a valid file URL)
transcript = transcriber.transcribe("https://assembly.ai/news.mp4")

def summarize_text(text):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Please provide a concise summary of the following text."},
            {"role": "user", "content": text}
        ],
        max_tokens=150
    )
    return response.choices[0].message.content

# After transcription, get the summary
transcript_text = transcript.text
summary = summarize_text(transcript_text)
print("Summary:", summary)