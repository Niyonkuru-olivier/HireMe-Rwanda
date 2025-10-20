import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Check if user already exists as employee or employer
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: `This email is already registered as ${existingUser.role.toLowerCase()}. Cannot create admin account.` },
        { status: 409 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({ where: { email } });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin already exists." },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create new admin
    const newAdmin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      message: "New admin added successfully.",
      admin: {
        id: newAdmin.id,
        email: newAdmin.email,
      },
    });
  } catch (error) {
    console.error("Add new admin error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
