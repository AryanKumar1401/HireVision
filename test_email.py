#!/usr/bin/env python3
"""
Test script to verify email functionality
"""
import requests
import json

def test_email_api():
    """Test the email sending API endpoint"""
    
    # Test data
    test_invite = {
        "email": "test@example.com",
        "invite_code": "123456",
        "interview_title": "Test Interview",
        "recruiter_name": "Test Recruiter"
    }
    
    # API endpoint
    url = "http://localhost:8000/send-interview-invite"
    
    try:
        print("Testing email API...")
        print(f"Sending request to: {url}")
        print(f"Test data: {json.dumps(test_invite, indent=2)}")
        
        # Send POST request
        response = requests.post(url, json=test_invite)
        
        print(f"Response status: {response.status_code}")
        print(f"Response headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("✅ Email API test successful!")
            print(f"Response: {response.json()}")
        else:
            print("❌ Email API test failed!")
            print(f"Error: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection error: Make sure the backend server is running on localhost:8000")
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")

if __name__ == "__main__":
    test_email_api() 