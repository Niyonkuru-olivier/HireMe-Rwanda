# Email Notification Setup

This application sends email notifications to employees when their job application status changes (shortlisted, rejected, or hired).

## Environment Variables Required

Add these variables to your `.env.local` file:

```env
# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Alternative email environment variables
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Application URL (for email links)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password as `SMTP_PASS` or `EMAIL_PASS`

## Other Email Providers

### Outlook/Hotmail
```env
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT="587"
```

### Yahoo Mail
```env
SMTP_HOST="smtp.mail.yahoo.com"
SMTP_PORT="587"
```

### Custom SMTP Server
```env
SMTP_HOST="your-smtp-server.com"
SMTP_PORT="587"
SMTP_USER="your-username"
SMTP_PASS="your-password"
```

## Testing Email Configuration

The email service will automatically verify the configuration on startup. Check the console logs for:
- ✅ "Email server is ready to send messages" (success)
- ❌ "Email server configuration error" (failure)

## Email Templates

The system includes three email templates:
- **Shortlisted**: Congratulatory message with next steps
- **Rejected**: Encouraging message with suggestions
- **Hired**: Celebration message with onboarding info

All emails are HTML-formatted with responsive design and include:
- Company branding
- Personalized content
- Action buttons
- Professional styling
