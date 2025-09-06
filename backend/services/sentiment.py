import spacy
from openai import OpenAI
import os
from dotenv import load_dotenv
import json
import spacy

load_dotenv()
OPEN_AI_API_KEY = os.getenv("OPEN_AI_API_KEY")
client = OpenAI(api_key=OPEN_AI_API_KEY)
nlp = spacy.load("en_core_web_sm")


def summarize_text(text):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[

            {"role": "system", "content": "Read the provided transcript of an interview. Write a summary of the interview, and then provide a pros and cons list based on what you think are relevant points for an interview. the tokens for pros should be maximum 50 and for cons 50 and summary 50"},

            {"role": "user", "content": text}
        ],
        max_tokens=150
    )
    print("Summary:", response.choices[0].message.content)
    return response.choices[0].message.content
    
def generate_behavioral_scores(summary):
    prompt = (
        "You are an advanced behavioral analyst. Based on the following interview summary, "
        "rate the candidate's performance on a scale of 0 to 100% for the following traits: "
        "1. Confidence: How assertive and decisive they sound. "
        "2. Clarity: How well-structured and unambiguous their responses are. "
        "3. Enthusiasm: How energetic and positive they appear. "
        "4. Leadership: How well they demonstrate initiative and teamwork. "
        "Here is the summary: \n\n"
        f"{summary}\n\n"
        "Provide the scores as a JSON object with explanations, e.g., "
        '{"confidence": {"score": 85, "explanation": "Strong and assertive responses."}, ...}.'
    )
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=300,
        temperature=0.7
    )
    print("Behavioral Scores:", response.choices[0].message.content)
    
    # Clean the response content to handle markdown formatting
    content = response.choices[0].message.content.strip()
    
    # Remove markdown code block markers if present
    if content.startswith('```json'):
        content = content[7:]
    elif content.startswith('```'):
        content = content[3:]
    if content.endswith('```'):
        content = content[:-3]
    content = content.strip()
    
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        print("Error parsing JSON in behavioral scores:", content)
        # Return default scores if parsing fails
        return {
            "confidence": {"score": 50, "explanation": "Unable to parse confidence score"},
            "clarity": {"score": 50, "explanation": "Unable to parse clarity score"},
            "enthusiasm": {"score": 50, "explanation": "Unable to parse enthusiasm score"},
            "leadership": {"score": 50, "explanation": "Unable to parse leadership score"}
        }


def generate_behavioral_scores_rule_based(summary):
    doc = nlp(summary)
    
    scores = {
        "confidence": {
            "score": len([token for token in doc if token.pos_ in ["NOUN", "VERB"]]) / len(doc) * 100,
            "explanation": "Based on the frequency of assertive nouns and verbs."
        },
        "clarity": {
            "score": len([sent for sent in doc.sents if len(sent) < 20]) / len(list(doc.sents)) * 100,
            "explanation": "Short and clear sentences detected."
        },
        "enthusiasm": {
            "score": sum(token.sentiment for token in doc) / len(doc) * 100,
            "explanation": "Detected positive sentiment."
        },
        "leadership": {
            "score": len([ent for ent in doc.ents if ent.label_ == "ORG"]) / len(doc) * 100,
            "explanation": "Mentions of organizational context."
        }
    }
    
    return json.dumps(scores, indent=4)

def analyze_communication(summary):
    prompt = (
        "As a communication skills analyst, evaluate the following interview summary and provide: "
        "1. 4 key strengths in communication "
        "2. 2 areas for improvement "
        "Format as JSON: {'strengths': [...], 'improvements': [...]}\n\n"
        f"Summary: {summary}"
    )
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a communication skills analyst."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=200
    )
    print("Communication Analysis:", response.choices[0].message.content)
    
    # Clean the response content to handle markdown formatting
    content = response.choices[0].message.content.strip()
    
    # Remove markdown code block markers if present
    if content.startswith('```json'):
        content = content[7:]
    elif content.startswith('```'):
        content = content[3:]
    if content.endswith('```'):
        content = content[:-3]
    content = content.strip()
    
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        print("Error parsing JSON in communication analysis:", content)
        # Return default analysis if parsing fails
        return {
            "strengths": ["Unable to parse communication strengths"],
            "improvements": ["Unable to parse communication improvements"]
        }

def generate_behavioral_insights(summary):
    prompt = (
        "You are a talent scout reviewing an interview summary. "
        "Your goal is to pull out 2-4 of the most interesting, impressive, or quirky facts about the candidate that would catch a recruiter's eye. "
        "These should be positive and highlight unique aspects of their personality or experience. "
        "Present them as short, punchy statements. Add a relevant emoji at the start of each statement.\n\n"
        f"Here is the summary:\n{summary}\n\n"
        "Format the output as a JSON object with a single key 'insights' which is an array of strings. For example:\n"
        '{"insights": ["🎤 Presented at a major conference", "🎸 Plays in a band on weekends"]}'
    )

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a creative talent scout."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=200,
        temperature=0.8
    )
    print("Behavioral Insights:", response.choices[0].message.content)
    
    # Clean the response content to handle markdown formatting
    content = response.choices[0].message.content.strip()
    
    # Remove markdown code block markers if present
    if content.startswith('```json'):
        content = content[7:]
    elif content.startswith('```'):
        content = content[3:]
    if content.endswith('```'):
        content = content[:-3]
    content = content.strip()
    
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        print("Error parsing JSON in behavioral insights:", content)
        # Fallback: try to extract insights from the text
        import re
        insights = []
        lines = content.split('\n')
        for line in lines:
            line = line.strip()
            # Look for lines that start with emojis or have bullet points
            if re.match(r'^[🎤🎸💡🛠️📚⚠️🎯🚀💪🌟🔥]', line) or line.startswith('- ') or line.startswith('• '):
                # Clean up the line
                clean_line = re.sub(r'^[-•\s]+', '', line)
                if clean_line:
                    insights.append(clean_line)
            elif line and len(line) > 10:  # Any substantial line
                insights.append(line)
        
        return {"insights": insights[:4]}  # Return max 4 insights