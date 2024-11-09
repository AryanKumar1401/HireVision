import assemblyai as aai  
from transformers import BartForConditionalGeneration, BartTokenizer
from supabase import create_client, Client


# Directly setting the API keys (not recommended for production)
ASSEMBLYAI_API_KEY = "10678c505fb64c23ab80f52124e9b2e5"

# Set up AssemblyAI API key
aai.settings.api_key = ASSEMBLYAI_API_KEY
transcriber = aai.Transcriber()

# Transcribe the video file (replace with a valid file URL)
transcript = transcriber.transcribe("https://assembly.ai/news.mp4")


# Load pre-trained BART model and tokenizer from Hugging Face
model_name = "facebook/bart-large-cnn"  # BART model fine-tuned for summarization
model = BartForConditionalGeneration.from_pretrained(model_name)
tokenizer = BartTokenizer.from_pretrained(model_name)

# Text to summarize (replace with your own text)
text = transcript.text

# Tokenize the input text
inputs = tokenizer([text], max_length=1024, return_tensors="pt", truncation=True)

# Generate the summary
summary_ids = model.generate(inputs['input_ids'], max_length=150, min_length=50, length_penalty=2.0, num_beams=4, early_stopping=True)

# Decode the summary
summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)





# Print the summary
print("Summary:")
print(summary)

