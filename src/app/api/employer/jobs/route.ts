import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get company for this employer
    const company = await prisma.company.findUnique({
      where: { owner_id: session.userId },
    });

    if (!company) {
      return NextResponse.redirect(new URL("/employer/company-profile", request.url));
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

    const jobData: {
      title: string;
      description: string;
      requirements: string | null;
      location: string | null;
      salary: string | null;
      type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
      company_id: number;
      deadline?: Date;
    } = {
      title: title.substring(0, 191), // Limit to 191 characters
      description: description.substring(0, 191), // Limit to 191 characters
      requirements: requirements ? requirements.substring(0, 191) : null, // Limit to 191 characters
      location: location ? location.substring(0, 191) : null, // Limit to 191 characters
      salary: salary ? salary.substring(0, 191) : null, // Limit to 191 characters
      type: (type as "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP") || "FULL_TIME",
      company_id: company.id,
    };

    if (deadline) {
      jobData.deadline = new Date(deadline);
    }

    await prisma.job.create({
      data: jobData,
    });

    return NextResponse.redirect(new URL("/employer/dashboard", request.url));
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
