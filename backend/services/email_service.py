"""Email service for sending interview invitations."""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import TypedDict

from core.config import settings


class EmailResult(TypedDict):
    success: bool
    message: str


def send_interview_invite_email(
    email: str,
    invite_code: str,
    interview_title: str,
    recruiter_name: str
) -> EmailResult:
    """Send interview invitation email using Gmail SMTP."""
    try:
        if not settings.gmail_user or not settings.gmail_app_password:
            print("Gmail credentials not configured. Falling back to simulation mode.")
            print(f"=== EMAIL SIMULATION (No Gmail Config) ===")
            print(f"To: {email}")
            print(f"Subject: Interview Invitation: {interview_title}")
            print(f"Content: Interview code {invite_code} for {interview_title}")
            print(f"=== END EMAIL SIMULATION ===")
            return {"success": True, "message": f"Interview invitation simulated for {email}"}
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"Interview Invitation: {interview_title}"
        msg['From'] = settings.gmail_user
        msg['To'] = email
        
        # HTML content
        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Interview Invitation</h2>
            <p>Hello,</p>
            <p>You have been invited to participate in an interview: <strong>{interview_title}</strong></p>
            <p>Your unique interview code is: <strong style="font-size: 18px; color: #2563eb;">{invite_code}</strong></p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>To access your interview:</h3>
                <ol>
                    <li>Visit: <a href="http://localhost:3000/candidates">http://localhost:3000/candidates</a></li>
                    <li>If you have an account, log in and use the 'Add Interview' button</li>
                    <li>If you don't have an account, sign up and then use the 'Add Interview' button</li>
                    <li>Enter your interview code: <strong>{invite_code}</strong></li>
                </ol>
            </div>
            <p>Please complete your interview within the specified timeframe.</p>
            <p>Best regards,<br><strong>{recruiter_name}</strong></p>
        </div>
        """
        
        # Plain text content (fallback)
        text_content = f"""
        Interview Invitation
            
        Hello,
        
        You have been invited to participate in an interview: {interview_title}
        
        Your unique interview code is: {invite_code}
        
        To access your interview:
        1. Visit: http://localhost:3000/candidates
        2. If you have an account, log in and use the 'Add Interview' button
        3. If you don't have an account, sign up and then use the 'Add Interview' button
        4. Enter your interview code: {invite_code}
        
        Please complete your interview within the specified timeframe.
        
        Best regards,
        {recruiter_name}
        """
        
        # Attach both HTML and text versions
        text_part = MIMEText(text_content, 'plain')
        html_part = MIMEText(html_content, 'html')
        
        msg.attach(text_part)
        msg.attach(html_part)
        
        # Send email via Gmail SMTP
        try:
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(settings.gmail_user, settings.gmail_app_password)
            
            server.send_message(msg)
            server.quit()
            
            print(f"✅ Email sent successfully to {email}")
            return {"success": True, "message": f"Interview invitation sent to {email}"}
            
        except smtplib.SMTPAuthenticationError:
            print(f"❌ Gmail authentication failed for {email}")
            return {"success": False, "message": "Gmail authentication failed. Please check your credentials."}
        except smtplib.SMTPException as e:
            print(f"❌ SMTP error for {email}: {str(e)}")
            return {"success": False, "message": f"SMTP error: {str(e)}"}
        except Exception as e:
            print(f"❌ Unexpected error sending email to {email}: {str(e)}")
            return {"success": False, "message": f"Unexpected error: {str(e)}"}
            
    except Exception as e:
        print(f"Email error: {str(e)}")
        # Fallback to simulation mode
        print(f"=== EMAIL SIMULATION (Error Fallback) ===")
        print(f"To: {email}")
        print(f"Subject: Interview Invitation: {interview_title}")
        print(f"Content: Interview code {invite_code} for {interview_title}")
        print(f"=== END EMAIL SIMULATION ===")
        return {"success": True, "message": f"Interview invitation simulated for {email}"}

