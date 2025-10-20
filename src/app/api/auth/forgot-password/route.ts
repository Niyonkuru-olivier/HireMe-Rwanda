import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "changeme");

export async function POST(req: NextRequest) {
	try {
		const { email } = await req.json();
		if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
		const user = await prisma.user.findUnique({ where: { email } });
		if (user) {
			const token = await new SignJWT({ email })
				.setProtectedHeader({ alg: "HS256" })
				.setIssuedAt()
				.setExpirationTime("30m")
				.sign(secret);

			const resetUrl = `${process.env.APP_URL || "http://localhost:3000"}/auth/reset-password?token=${encodeURIComponent(token)}`;

			const transporter = nodemailer.createTransport({
				host: process.env.SMTP_HOST,
				port: Number(process.env.SMTP_PORT || 587),
				secure: String(process.env.SMTP_SECURE || "false") === "true",
				auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
			});
			await transporter.sendMail({
				from: process.env.SMTP_FROM,
				to: email,
				subject: "Reset Your Password",
				html: `<p>Hello,</p><p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetUrl}">Reset Password</a></p>`,
			});
		}
		return NextResponse.json({ ok: true });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
	}
}
