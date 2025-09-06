# import re
# import json
# import requests
# import io
# from typing import List, Dict, Any
# from openai import OpenAI
# import os
# from dotenv import load_dotenv
# import PyPDF2

# load_dotenv()
# client = OpenAI(api_key=os.getenv("OPEN_AI_API_KEY"))

# class ResumeParser:
#     def __init__(self):
#         self.client = client
    
#     def extract_text_from_pdf(self, pdf_url: str) -> str:
#         """
#         Download PDF from URL and extract text content
#         """
#         try:
#             # Download the PDF from the URL
#             response = requests.get(pdf_url, timeout=30)
#             response.raise_for_status()
            
#             # Read the PDF content
#             pdf_content = io.BytesIO(response.content)
            
#             # Extract text from PDF
#             pdf_reader = PyPDF2.PdfReader(pdf_content)
#             text = ""
            
#             for page in pdf_reader.pages:
#                 text += page.extract_text() + "\n"
            
#             return text.strip()
            
#         except requests.RequestException as e:
#             raise Exception(f"Failed to download PDF from URL: {str(e)}")
#         except Exception as e:
#             raise Exception(f"Failed to extract text from PDF: {str(e)}")
    
#     def extract_experiences(self, resume_input: str, is_pdf_url: bool = False) -> List[Dict[str, Any]]:
#         """
#         Extract work experiences from resume text or PDF URL using regex patterns
        
#         Args:
#             resume_input: Either resume text or PDF URL
#             is_pdf_url: Boolean indicating if the input is a PDF URL
#         """
#         # If it's a PDF URL, extract text first
#         if is_pdf_url:
#             resume_text = self.extract_text_from_pdf(resume_input)
#         else:
#             resume_text = resume_input
        
#         experiences = []
        
#         # Pattern to match job experiences
#         # Looks for company names, titles, dates, and bullet points
#         experience_pattern = r'([A-Z][A-Za-z\s&.,]+)\s*\|\s*([^|]+?)\s*(?:\([^)]+\))?\s*([A-Za-z]+\s+\d{4}\s*[-–]\s*(?:[A-Za-z]+\s+\d{4}|Present|Current))'
        
#         # Find all matches
#         matches = re.finditer(experience_pattern, resume_text, re.MULTILINE | re.IGNORECASE)
        
#         for match in matches:
#             company = match.group(1).strip()
#             title = match.group(2).strip()
#             dates = match.group(3).strip()
            
#             # Extract bullet points that follow this experience
#             # Look for lines that start with common bullet point indicators
#             bullet_pattern = r'^[\s]*[•·▪▫‣⁃◦‣⁌⁍⁎⁏⁐⁑⁒⁓⁔⁕⁖⁗⁘⁙⁚⁛⁜⁝⁞\-\*]\s*(.+)$'
            
#             # Find the position of this experience in the text
#             start_pos = match.end()
            
#             # Look for bullet points in the next few lines
#             lines = resume_text[start_pos:start_pos + 1000].split('\n')
#             bullets = []
            
#             for line in lines:
#                 bullet_match = re.match(bullet_pattern, line, re.MULTILINE)
#                 if bullet_match:
#                     bullets.append(bullet_match.group(1).strip())
#                 elif line.strip() and not re.match(r'^[A-Z][A-Za-z\s&.,]+\s*\|\s*', line):
#                     # If we hit another experience section, stop
#                     break
            
#             if bullets:  # Only add if we found bullet points
#                 experiences.append({
#                     'company': company,
#                     'title': title,
#                     'dates': dates,
#                     'bullets': bullets
#                 })
        
#         return experiences
    
#     def generate_questions_for_experience(self, experience: Dict[str, Any]) -> List[str]:
#         """
#         Generate 3 hyper-specific questions for a given experience using OpenAI
#         """
#         prompt = f"""
#         Based on this work experience, generate 3 hyper-specific, detailed questions that would help understand the candidate's technical depth and problem-solving approach. 

#         Experience:
#         Company: {experience['company']}
#         Title: {experience['title']}
#         Dates: {experience['dates']}
#         Responsibilities:
#         {chr(10).join([f"• {bullet}" for bullet in experience['bullets']])}

#         Generate 3 questions that:
#         1. Are highly specific to the technologies, company, challenges, or achievements mentioned
#         2. Ask for concrete examples and specific instances
#         3. Probe into technical decision-making and problem-solving processes
#         4. Are the type of questions a that make a candidate feel excited to answer, as it speaks to their personal experience
#         Format each question as a separate line starting with "Q: "
#         """
        
