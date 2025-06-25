# HireVision Interview System

This document describes the new interview creation and management system for HireVision.

## Overview

The interview system allows recruiters to:
1. Create custom interviews with multiple questions
2. Invite candidates via email with unique 6-digit codes
3. Track interview participation and completion

Candidates can:
1. Receive email invitations with interview codes
2. Add interviews to their dashboard using the code
3. Complete interviews and have their responses analyzed

## Database Schema

### Tables

1. **interviews** - Main interview records
   - `id` (UUID, Primary Key)
   - `title` (VARCHAR) - Interview title
   - `description` (TEXT) - Optional description
   - `recruiter_id` (UUID) - Reference to recruiter
   - `company_number` (VARCHAR) - Company identifier
   - `status` (VARCHAR) - active/inactive/completed
   - `created_at`, `updated_at` (TIMESTAMP)

2. **interview_questions** - Questions for each interview
   - `id` (UUID, Primary Key)
   - `interview_id` (UUID) - Reference to interview
   - `question` (TEXT) - Question text
   - `order_index` (INTEGER) - Question order
   - `created_at` (TIMESTAMP)

3. **interview_invites** - Candidate invitations
   - `id` (UUID, Primary Key)
   - `interview_id` (UUID) - Reference to interview
   - `email` (VARCHAR) - Candidate email
   - `invite_code` (VARCHAR(6)) - Unique 6-digit code
   - `status` (VARCHAR) - pending/accepted/completed/expired
   - `created_at`, `accepted_at`, `completed_at` (TIMESTAMP)

4. **interview_participants** - Track who has access to interviews
   - `id` (UUID, Primary Key)
   - `interview_id` (UUID) - Reference to interview
   - `user_id` (UUID) - Reference to candidate
   - `status` (VARCHAR) - active/completed/withdrawn
   - `joined_at`, `completed_at` (TIMESTAMP)

## Frontend Components

### Recruiter Side

1. **NewInterview.tsx** - Modal for creating interviews
   - Step 1: Define interview title, description, and questions
   - Step 2: Add candidate email addresses
   - Step 3: Review and create interview

2. **Dashboard.tsx** - Updated with "New Interview" button
   - Added `onNewInterview` prop and handler
   - Integrated with NewInterview modal

### Candidate Side

1. **AddInterviewModal.tsx** - Modal for adding interviews with codes
   - Accepts 6-digit interview codes
   - Validates codes and adds user to interview participants
   - Pre-fills code if provided via URL parameter

2. **Dashboard** - Updated with "Add Interview" button
   - Handles URL parameters for interview codes
   - Auto-opens AddInterviewModal when code is present

## Backend Endpoints

### New Endpoints

1. **POST /send-interview-invite**
   - Sends email invitations with 6-digit codes
   - Parameters: `email`, `invite_code`, `interview_title`, `recruiter_name`

### Updated Endpoints

1. **POST /invite** - Enhanced for general candidate invitations

## User Flow

### Recruiter Flow

1. **Create Interview**
   - Click "New Interview" button on dashboard
   - Enter interview title and description
   - Add custom questions (reorderable)
   - Add candidate email addresses
   - Review and create

2. **Send Invitations**
   - System generates unique 6-digit codes
   - Sends email invitations to candidates
   - Codes are stored in database

### Candidate Flow

1. **Receive Invitation**
   - Gets email with interview code
   - Email contains instructions and code

2. **Add Interview**
   - If logged in: Click "Add Interview" button
   - If not logged in: Sign up, then add interview
   - Enter 6-digit code
   - System validates and grants access

3. **Complete Interview**
   - Access interview from dashboard
   - Record video responses to questions
   - Submit for analysis

## URL Parameters

### Signup with Interview Code
- URL: `/signup?code=123456`
- Automatically redirects to dashboard with code after signup

### Dashboard with Interview Code
- URL: `/candidates/dashboard?code=123456`
- Automatically opens AddInterviewModal with pre-filled code

## Security Features

1. **Row Level Security (RLS)** - Database-level access control
2. **Unique Codes** - 6-digit codes are unique and secure
3. **Status Tracking** - Invites and participation are tracked
4. **Access Control** - Users can only access their own interviews

## Email Templates

### Interview Invitation Email
```
Subject: Interview Invitation: [Interview Title]

Hello,

You have been invited to participate in an interview: [Interview Title]

Your unique interview code is: [6-digit code]

To access your interview:
1. Visit: http://localhost:3000/candidates
2. If you have an account, log in and use the 'Add Interview' button
3. If you don't have an account, sign up and then use the 'Add Interview' button
4. Enter your interview code: [6-digit code]

Please complete your interview within the specified timeframe.

Best regards,
[Recruiter Name]
```

## Setup Instructions

1. **Database Setup**
   - Run the SQL script in `database_schema.sql`
   - This creates all necessary tables and policies

2. **Environment Variables**
   - Ensure email configuration is set up in backend
   - `EMAIL_USER` and `EMAIL_PASSWORD` for SMTP

3. **Frontend Integration**
   - Components are already integrated into existing pages
   - No additional setup required

## Usage Examples

### Creating an Interview
```typescript
// Recruiter clicks "New Interview" button
// Fills out form with:
// - Title: "Frontend Developer Assessment"
// - Questions: ["Tell me about your experience with React", "Describe a challenging project"]
// - Candidates: ["candidate1@example.com", "candidate2@example.com"]
// System creates interview and sends invitations
```

### Adding an Interview (Candidate)
```typescript
// Candidate receives email with code "123456"
// Visits dashboard and clicks "Add Interview"
// Enters code "123456"
// System validates and grants access to interview
```

## Error Handling

1. **Invalid Codes** - Shows error message for invalid/expired codes
2. **Duplicate Access** - Prevents adding same interview multiple times
3. **Email Failures** - Logs errors but continues processing other invites
4. **Database Errors** - Graceful error handling with user feedback

## Future Enhancements

1. **Interview Templates** - Pre-defined question sets
2. **Bulk Invitations** - Upload CSV of candidate emails
3. **Interview Scheduling** - Set time limits and deadlines
4. **Analytics Dashboard** - Track interview completion rates
5. **Reminder Emails** - Automatic follow-ups for incomplete interviews 