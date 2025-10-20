import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { isAllowedFile, saveUploadedFile } from "@/lib/uploads";

export async function POST(req: NextRequest, { params }: { params: { jobId: string } }) {
	const session = await getSession();
	if (!session || session.role !== "EMPLOYEE") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const jobId = Number(params.jobId);
	const job = await prisma.job.findUnique({ where: { id: jobId } });
	if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

	const form = await req.formData();
	const file = form.get("cover_letter");
	if (!(file instanceof File)) return NextResponse.json({ error: "Cover letter required" }, { status: 400 });
	const filename = (file as any).name as string;
	if (!filename || !isAllowedFile(filename)) return NextResponse.json({ error: "Invalid file type" }, { status: 400 });

	const exists = await prisma.application.findFirst({ where: { user_id: session.userId, job_id: jobId } });
	if (exists) return NextResponse.json({ error: "Already applied" }, { status: 409 });

	const saved = await saveUploadedFile(file);
	await prisma.application.create({ data: { user_id: session.userId, job_id: jobId, cover_letter: saved.filename } });
	return NextResponse.redirect(`${process.env.APP_URL || "http://localhost:3000"}/employee/dashboard`, { status: 303 });
}
