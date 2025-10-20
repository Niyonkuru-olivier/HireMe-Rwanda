import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
  },
});

// Verify email configuration
export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('Email server configuration error:', error);
    return false;
  }
}

// Email templates
export const emailTemplates = {
  applicationShortlisted: (jobTitle: string, companyName: string, employeeName: string) => ({
    subject: `🎉 Great News! You've been shortlisted for ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #00a859, #1abc9c); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Congratulations!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">You've been shortlisted for a job opportunity</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #00a859; margin-top: 0;">Hello ${employeeName},</h2>
          
          <p>We have great news! Your application for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been shortlisted.</p>
          
          <div style="background: #e8f5e8; border-left: 4px solid #00a859; padding: 15px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #00a859;">What happens next?</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>The employer will review your profile in detail</li>
              <li>You may be contacted for an interview</li>
              <li>Keep an eye on your email for further updates</li>
            </ul>
          </div>
          
          <p>This is an exciting step forward in your job search journey. We wish you the best of luck!</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/employee/dashboard" 
               style="background: #00a859; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Your Applications
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #666; font-size: 14px; margin: 0;">
            Best regards,<br>
            JobConnect Rwanda Team
          </p>
        </div>
      </div>
    `
  }),

  applicationRejected: (jobTitle: string, companyName: string, employeeName: string) => ({
    subject: `Update on your application for ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; border-left: 4px solid #dc3545;">
          <h1 style="color: #333; margin-top: 0;">Application Update</h1>
          
          <h2 style="color: #00a859;">Hello ${employeeName},</h2>
          
          <p>Thank you for your interest in the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
          
          <p>After careful consideration, we regret to inform you that we have decided not to move forward with your application at this time.</p>
          
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #856404;">Don't be discouraged!</h3>
            <ul style="margin: 0; padding-left: 20px; color: #856404;">
              <li>This is just one opportunity among many</li>
              <li>Keep applying to other positions that match your skills</li>
              <li>Consider updating your profile and CV</li>
              <li>Each application is a learning experience</li>
            </ul>
          </div>
          
          <p>We encourage you to continue exploring other opportunities on our platform. Your perfect job match is out there!</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/jobs" 
               style="background: #00a859; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Browse More Jobs
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #666; font-size: 14px; margin: 0;">
            Best regards,<br>
            JobConnect Rwanda Team
          </p>
        </div>
      </div>
    `
  }),

  applicationHired: (jobTitle: string, companyName: string, employeeName: string) => ({
    subject: `🎉 Congratulations! You've been hired for ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Congratulations!</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px;">You've been hired!</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #28a745; margin-top: 0;">Hello ${employeeName},</h2>
          
          <p>We are thrilled to inform you that you have been <strong>hired</strong> for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>!</p>
          
          <div style="background: #d4edda; border-left: 4px solid #28a745; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <h3 style="margin: 0 0 15px 0; color: #155724;">What's next?</h3>
            <ul style="margin: 0; padding-left: 20px; color: #155724;">
              <li>You should receive contact from the employer soon</li>
              <li>Prepare for your first day at work</li>
              <li>Review any employment documents they provide</li>
              <li>Congratulations on this achievement!</li>
            </ul>
          </div>
          
          <p>This is a significant milestone in your career journey. We're proud to have been part of your success story!</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/employee/dashboard" 
               style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Your Applications
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #666; font-size: 14px; margin: 0;">
            Congratulations again!<br>
            JobConnect Rwanda Team
          </p>
        </div>
      </div>
    `
  })
};

// Send email function
export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const info = await transporter.sendMail({
      from: `"JobConnect Rwanda" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Send application status notification
export async function sendApplicationStatusNotification(
  employeeEmail: string,
  employeeName: string,
  jobTitle: string,
  companyName: string,
  status: 'SHORTLISTED' | 'REJECTED' | 'HIRED'
) {
  let template;
  
  switch (status) {
    case 'SHORTLISTED':
      template = emailTemplates.applicationShortlisted(jobTitle, companyName, employeeName);
      break;
    case 'REJECTED':
      template = emailTemplates.applicationRejected(jobTitle, companyName, employeeName);
      break;
    case 'HIRED':
      template = emailTemplates.applicationHired(jobTitle, companyName, employeeName);
      break;
    default:
      throw new Error('Invalid application status');
  }
  
  return await sendEmail(employeeEmail, template.subject, template.html);
}
