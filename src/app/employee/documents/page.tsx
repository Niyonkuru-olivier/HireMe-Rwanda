import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export default async function DocumentsPage() {
	const session = await getSession();
	if (!session || session.role !== "EMPLOYEE") return <div style={{ padding: 20 }}>Unauthorized. <Link href="/auth/login">Login</Link></div>;
	const docs = await prisma.employeeDocument.findMany({ where: { user_id: session.userId }, orderBy: { uploaded_at: "desc" } });
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

			<div className="container" style={{ maxWidth: 800, margin: "40px auto", background: "#fff", padding: 30, borderRadius: 10, boxShadow: "0 4px 10px rgba(0,0,0,0.08)" }}>
				<h2 style={{ color: "#00a859", marginBottom: 20 }}>My Documents</h2>
				<form method="POST" action="/api/employee/documents" encType="multipart/form-data">
					<label>Document Type:</label>
					<select name="file_type" required>
						<option value="">-- Select Type --</option>
						<option value="CV">CV</option>
						<option value="DIPLOMA">Diploma</option>
						<option value="CERTIFICATE">Certificate</option>
					</select>
					<label style={{ marginTop: 10 }}>Upload File:</label>
					<input type="file" name="document" required />
					<input type="submit" value="Upload Document" style={{ background: "#00a859", color: "#fff", padding: "10px 18px", border: 0, borderRadius: 6, marginTop: 10, cursor: "pointer" }} />
				</form>

				<h3 style={{ marginTop: 30, color: "#00a859" }}>Uploaded Files</h3>
				{docs.length ? (
					<table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
						<thead>
							<tr>
								<th style={{ border: "1px solid #ddd", padding: 10, background: "#00a859", color: "#fff", textAlign: "left" }}>Type</th>
								<th style={{ border: "1px solid #ddd", padding: 10, background: "#00a859", color: "#fff", textAlign: "left" }}>File Name</th>
								<th style={{ border: "1px solid #ddd", padding: 10, background: "#00a859", color: "#fff", textAlign: "left" }}>Uploaded</th>
							</tr>
						</thead>
						<tbody>
							{docs.map(d => (
								<tr key={d.id}>
									<td style={{ border: "1px solid #ddd", padding: 10 }}>{d.file_type}</td>
									<td style={{ border: "1px solid #ddd", padding: 10 }}><a href={`/uploads/${d.file_name}`} target="_blank" rel="noopener">{d.file_name}</a></td>
									<td style={{ border: "1px solid #ddd", padding: 10 }}>{new Date(d.uploaded_at).toLocaleDateString()}</td>
								</tr>
							))}
						</tbody>
					</table>
				) : <p>No documents uploaded yet.</p>}
			</div>
		</div>
	);
}
