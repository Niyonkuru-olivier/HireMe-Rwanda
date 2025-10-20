import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

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
    const jobId = parseInt(resolvedParams.id);

    // Verify job ownership
    const job = await prisma.job.findFirst({
      where: { 
        id: jobId,
        company: { owner_id: session.userId }
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const requirements = formData.get("requirements") as string;
    const location = formData.get("location") as string;
    const salary = formData.get("salary") as string;
    const type = formData.get("type") as string;
    const deadline = formData.get("deadline") as string;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const jobData: any = {
      title: title.substring(0, 191), // Limit to 191 characters
      description: description.substring(0, 191), // Limit to 191 characters
      requirements: requirements ? requirements.substring(0, 191) : null, // Limit to 191 characters
      location: location ? location.substring(0, 191) : null, // Limit to 191 characters
      salary: salary ? salary.substring(0, 191) : null, // Limit to 191 characters
      type: type as any || "FULL_TIME",
      updated_at: new Date(),
    };

    if (deadline) {
      jobData.deadline = new Date(deadline);
    }

    await prisma.job.update({
      where: { id: jobId },
      data: jobData,
    });

    return NextResponse.redirect(new URL("/employer/dashboard", request.url));
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const jobId = parseInt(resolvedParams.id);

    // Verify job ownership
    const job = await prisma.job.findFirst({
      where: { 
        id: jobId,
        company: { owner_id: session.userId }
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    await prisma.job.delete({
      where: { id: jobId },
    });

    return NextResponse.redirect(new URL("/employer/dashboard", request.url));
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
