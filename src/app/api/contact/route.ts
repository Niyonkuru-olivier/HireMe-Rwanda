import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
	const contentType = req.headers.get("content-type") || "";
	let name = "";
	let email = "";
	let message = "";

	try {
		if (contentType.includes("application/json")) {
			const body = await req.json();
			name = (body.name || "").trim();
			email = (body.email || "").trim();
			message = (body.message || "").trim();
		} else {
			const formData = await req.formData();
			name = String(formData.get("name") || "").trim();
			email = String(formData.get("email") || "").trim();
			message = String(formData.get("message") || "").trim();
		}

		if (!name || !email || !message) {
			return NextResponse.json({ error: "All fields are required" }, { status: 400 });
		}

		const transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: Number(process.env.SMTP_PORT || 587),
			secure: String(process.env.SMTP_SECURE || "false") === "true",
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		});

		await transporter.sendMail({
			from: process.env.SMTP_FROM,
			to: process.env.SMTP_FROM,
			subject: `New Contact Form Message from ${name}`,
			text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
		});

		return NextResponse.redirect(`${process.env.APP_URL || "http://localhost:3000"}/`, { status: 303 });
	} catch (err) {
		console.error("Contact email error", err);
		return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
	}
}
