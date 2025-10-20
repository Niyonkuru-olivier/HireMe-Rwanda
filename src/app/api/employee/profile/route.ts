import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  // Get session
  const session = await getSession();
  if (!session || session.role !== "EMPLOYEE") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse form data
  const form = await req.formData();
  const phone = String(form.get("phone") || "");
  const location = String(form.get("location") || "");
  const education = String(form.get("education") || "");
  const skills = String(form.get("skills") || "");
  const experience = String(form.get("experience") || "");

  // Upsert employee profile
  await prisma.employeeProfile.upsert({
    where: { user_id: session.userId },
    update: { phone, location, education, skills, experience },
    create: { user_id: session.userId, phone, location, education, skills, experience },
  });

  // ✅ Redirect to profile page with success query param
  const redirectUrl = `${process.env.APP_URL || "http://localhost:3000"}/employee/profile?saved=true`;
  return NextResponse.redirect(redirectUrl, { status: 303 });
}