#         try:
#             response = self.client.chat.completions.create(
#                 model="gpt-4",
#                 messages=[
#                     {"role": "system", "content": "You are a senior technical interviewer who asks insightful, specific questions about technical experiences."},
#                     {"role": "user", "content": prompt}
#                 ],
#                 max_tokens=500,
#                 temperature=0.7
#             )
            
#             questions_text = response.choices[0].message.content.strip()
            
#             # Parse the questions from the response
#             questions = []
#             for line in questions_text.split('\n'):
#                 line = line.strip()
#                 if line.startswith('Q: '):
#                     questions.append(line[3:].strip())
#                 elif line and not line.startswith('Q: ') and len(questions) < 3:
#                     # If it's a question without the Q: prefix, add it
#                     questions.append(line.strip())
            
#             # Ensure we have exactly 3 questions
#             while len(questions) < 3:
#                 questions.append("Can you walk me through a specific technical challenge you faced in this role?")
            
#             return questions[:3]
            
#         except Exception as e:
#             print(f"Error generating questions: {str(e)}")
#             # Fallback questions
#             return [
#                 f"What was the most challenging technical problem you solved at {experience['company']}?",
#                 f"Can you describe a specific instance where you had to debug a production issue?",
#                 f"What technical decisions did you make that had the biggest impact on your team's success?"
#             ]
    
#     def parse_resume_and_generate_questions(self, resume_input: str, is_pdf_url: bool = False) -> Dict[str, Any]:
#         """
#         Main function to parse resume and generate questions for each experience
        
#         Args:
#             resume_input: Either resume text or PDF URL
#             is_pdf_url: Boolean indicating if the input is a PDF URL
#         """
#         try:
#             # Extract experiences
#             experiences = self.extract_experiences(resume_input, is_pdf_url)
            
#             if not experiences:
#                 # If regex extraction fails, try a more general approach
#                 # For fallback, we need to get the text first if it's a PDF URL
#                 try:
#                     if is_pdf_url:
#                         resume_text = self.extract_text_from_pdf(resume_input)
#                     else:
#                         resume_text = resume_input
#                     experiences = self.fallback_extract_experiences(resume_text)
#                 except Exception as fallback_error:
#                     print(f"Fallback extraction failed: {str(fallback_error)}")
#                     experiences = []
            
#             # Generate questions for each experience
#             result = {
#                 'experiences': [],
#                 'total_experiences': len(experiences)
#             }
            
#             for experience in experiences:
#                 questions = self.generate_questions_for_experience(experience)
                
#                 result['experiences'].append({
#                     'company': experience['company'],
#                     'title': experience['title'],
#                     'dates': experience['dates'],
#                     'bullets': experience['bullets'],
#                     'questions': questions
#                 })
            
#             return result
            
#         except Exception as e:
#             print(f"Error parsing resume: {str(e)}")
#             return {
#                 'experiences': [],
#                 'total_experiences': 0,
#                 'error': str(e)
#             }
    
#     def fallback_extract_experiences(self, resume_text: str) -> List[Dict[str, Any]]:
#         """
#         Fallback method using OpenAI to extract experiences if regex fails
#         """
#         prompt = f"""
#         Extract work experiences from this resume text. For each experience, provide:
#         1. Company name
#         2. Job title
#         3. Dates
#         4. Key responsibilities/achievements (as bullet points)

#         Resume text:
#         {resume_text}

#         Return the result as a JSON array with this structure:
#         [
#             {{
#                 "company": "Company Name",
#                 "title": "Job Title",
#                 "dates": "Date Range",
#                 "bullets": ["bullet point 1", "bullet point 2", ...]
#             }}
#         ]
#         """
        
#         try:
#             response = self.client.chat.completions.create(
#                 model="gpt-4",
#                 messages=[
#                     {"role": "system", "content": "You are a resume parser. Extract work experiences and return them as JSON."},
#                     {"role": "user", "content": prompt}
#                 ],
#                 max_tokens=1000,
#                 temperature=0.3
#             )
            
#             result_text = response.choices[0].message.content.strip()
            
#             # Try to parse JSON from the response
#             # Sometimes the response might have markdown formatting
#             if result_text.startswith('```json'):
#                 result_text = result_text[7:-3]  # Remove ```json and ```
#             elif result_text.startswith('```'):
#                 result_text = result_text[3:-3]  # Remove ``` markers
            
#             experiences = json.loads(result_text)
#             return experiences
            
#         except Exception as e:
#             print(f"Error in fallback extraction: {str(e)}")
#             return [] 