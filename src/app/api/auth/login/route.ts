import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "changeme");

export async function POST(req: NextRequest) {
	try {
		const { email, password } = await req.json();
		if (!email || !password) return NextResponse.json({ error: "Missing credentials" }, { status: 400 });

		// Try normal users first
		const user = await prisma.user.findUnique({ where: { email } });
		if (user) {
			const ok = await bcrypt.compare(password, user.password);
			if (!ok) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

			const token = await new SignJWT({ sub: String(user.id), role: user.role })
				.setProtectedHeader({ alg: "HS256" })
				.setIssuedAt()
				.setExpirationTime("7d")
				.sign(secret);

			const res = NextResponse.json({ ok: true, redirect: user.role === "EMPLOYEE" ? "/employee/dashboard" : "/employer" });
			res.cookies.set("token", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
			return res;
		}

		// Fallback to admin credentials
		const admin = await prisma.admin.findUnique({ where: { email } });
		if (!admin) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

		const isAdminOk = await bcrypt.compare(password, admin.password);
		if (!isAdminOk) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

		const adminToken = await new SignJWT({ role: "ADMIN" })
			.setProtectedHeader({ alg: "HS256" })
			.setSubject(String(admin.id))
			.setIssuedAt()
			.setExpirationTime("7d")
			.sign(secret);

		const res = NextResponse.json({ ok: true, redirect: "/admin/dashboard" });
		res.cookies.set("token", adminToken, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
		return res;
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
	}
}
