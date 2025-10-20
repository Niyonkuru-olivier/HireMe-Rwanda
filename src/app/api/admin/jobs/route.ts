import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 📌 GET — fetch all jobs (with company info)
export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      include: { company: true },
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs." },
      { status: 500 }
    );
  }
}

// 📌 POST — create a new job
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      companyId,
      location,
      salary,
      type = "FULL_TIME", // default enum
      deadline,
      requirements,
    } = body;

    // Validate required fields
    if (!title || !description || !companyId) {
      return NextResponse.json(
        { error: "Title, description, and companyId are required." },
        { status: 400 }
      );
    }

    // Create job in database
    const job = await prisma.job.create({
      data: {
        title,
        description,
        company_id: companyId,
        location: location || null,
        salary: salary || null,
        type: type as "FULL_TIME" | "PART_TIME" | "CONTRACT",
        deadline: deadline ? new Date(deadline) : null,
        requirements: requirements || null,
      },
    });

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job." },
      { status: 500 }
    );
  }
}
