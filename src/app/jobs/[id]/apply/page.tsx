import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export default async function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
	const session = await getSession();
	if (!session || session.role !== "EMPLOYEE") {
		return <div style={{ padding: 20 }}>Unauthorized. <Link href="/auth/login">Login</Link></div>;
	}
	const resolvedParams = await params;
	const jobId = Number(resolvedParams.id);
	const job = await prisma.job.findUnique({ where: { id: jobId }, include: { company: true } });
	if (!job) return <div style={{ padding: 20 }}>Job not found</div>;

	return (
		<div>
			<nav className="navbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", padding: "18px 30px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
				<div className="logo" style={{ fontSize: "1.3rem", fontWeight: 700, color: "#00a859" }}>JobConnect Rwanda</div>
				<div className="nav-links" style={{ display: "flex", gap: 16 }}>
					<Link href="/jobs">Jobs</Link>
					<Link href="/employee/dashboard">Dashboard</Link>
					<Link href="/auth/logout">Logout</Link>
				</div>
			</nav>

			<div className="container" style={{ maxWidth: 700, margin: "40px auto", background: "#fff", padding: 30, borderRadius: 10, boxShadow: "0 4px 10px rgba(0,0,0,0.08)" }}>
				<h2 style={{ color: "#00a859", marginBottom: 10 }}>Apply for {job.title}</h2>
				<p><strong>Company:</strong> {job.company?.name} | <strong>Location:</strong> {job.location}</p>
				<p><strong>Description:</strong> {job.description}</p>
				<p><strong>Requirements:</strong> {job.requirements}</p>

				<form method="POST" action={`/api/applications/${job.id}/apply`} encType="multipart/form-data">
					<label htmlFor="cover_letter" style={{ display: "block", marginTop: 15, fontWeight: 600 }}>Upload Cover Letter (PDF or DOCX)</label>
					<input type="file" name="cover_letter" id="cover_letter" accept=".pdf,.doc,.docx" required />
					<button type="submit" style={{ background: "#00a859", color: "#fff", padding: "10px 18px", border: 0, borderRadius: 6, marginTop: 15, cursor: "pointer" }}>Submit Application</button>
				</form>
			</div>
		</div>
	);
}
