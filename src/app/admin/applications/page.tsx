"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Application = {
  id: number;
  status: string;
  applied_at: string;
  user: { id: number; full_name: string; email: string };
  job: { id: number; title: string; company: { name: string | null } };
};

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/applications");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch applications");
      setApplications(data.applications || []);
    } catch (e: any) {
      setError(e.message || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: number, status: string) {
    try {
      const res = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: id, status }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }
      await load();
    } catch (e: any) {
      alert(e.message || "Failed to update");
    }
  }

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", background: "#f5f7f7", minHeight: "100vh", padding: 20 }}>
      <div style={{ maxWidth: 1100, margin: "20px auto", background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", padding: 20 }}>
        <h1 style={{ color: "#00a859", marginBottom: 16 }}>Applications</h1>
        {error ? <div style={{ color: "#a33", marginBottom: 12 }}>{error}</div> : null}
        {loading ? (
          <div>Loading...</div>
        ) : applications.length === 0 ? (
          <div>No applications.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>ID</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Applicant</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Job</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Company</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Applied</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Status</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a) => (
                <tr key={a.id}>
                  <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{a.id}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{a.user.full_name} ({a.user.email})</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{a.job.title}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{a.job.company?.name || "—"}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{new Date(a.applied_at).toLocaleString()}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{a.status}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0", display: "flex", gap: 8 }}>
                    <button onClick={() => updateStatus(a.id, "SHORTLISTED")} style={{ padding: "6px 10px", borderRadius: 6, border: 0, background: "#1e90ff", color: "#fff", cursor: "pointer" }}>Shortlist</button>
                    <button onClick={() => updateStatus(a.id, "REJECTED")} style={{ padding: "6px 10px", borderRadius: 6, border: 0, background: "#ff4d4d", color: "#fff", cursor: "pointer" }}>Reject</button>
                    <button onClick={() => updateStatus(a.id, "HIRED")} style={{ padding: "6px 10px", borderRadius: 6, border: 0, background: "#00a859", color: "#fff", cursor: "pointer" }}>Hire</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <p style={{ marginTop: 16 }}>
          <Link href="/admin/dashboard" style={{ color: "#00a859", textDecoration: "none" }}>← Back to Dashboard</Link>
        </p>
      </div>
    </div>
  );
}
