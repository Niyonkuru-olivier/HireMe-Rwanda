import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Job, Company } from "@prisma/client";

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

export default async function JobsPage({ searchParams }: { searchParams: Promise<{ q?: string; location?: string; type?: string }> }) {
	const resolvedSearchParams = await searchParams;
	const { q, location, type } = resolvedSearchParams || {};
	const now = new Date();
	
	const where: {
		OR: Array<{ deadline: null } | { deadline: { gt: Date } }>;
		title?: { contains: string; mode: "insensitive" };
		location?: string;
		type?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
	} = {
		// Only show jobs with no deadline or deadline in the future
		OR: [
			{ deadline: null },
			{ deadline: { gt: now } }
		]
	};
	
	if (q) where.title = { contains: q, mode: "insensitive" };
	if (location) where.location = location;
	if (type) where.type = type as "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
	
	let jobs: (Job & { company: Company | null })[] = [];
	try {
		jobs = await prisma.job.findMany({ where, include: { company: true }, orderBy: { created_at: "desc" } });
	} catch (error) {
		console.error('Database connection error:', error);
		// Continue with empty array if database is not available
	}

	return (
		<div>
			<nav className="navbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", padding: "18px 30px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
				<div className="logo" style={{ fontSize: "1.3rem", fontWeight: 700, color: "#00a859" }}>JobConnect Rwanda</div>
				<div className="nav-links" style={{ display: "flex", gap: 16 }}>
					<Link href="/employee/dashboard">Dashboard</Link>
					<Link href="/employee/profile">Profile</Link>
					<Link href="/employee/documents">Documents</Link>
					<Link href="/auth/logout">Logout</Link>
				</div>
			</nav>

			<form className="search-bar" method="GET" style={{ display: "flex", justifyContent: "center", gap: 12, padding: 30, background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
				<input type="text" name="q" placeholder="Search by job title or keyword" defaultValue={q || ""} style={{ padding: "10px 14px", border: "1px solid #ccc", borderRadius: 6, width: 220 }} />
				<select name="location" defaultValue={location || ""} style={{ padding: "10px 14px", border: "1px solid #ccc", borderRadius: 6, width: 220 }}>
					<option value="">All Locations</option>
					{["Kigali","Musanze","Huye","Rubavu"].map(loc => <option key={loc} value={loc}>{loc}</option>)}
				</select>
				<select name="type" defaultValue={type || ""} style={{ padding: "10px 14px", border: "1px solid #ccc", borderRadius: 6, width: 220 }}>
					<option value="">All Types</option>
					<option value="FULL_TIME">Full Time</option>
					<option value="PART_TIME">Part Time</option>
					<option value="CONTRACT">Contract</option>
					<option value="INTERNSHIP">Internship</option>
				</select>
				<button type="submit" style={{ background: "#00a859", color: "#fff", border: 0, padding: "10px 18px", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>Search</button>
			</form>

			<div className="container" style={{ maxWidth: 1000, margin: "40px auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", gap: 20, padding: "0 20px" }}>
				{jobs.length ? jobs.map(job => (
					<div key={job.id} className="job-card" style={{ background: "#fff", borderRadius: 10, padding: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", transition: "transform .2s" }}>
						<h3 style={{ margin: 0, color: "#00a859", fontSize: "1.2rem" }}>{job.title}</h3>
						<div className="company" style={{ color: "#333", fontWeight: 600, marginTop: 6 }}>{job.company?.name}</div>
						<div className="meta" style={{ color: "#777", fontSize: ".9rem", marginTop: 4 }}>{job.location} • {job.type}</div>
						<div className="salary" style={{ marginTop: 6, color: "#00914d", fontWeight: 600 }}>Salary: {job.salary || "Not Specified"}</div>
						<div className="actions" style={{ marginTop: 14 }}>
							<Link href={`/jobs/${job.id}/apply`} style={{ textDecoration: "none", background: "#00a859", color: "#fff", padding: "8px 14px", borderRadius: 6, fontWeight: 500 }}>Apply</Link>
						</div>
					</div>
				)) : (
					<p style={{ gridColumn: "1/-1", textAlign: "center" }}>No jobs found.</p>
				)}
			</div>

			<footer style={{ textAlign: "center", color: "#888", padding: 20, fontSize: ".9rem" }}>© 2025 JobConnect Rwanda. All Rights Reserved.</footer>
		</div>
	);
}
