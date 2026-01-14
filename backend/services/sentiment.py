"""Sentiment analysis and communication evaluation service."""
import json
import re
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

OPEN_AI_API_KEY = os.getenv("OPEN_AI_API_KEY")
client = OpenAI(api_key=OPEN_AI_API_KEY)


def summarize_text(text: str) -> str:
    """
    Summarize interview transcript into a decision-ready recruiter card.
    
    Args:
        text: The interview transcript text
        
    Returns:
        A 5-line summary suitable for quick recruiter review
    """
    system_prompt = (
        "You are a hiring screener. Read the interview transcript and produce a 5-line recruiter card "
        "that is decision-ready and easy to skim in under 10 seconds. "
        "Follow these rules exactly: "
        "Line 1 — Decision: one of {Strong Yes, Yes, Leaning Yes, Neutral, Leaning No, No, Strong No} + 6–10 word rationale. "
        "Line 2 — Evidence (3 bullets): each ≤ 12 words; cite up to 6-word quotes from the transcript in quotes; no generic adjectives. "
        "Line 3 — Risks (≤2): label + 6–10 word evidence from transcript. "
        "Line 4 — Scores: Customer Empathy / Communication / Conflict Resolution / Assertiveness (1–5) with 3–5 word reasons. "
        "Line 5 — Follow-ups (1–2): targeted, behavior-anchored questions (\"What would you say next?\")."
    )
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Here is the transcript to analyze:\n\n{text}"}
        ],
        max_tokens=300
    )
    
    summary = response.choices[0].message.content
    print("Summary:", summary)
    return summary


def analyze_communication(transcript: str) -> dict:
    """
    Analyze communication skills from an interview transcript.
    
    Args:
        transcript: The interview transcript text
        
    Returns:
        Dict with 'strengths' and 'improvements' lists
    """
    prompt = (
        "As a communication skills analyst, evaluate the following interview transcript and provide insights "
        "about the interviewee's communication abilities.\n"
        "Follow these rules carefully:\n"
        "1. Identify and describe 2 key strengths in the interviewee's communication style, each in 9 words or fewer.\n"
        "2. Identify and describe 2 areas for improvement in the interviewee's communication style, each in 9 words or fewer.\n"
        "Format as JSON: {'strengths': [...], 'improvements': [...]}\n\n"
        f"Transcript: {transcript}"
    )
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
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


def generate_behavioral_insights(transcript: str, job_description: str) -> dict:
    """
    Generate behavioral insights based on transcript and job description.
    
    Args:
        transcript: The interview transcript text
        job_description: The job description to match against
        
    Returns:
        Dict with 'insights' list containing emoji-prefixed insights
    """
    prompt = (
        "You are a talent scout reviewing a transcript from a video interview. "
        "Your primary objective is to identify 2-4 distinctive attributes of the candidate that relate closely to the provided job description. "
        "Ensure the attributes you select are unique, relevant to the job description, and avoid clichés or generic statements.\n\n"
        "Output the selected statements as short, punchy insights preceded by a relevant emoji.\n\n"
        f"Here is the transcript:\n{transcript}\n\n"
        f"Here is the job description:\n{job_description}\n\n"
        "Format the output as a JSON object with a single key 'insights' which is an array of strings. For example:\n"
        '{"insights": ["🎤 Presented at a major conference", "🎸 Plays in a band on weekends"]}'
    )

    response = client.chat.completions.create(
        model="gpt-4o-mini",
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
        insights = []
        lines = content.split('\n')
        for line in lines:
            line = line.strip()
            # Look for lines that start with emojis or have bullet points
            if re.match(r'^[🎤🎸💡🛠️📚⚠️🎯🚀💪🌟🔥]', line) \
                or line.startswith('- ') \
                or line.startswith('• ') \
                or line.startswith('> '):
                # Clean up the line
                clean_line = re.sub(r'^[-•\s]+', '', line)
                if clean_line:
                    insights.append(clean_line)
            elif line and len(line) > 10:  # Any substantial line
                insights.append(line)
        
        return {"insights": insights[:4]}  # Return max 4 insights
