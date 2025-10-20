import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
	try {
		const { full_name, national_id, email, role, password, confirm_password } = await req.json();

		if (!full_name || full_name.trim().length < 3) return NextResponse.json({ error: "Invalid full name" }, { status: 400 });
		if (!/^\d{16}$/.test(String(national_id || ""))) return NextResponse.json({ error: "National ID must be 16 digits" }, { status: 400 });
		if (!/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(String(email || ""))) return NextResponse.json({ error: "Invalid email" }, { status: 400 });
		if (role !== "EMPLOYEE" && role !== "EMPLOYER") return NextResponse.json({ error: "Invalid role" }, { status: 400 });
		if (!password || password !== confirm_password) return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });

		// Check if user already exists
		const exists = await prisma.user.findFirst({ where: { OR: [ { email }, { national_id } ] } });
		if (exists) return NextResponse.json({ error: "Email or National ID already registered" }, { status: 409 });

		// Check if email is already registered as admin
		const existingAdmin = await prisma.admin.findUnique({ where: { email } });
		if (existingAdmin) {
			return NextResponse.json({ 
				error: "This email is already registered as an admin. Cannot register as employee or employer." 
			}, { status: 409 });
		}

		const hashed = await bcrypt.hash(password, 10);
		await prisma.user.create({
			data: { full_name, national_id, email, role, password: hashed },
		});

		return NextResponse.json({ ok: true }, { status: 200 });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
	}
}
