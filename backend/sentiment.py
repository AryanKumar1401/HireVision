import assemblyai as aai  
from supabase import create_client, Client
from openai import OpenAI
from dotenv import load_dotenv
import os
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

filename = "test_nasa_summary.txt"


file_path = os.path.join("c:/Users/pradh/talent_2.0/backend/txt_files", filename)

# Write the summary to a new file
with open(file_path, "w") as file:
    file.write(summary)

# Confirm file creation and content
if os.path.exists(file_path):
    print(f"File '{filename}' created successfully:")   
else:
    print("Error: File was not created.")

bucket_name = "textfiles"
supa_file_path = f"{filename}"
with open(file_path, "rb") as f:
    response = supabase.storage.from_(bucket_name).upload(supa_file_path, f)
