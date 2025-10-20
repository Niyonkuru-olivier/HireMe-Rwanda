import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sendApplicationStatusNotification } from "@/lib/email";

interface RouteParams {
  params: { id: string };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const applicationId = parseInt(resolvedParams.id);
    const formData = await request.formData();
    const status = formData.get("status") as string;

    if (!["APPLIED", "SHORTLISTED", "REJECTED", "HIRED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Verify application ownership (employer owns the job) and get user info
    const application = await prisma.application.findFirst({
      where: { 
        id: applicationId,
        job: { 
          company: { owner_id: session.userId }
        }
      },
      include: { 
        job: { 
          include: { company: true }
        },
        user: true
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Update application status
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: status as any },
    });

    // Send email notification to employee
    try {
      await sendApplicationStatusNotification(
        application.user.email,
        application.user.full_name,
        application.job.title,
        application.job.company?.name || "Company",
        status as 'SHORTLISTED' | 'REJECTED' | 'HIRED'
      );
      console.log(`Email notification sent to ${application.user.email} for application status: ${status}`);
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
      // Don't fail the request if email fails, just log it
    }

    // Redirect back to applicants list
    return NextResponse.redirect(new URL(`/employer/applicants/job/${application.job_id}`, request.url));
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
