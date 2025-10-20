import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export default async function EmployeeDashboard() {
	const session = await getSession();
	if (!session || session.role !== "EMPLOYEE") {
		return <div style={{ padding: 20 }}>Unauthorized. <Link href="/auth/login">Login</Link></div>;
	}
	
	const now = new Date();
	const userId = session.userId;
	
	const applications = await prisma.application.findMany({
		where: { user_id: userId },
		include: { job: { include: { company: true } } },
		orderBy: { applied_at: "desc" },
	});
	
	// Get non-expired announcements
	const announcements = await prisma.announcement.findMany({
		where: {
			OR: [
				{ expiration_date: null },
				{ expiration_date: { gt: now } }
			]
		},
		orderBy: { created_at: "desc" }
	});

	return (
		<div>
			<nav className="navbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", padding: "18px 30px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
				<div className="logo" style={{ fontSize: "1.3rem", fontWeight: 700, color: "#00a859" }}>JobConnect Rwanda</div>
				<div className="nav-links" style={{ display: "flex", gap: 16 }}>
					<Link href="/jobs">Jobs</Link>
					<Link href="/employee/profile">Profile</Link>
					<Link href="/employee/documents">Documents</Link>
					<Link href="/auth/logout">Logout</Link>
				</div>
			</nav>

			<section className="announcements" style={{ maxWidth: 900, margin: "30px auto 0", background: "#fff", padding: 25, borderRadius: 10, boxShadow: "0 4px 10px rgba(0,0,0,0.08)", borderTop: "5px solid #00a859" }}>
				<h2 style={{ color: "#00a859", marginBottom: 15, fontSize: "1.4rem" }}>Announcements</h2>
				{announcements.length ? announcements.map(a => (
					<div key={a.id} className="ann-card" style={{ background: "#e9f8f0", borderLeft: "5px solid #00a859", padding: "15px 20px", marginBottom: 15, borderRadius: 8, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
						<strong style={{ display: "block", fontSize: "1.1rem", color: "#00a859", marginBottom: 6 }}>{a.title}</strong>
						<p style={{ margin: 5, color: "#333", lineHeight: 1.5 }}>{a.content}</p>
						<small style={{ display: "block", color: "#666", fontSize: ".85rem", marginTop: 5 }}>{new Date(a.created_at).toLocaleString()}</small>
					</div>
				)) : <p className="no-ann" style={{ color: "#777", fontStyle: "italic", textAlign: "center" }}>No announcements at this time.</p>}
			</section>

			<div className="container" style={{ maxWidth: 900, margin: "40px auto", background: "#fff", padding: 30, borderRadius: 10, boxShadow: "0 4px 10px rgba(0,0,0,0.08)" }}>
				<h2 style={{ color: "#00a859", marginBottom: 20 }}>My Applications</h2>
				{applications.length ? (
					<table style={{ width: "100%", borderCollapse: "collapse" }}>
						<thead>
							<tr>
								<th style={{ border: "1px solid #ddd", padding: 10, background: "#00a859", color: "#fff", textAlign: "left" }}>Job Title</th>
								<th style={{ border: "1px solid #ddd", padding: 10, background: "#00a859", color: "#fff", textAlign: "left" }}>Company</th>
								<th style={{ border: "1px solid #ddd", padding: 10, background: "#00a859", color: "#fff", textAlign: "left" }}>Applied On</th>
								<th style={{ border: "1px solid #ddd", padding: 10, background: "#00a859", color: "#fff", textAlign: "left" }}>Status</th>
							</tr>
						</thead>
						<tbody>
							{applications.map(app => (
								<tr key={app.id}>
									<td style={{ border: "1px solid #ddd", padding: 10 }}>{app.job.title}</td>
									<td style={{ border: "1px solid #ddd", padding: 10 }}>{app.job.company?.name}</td>
									<td style={{ border: "1px solid #ddd", padding: 10 }}>{new Date(app.applied_at).toLocaleDateString()}</td>
									<td style={{ border: "1px solid #ddd", padding: 10, fontWeight: 600 }}>{app.status}</td>
								</tr>
							))}
						</tbody>
					</table>
				) : <p>You haven’t applied for any jobs yet.</p>}
			</div>
		</div>
	);
}
