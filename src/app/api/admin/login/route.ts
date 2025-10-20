import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "changeme");

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });

    // Check password
    const isValid = await compare(password, admin.password);
    if (!isValid) return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });

    // Create JWT token for admin
    const token = await new SignJWT({ role: "ADMIN" })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(admin.id.toString())
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    const res = NextResponse.json({ message: "Login successful", admin: { id: admin.id, email: admin.email } });
    res.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res;
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
