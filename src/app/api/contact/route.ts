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

		// Check if email is configured, if not use a simple logging approach
		if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
			console.log("📧 Contact Form Submission:", { 
				name, 
				email, 
				message, 
				timestamp: new Date().toISOString(),
				ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
			});
			
			// Store in database for now (you can check these later)
			try {
				const { prisma } = await import('@/lib/prisma');
				// You could create a contact_messages table if you want to store these
				// For now, we'll just log them
			} catch (dbError) {
				console.log("Database not available for contact storage");
			}
			
			return NextResponse.json({ 
				success: true, 
				message: "Thank you for your message! We'll get back to you soon.",
				note: "Message received and logged"
			});
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
			from: process.env.SMTP_FROM || process.env.SMTP_USER,
			to: process.env.SMTP_FROM || process.env.SMTP_USER,
			subject: `New Contact Form Message from ${name}`,
			text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
		});

		return NextResponse.json({ 
			success: true, 
			message: "Thank you for your message! We'll get back to you soon." 
		});
	} catch (err) {
		console.error("Contact email error", err);
		return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
	}
}
