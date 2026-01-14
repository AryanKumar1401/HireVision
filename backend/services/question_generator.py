"""Question generation service using OpenAI."""
import re
import json
from openai import OpenAI

from core.config import settings

client = OpenAI(api_key=settings.openai_api_key)


def generate_personalized_questions_from_resume(
    resume_text: str,
    num_questions: int = 3
) -> list[dict]:
    """
    Generate a list of personalized interview questions based on the resume text using OpenAI.
    
    Args:
        resume_text: The text content of the resume
        num_questions: Number of questions to generate
        
    Returns:
        List of dicts: [{"question": ...}], suitable for frontend use.
    """
    prompt = (
        f"Given the following resume, generate {num_questions} personalized interview questions "
        "that are specific to the candidate's background, experience, and skills. "
        "Questions should be concise, relevant, and not generic.\n\n"
        f"Resume:\n{resume_text}\n\n"
        f"Return the questions as a JSON array of objects, each with a 'question' field. "
        f"Example: [{{\"question\": \"...\"}}, ...]"
    )
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an expert technical interviewer."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=512,
        temperature=0.5
    )
    
    raw_content = response.choices[0].message.content.strip()
    print("Raw content in generate_personalized_questions_from_resume: ", raw_content)

    # Remove markdown code block markers if present
    if raw_content.startswith('```json'):
        raw_content = raw_content[7:]
    if raw_content.startswith('```'):
        raw_content = raw_content[3:]
    if raw_content.endswith('```'):
        raw_content = raw_content[:-3]
    raw_content = raw_content.strip()

    # Try to extract the first JSON array from the response
    json_array_match = re.search(r'(\[.*?\])', raw_content, re.DOTALL)
    if json_array_match:
        json_str = json_array_match.group(1)
    else:
        json_str = raw_content

    try:
        questions = json.loads(json_str)
        # Validate format: should be a list of dicts with 'question' key
        if isinstance(questions, list) and all(
            isinstance(q, dict) and 'question' in q and isinstance(q['question'], str) and q['question'].strip()
            for q in questions
        ):
            return questions[:num_questions]
        # If it's a list of strings, convert
        if isinstance(questions, list) and all(isinstance(q, str) and q.strip() for q in questions):
            return [{"question": q} for q in questions[:num_questions]]
    except Exception:
        # Fallback: try to extract questions from numbered or bulleted list
        questions = []
        for line in raw_content.split("\n"):
            line = line.strip()
            match = re.match(r'^[0-9]+[\).\-]?\s*(.*)', line)
            if match:
                q = match.group(1).strip()
                if q:
                    questions.append({"question": q})
            elif line:
                questions.append({"question": line})
        # Filter out non-question artifacts
        questions = [q for q in questions if q["question"] and len(q["question"]) > 5]
        return questions[:num_questions]
    
    return []

