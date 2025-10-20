import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sendApplicationStatusNotification } from "@/lib/email";

// 📌 GET — Fetch all job applications (with job + user info)
export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      include: {
        user: true,
        job: {
          include: { company: true },
        },
      },
      orderBy: {
        applied_at: "desc",
      },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications." },
      { status: 500 }
    );
  }
}

// 📌 PATCH — Update application status (admin only)
export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { applicationId, status } = await req.json();
    if (!applicationId || !status) {
      return NextResponse.json({ error: "Application ID and status are required." }, { status: 400 });
    }

    // Get application with user and job details for email notification
    const application = await prisma.application.findUnique({
      where: { id: Number(applicationId) },
      include: {
        user: true,
        job: {
          include: { company: true }
        }
      }
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }

    // Update application status
    const updated = await prisma.application.update({
      where: { id: Number(applicationId) },
      data: { status },
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

    return NextResponse.json({ application: updated });
  } catch (e) {
    console.error("Error updating application:", e);
    return NextResponse.json({ error: "Failed to update application." }, { status: 500 });
  }
}
