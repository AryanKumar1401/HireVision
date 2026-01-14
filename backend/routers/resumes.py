"""Resume management router."""
import os
import time
import tempfile
from datetime import datetime
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
import pdfplumber
import requests

from core.database import supabase
from models.requests import ResumeQuestionsRequest, GetPersonalizedQuestionsRequest
from services.question_generator import generate_personalized_questions_from_resume

router = APIRouter(prefix="/api/resumes", tags=["Resumes"])

# Constants
ACCEPTED_RESUME_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/rtf"
]
MAX_RESUME_SIZE_MB = 5


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...), user_id: str = Form(...)):
    """Upload resume file to Supabase storage."""
    # Validate file type
    if file.content_type not in ACCEPTED_RESUME_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only PDF, DOCX, and RTF are allowed."
        )
    
    # Validate file size
    contents = await file.read()
    if len(contents) > MAX_RESUME_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Max size is {MAX_RESUME_SIZE_MB}MB."
        )
    
    # Upload to Supabase Storage
    filename = f"{user_id}_{int(time.time())}_{file.filename}"
    try:
        storage_response = supabase.storage.from_('resumes').upload(
            filename, contents, {"content-type": file.content_type}
        )
        public_url = supabase.storage.from_('resumes').get_public_url(filename)
        
        result = supabase.table("resumes").insert({
            "user_id": user_id,
            "filename": filename,
            "file_path": public_url,
            "original_name": file.filename,
            "mime_type": file.content_type,
            "uploaded_at": datetime.utcnow().isoformat()
        }).execute()
        
        db_record = result.data[0] if hasattr(result, 'data') and result.data else None
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload resume: {str(e)}")
    
    return {
        "success": True,
        "file_path": public_url,
        "filename": filename,
        "db_record": db_record
    }


@router.post("/generate-questions")
async def generate_resume_questions_from_db(request: ResumeQuestionsRequest):
    """Generate questions from the latest resume PDF in Supabase for a user."""
    try:
        user_id = request.user_id
        
        # Fetch latest resume for user_id from Supabase
        result = supabase.table("resumes").select(
            "id, file_path, original_name, uploaded_at"
        ).eq("user_id", user_id).order("uploaded_at", desc=True).limit(1).execute()
        
        if not result.data or len(result.data) == 0:
            return {"error": "No resume found for this user."}
        
        resume = result.data[0]
        pdf_url = resume["file_path"]
        
        # Download PDF from file_path
        pdf_response = requests.get(pdf_url)
        if pdf_response.status_code != 200:
            return {"error": f"Failed to download PDF from storage. Status code: {pdf_response.status_code}"}
        
        # Extract text from PDF using temp file (thread-safe)
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            temp_file.write(pdf_response.content)
            temp_path = temp_file.name
        
        try:
            with pdfplumber.open(temp_path) as pdf:
                text = "\n".join(page.extract_text() or "" for page in pdf.pages)
        finally:
            os.remove(temp_path)
        
        if not text.strip():
            return {"error": "Could not extract text from the PDF."}
        
        # Generate questions using the service
        questions = generate_personalized_questions_from_resume(text, num_questions=3)
        if not questions:
            return {"error": "No questions could be generated from the resume."}
        
        # Store questions in resume_questions table
        for idx, question in enumerate(questions):
            supabase.table('resume_questions').insert({
                'user_id': user_id,
                'question_index': idx,
                'question_text': question['question'],
                'created_at': datetime.now().isoformat()
            }).execute()
        
        return {"questions": questions}
        
    except Exception as e:
        print(f"Error in generate_resume_questions_from_db: {str(e)}")
        return {"error": str(e)}


@router.post("/get-personalized-questions")
async def get_personalized_questions(request: GetPersonalizedQuestionsRequest):
    """Fetch the latest 3 personalized resume questions for a user."""
    try:
        user_id = request.user_id
        
        # Query resume_questions for the latest 3 questions for the user
        result = supabase.table("resume_questions") \
            .select("question_index, question_text, created_at") \
            .eq("user_id", user_id) \
            .order("created_at", desc=True) \
            .order("question_index", desc=False) \
            .limit(3) \
            .execute()
        
        questions = result.data if result and hasattr(result, 'data') and result.data else []
        
        # Format for frontend: list of {"question": ...}
        formatted = [
            {"question": q["question_text"]}
            for q in sorted(questions, key=lambda x: x["question_index"])
        ]
        
        return {"questions": formatted}
        
    except Exception as e:
        print(f"Error in get_personalized_questions: {str(e)}")
        return {"error": str(e)}


# Legacy endpoints for backwards compatibility
@router.post("/upload-resume", include_in_schema=False)
async def upload_resume_legacy(file: UploadFile = File(...), user_id: str = Form(...)):
    """Legacy endpoint - redirects to new path."""
    return await upload_resume(file, user_id)

