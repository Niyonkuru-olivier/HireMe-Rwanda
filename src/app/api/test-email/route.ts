import { NextRequest, NextResponse } from "next/server";
import { sendApplicationStatusNotification, verifyEmailConfig } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email, name, jobTitle, companyName, status } = await req.json();

    // Verify email configuration first
    const isEmailConfigured = await verifyEmailConfig();
    if (!isEmailConfigured) {
      return NextResponse.json({ 
        error: "Email configuration is not properly set up. Please check your environment variables." 
      }, { status: 500 });
    }

    // Validate required fields
    if (!email || !name || !jobTitle || !companyName || !status) {
      return NextResponse.json({ 
        error: "Missing required fields: email, name, jobTitle, companyName, status" 
      }, { status: 400 });
    }

    // Validate status
    if (!['SHORTLISTED', 'REJECTED', 'HIRED'].includes(status)) {
      return NextResponse.json({ 
        error: "Invalid status. Must be one of: SHORTLISTED, REJECTED, HIRED" 
      }, { status: 400 });
    }

    // Send test email
    const result = await sendApplicationStatusNotification(
      email,
      name,
      jobTitle,
      companyName,
      status as 'SHORTLISTED' | 'REJECTED' | 'HIRED'
    );

    if (result.success) {
      return NextResponse.json({ 
        message: "Test email sent successfully!",
        messageId: result.messageId 
      });
    } else {
      return NextResponse.json({ 
        error: "Failed to send email: " + result.error 
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const isEmailConfigured = await verifyEmailConfig();
    
    return NextResponse.json({
      emailConfigured: isEmailConfigured,
      message: isEmailConfigured 
        ? "Email service is properly configured" 
        : "Email service is not configured. Please check your environment variables."
    });
  } catch (error) {
    console.error("Email config check error:", error);
    return NextResponse.json({ 
      error: "Failed to check email configuration" 
    }, { status: 500 });
  }
}
