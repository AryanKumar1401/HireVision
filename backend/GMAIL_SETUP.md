# Gmail SMTP Setup Guide

This guide explains how to configure Gmail SMTP for sending interview invitation emails.

## Prerequisites

1. A Gmail account
2. 2-Factor Authentication enabled on your Gmail account
3. An App Password generated for this application

## Setup Steps

### 1. Enable 2-Factor Authentication
- Go to your Google Account settings
- Navigate to Security
- Enable 2-Step Verification if not already enabled

### 2. Generate an App Password
- Go to your Google Account settings
- Navigate to Security
- Under "2-Step Verification", click on "App passwords"
- Select "Mail" as the app and "Other" as the device
- Enter a name like "HireVision Email Service"
- Click "Generate"
- Copy the 16-character password that appears

### 3. Configure Environment Variables
Add the following variables to your `.env` file in the backend directory:

```env
# Gmail SMTP Configuration
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password

# Other existing environment variables
ASSEMBLY=your_assemblyai_api_key
OPEN_AI_API_KEY=your_openai_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

### 4. Test the Configuration
- Start your backend server
- Try sending an interview invitation
- Check the console logs for success/error messages

## Troubleshooting

### Authentication Errors
- Ensure 2-Factor Authentication is enabled
- Verify the App Password is correct (16 characters)
- Make sure you're using the App Password, not your regular Gmail password

### SMTP Errors
- Check that your Gmail account allows "less secure app access" (though App Passwords are preferred)
- Verify your firewall isn't blocking SMTP connections
- Ensure the Gmail account isn't locked due to suspicious activity

### Fallback Mode
If Gmail configuration fails, the system will automatically fall back to simulation mode and log the email content to the console.

## Security Notes

- Never commit your `.env` file to version control
- Use App Passwords instead of your regular Gmail password
- Consider using environment-specific configurations for development/production 