import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const website = formData.get("website") as string;

    if (!name) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    // Check if company already exists
    const existingCompany = await prisma.company.findUnique({
      where: { owner_id: session.userId },
    });

    if (existingCompany) {
      // Update existing company
      await prisma.company.update({
        where: { owner_id: session.userId },
        data: {
          name,
          description: description || null,
          website: website || null,
          updated_at: new Date(),
        },
      });
    } else {
      // Create new company
      await prisma.company.create({
        data: {
          name,
          description: description || null,
          website: website || null,
          owner_id: session.userId,
        },
      });
    }

    return NextResponse.redirect(new URL("/employer/company-profile?saved=true", request.url));
  } catch (error) {
    console.error("Error updating company profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
