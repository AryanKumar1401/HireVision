# Personalized Resume-Based Interview Questions Implementation Plan

## Overview
This plan details how to implement a feature where each candidate receives 3 personalized interview questions generated from their resume. The solution integrates with the existing FastAPI backend, Supabase database, and frontend application.

---

## 1. Resume Upload & Parsing (Backend)
- **Trigger:** Candidate uploads their resume (handled by `/upload-resume`).
- **Action:**
  - After upload, parse the resume and generate 3 personalized questions.
  - Use the `/generate-resume-questions` endpoint and ensure it always produces at least 3 questions.
  - Store generated questions in a new Supabase table (`resume_questions`).

---

## 2. Database Schema Update (Supabase)
- **Table:** `resume_questions`
- **Fields:**
  - `id` (Primary Key)
  - `user_id` (Foreign Key to users)
  - `question_index` (0, 1, 2)
  - `question_text`
  - `created_at`
- **Action:**
  - Insert 3 generated questions per candidate, linked by `user_id`.

---

## 3. API Endpoint for Fetching Questions
- **Endpoint:** `/get-personalized-questions`
- **Method:** `POST` or `GET`
- **Input:** `user_id`
- **Output:** List of 3 personalized questions for the candidate.
- **Action:**
  - Query `resume_questions` for the latest 3 questions for the given `user_id`.
  - Return them in a frontend-friendly format.

---

## 4. Frontend Integration
- **When:** When a candidate starts their interview.
- **Action:**
  - Call `/get-personalized-questions` with the candidate’s `user_id`.
  - Display the 3 questions in the interview UI.

---

## 5. Interview Flow Update
- **Action:**
  - Use these personalized questions as the first 3 (or all) questions in the interview.
  - Fallback to generic questions if resume-based questions are unavailable.

---

## 6. (Optional) Admin/Recruiter Controls
- **Feature:** Allow recruiters to review or edit generated questions before the interview.
- **Action:**
  - Provide a UI for recruiters to view/edit questions in `resume_questions` for each candidate.

---

## 7. Testing & Validation
- **Action:**
  - Upload resumes for test users and verify question generation, storage, and retrieval.
  - Ensure frontend displays the correct questions.

---

## Summary Table

| Step | Component   | Action                                                                 |
|------|-------------|------------------------------------------------------------------------|
| 1    | Backend     | Parse resume & generate questions on upload                            |
| 2    | Supabase    | Store questions in `resume_questions` table                            |
| 3    | Backend     | Create `/get-personalized-questions` endpoint                          |
| 4    | Frontend    | Fetch & display questions for candidate                                |
| 5    | Interview   | Use personalized questions in interview flow                           |
| 6    | (Optional)  | Admin UI for recruiters to review/edit questions                       |
| 7    | QA          | Test end-to-end flow                                                   | 