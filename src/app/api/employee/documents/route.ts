import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { isAllowedFile, saveUploadedFile } from "@/lib/uploads";

export async function POST(req: NextRequest) {
	const session = await getSession();
	if (!session || session.role !== "EMPLOYEE") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const form = await req.formData();
	const file = form.get("document");
	const file_type = String(form.get("file_type") || "CV");
	if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
	const filename = (file as any).name as string;
	if (!filename || !isAllowedFile(filename)) return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
	const saved = await saveUploadedFile(file);
	await prisma.employeeDocument.create({ data: { user_id: session.userId, file_name: saved.filename, file_path: saved.filepath, file_type: file_type as any } });
	return NextResponse.redirect(`${process.env.APP_URL || "http://localhost:3000"}/employee/documents`, { status: 303 });
}
