import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "changeme");

export async function POST(req: NextRequest) {
	try {
		const { token, password } = await req.json();
		if (!token || !password) return NextResponse.json({ error: "Missing token or password" }, { status: 400 });
		const { payload } = await jwtVerify(token, secret);
		const email = String(payload.email || "");
		if (!email) return NextResponse.json({ error: "Invalid token" }, { status: 400 });

		if (String(password).length < 8) return NextResponse.json({ error: "Password too short" }, { status: 400 });
		const hashed = await bcrypt.hash(password, 10);
		await prisma.user.update({ where: { email }, data: { password: hashed } });
		return NextResponse.json({ ok: true });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
	}
}
