import fs from "fs/promises";
import path from "path";

const ALLOWED_EXTENSIONS = new Set(["pdf", "doc", "docx"]);

export function isAllowedFile(filename: string): boolean {
	const ext = filename.split(".").pop()?.toLowerCase() || "";
	return ALLOWED_EXTENSIONS.has(ext);
}

export async function saveUploadedFile(file: File): Promise<{ filename: string; filepath: string }> {
	const bytes = await file.arrayBuffer();
	const buffer = Buffer.from(bytes);
	const uploadsDir = path.join(process.cwd(), "public", "uploads");
	await fs.mkdir(uploadsDir, { recursive: true });
	const orig = file.name;
	const safe = orig.replace(/[^a-zA-Z0-9._-]/g, "_");
	const unique = `${Date.now()}_${safe}`;
	const fullPath = path.join(uploadsDir, unique);
	await fs.writeFile(fullPath, buffer);
	return { filename: unique, filepath: fullPath };
}
