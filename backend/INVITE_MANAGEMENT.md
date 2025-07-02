# Interview Invite Management System

This document explains the updated interview invite management system that automatically handles duplicate invites and expired codes.

## Problem Solved

The previous system had issues with:
- Duplicate invites for the same email address
- Expired interview codes causing confusion
- No automatic cleanup of old invites

## Solution Overview

### 1. Automatic Duplicate Management

When sending invites to candidates, the system now:
- Checks for existing invites for the same email and interview
- Updates existing invites with new codes instead of creating duplicates
- Resets the status to "pending" for renewed invites

### 2. Automatic Expiration Handling

- Invites automatically expire after 30 days
- Expired invites are marked with status "expired"
- Users get clear error messages when using expired codes

### 3. Database Cleanup

- Automatic cleanup of old invites
- Status tracking for better management

## Database Schema Updates

### interview_invites Table

The table structure remains the same, but now includes better status management:

```sql
-- Status values:
-- 'pending' - Invite is active and can be used
-- 'accepted' - Invite has been used to join interview
-- 'expired' - Invite is older than 30 days
-- 'completed' - Interview has been completed
```

## Frontend Changes

### NewInterview.tsx

Updated to handle duplicate invites:
- Checks for existing invites before creating new ones
- Updates existing invites with new codes
- Provides better logging for debugging

### AddInterviewModal.tsx

Enhanced error handling:
- Better error messages for different invite statuses
- Automatic expiration checking
- Clear feedback for users

## Backend Endpoints

### New Endpoints

1. **POST /cleanup-expired-invites**
   - Automatically marks invites older than 30 days as expired
   - Returns count of cleaned up invites

2. **GET /invite-status/{invite_code}**
   - Checks the status of a specific invite code
   - Automatically marks expired invites
   - Returns detailed invite information

3. **POST /bulk-manage-invites**
   - Handles multiple invites at once
   - Useful for bulk operations

## Usage Instructions

### For Recruiters

1. **Creating Interviews**: The system automatically handles duplicates
   - If you send an invite to an email that already has an invite for the same interview, it will be updated with a new code
   - No duplicate records are created

2. **Resending Invites**: Simply create a new interview or resend invites
   - Existing invites will be automatically updated
   - Candidates will receive new codes

### For Candidates

1. **Using Interview Codes**: 
   - Enter the 6-digit code from your email
   - System will validate and provide clear feedback
   - Expired codes will show appropriate error messages

2. **Error Messages**:
   - "Invalid interview code" - Code doesn't exist
   - "This interview code has expired" - Code is older than 30 days
   - "This interview code has already been used" - Code was already redeemed
   - "You already have access to this interview" - Already joined

## Database Maintenance

### Manual Cleanup

To manually clean up expired invites, you can run:

```sql
-- Mark invites older than 30 days as expired
UPDATE interview_invites 
SET status = 'expired' 
WHERE created_at < NOW() - INTERVAL '30 days' 
AND status = 'pending';
```

### Automatic Cleanup

The system includes automatic cleanup via the `/cleanup-expired-invites` endpoint.

## Troubleshooting

### Common Issues

1. **"Interview code is expired"**
   - Solution: The recruiter needs to send a new invite
   - The system will automatically update existing invites

2. **"Invalid interview code"**
   - Check that the code is exactly 6 digits
   - Verify the code hasn't been mistyped

3. **"Already have access"**
   - The candidate has already joined this interview
   - Check their dashboard for the interview

### Database Issues

1. **Duplicate Records**: 
   - The new system prevents this automatically
   - Old duplicates can be cleaned up manually

2. **Expired Codes**:
   - Run the cleanup endpoint or manual SQL
   - New invites will have fresh codes

## Migration Notes

### For Existing Data

If you have existing data with issues:

1. **Clean up expired invites**:
   ```sql
   UPDATE interview_invites 
   SET status = 'expired' 
   WHERE created_at < NOW() - INTERVAL '30 days' 
   AND status = 'pending';
   ```

2. **Remove duplicate invites** (if any):
   ```sql
   DELETE FROM interview_invites 
   WHERE id NOT IN (
     SELECT MIN(id) 
     FROM interview_invites 
     GROUP BY email, interview_id
   );
   ```

### Testing

1. **Test duplicate handling**: Send multiple invites to the same email
2. **Test expiration**: Use old codes to verify expiration handling
3. **Test error messages**: Try invalid codes and expired codes

## Security Considerations

1. **Code Validation**: All codes are validated server-side
2. **Status Tracking**: Prevents reuse of already accepted codes
3. **Automatic Expiration**: Reduces security risk from old codes
4. **Access Control**: Users can only access their own interviews

## Future Enhancements

1. **Custom Expiration Times**: Allow recruiters to set custom expiration periods
2. **Bulk Operations**: Better support for managing multiple invites
3. **Analytics**: Track invite usage and success rates
4. **Reminder Emails**: Automatic reminders for pending invites 