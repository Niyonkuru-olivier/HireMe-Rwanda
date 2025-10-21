"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Job = {
  id: number;
  title: string;
  location: string | null;
  type: string;
  deadline: string | null;
  created_at: string;
  company: { name: string | null } | null;
};

export default function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // ✅ Fetch all jobs with company info
  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/jobs");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch jobs");
      setJobs(data.jobs || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ✅ Delete job function
  const deleteJob = async (jobId: number) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete job");
      }
      await fetchJobs(); // Refresh the list
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to delete job");
    }
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={{ color: "#00a859", marginBottom: 20 }}>Manage Jobs</h1>

        {error && (
          <div style={{ color: "#a33", marginBottom: 16, padding: 10, background: "#ffe6e6", borderRadius: 6 }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>Loading jobs...</div>
        ) : (
          <>
            {/* Jobs Table */}
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Title</th>
                  <th style={thStyle}>Company</th>
                  <th style={thStyle}>Location</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Deadline</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.length ? (
                  jobs.map((j) => (
                    <tr key={j.id}>
                      <td style={tdStyle}>{j.id}</td>
                      <td style={tdStyle}>{j.title}</td>
                      <td style={tdStyle}>{j.company?.name || "—"}</td>
                      <td style={tdStyle}>{j.location || "—"}</td>
                      <td style={tdStyle}>{j.type}</td>
                      <td style={tdStyle}>
                        {j.deadline ? new Date(j.deadline).toLocaleDateString() : "—"}
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => deleteJob(j.id)}
                          style={deleteBtnStyle}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: 20 }}>
                      No jobs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}

        <p style={{ marginTop: 20 }}>
          <Link href="/admin/dashboard" style={{ textDecoration: "none", color: "#00a859" }}>
            ← Back to Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */
const pageStyle: React.CSSProperties = {
  fontFamily: "Arial, Helvetica, sans-serif",
  background: "#f5f7f7",
  minHeight: "100vh",
  margin: 0,
  color: "#222",
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1000,
  margin: "30px auto",
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 20,
};

const thStyle: React.CSSProperties = {
  background: "#00a859",
  color: "#fff",
  padding: "10px",
  border: "1px solid #ddd",
  textAlign: "left",
};

const tdStyle: React.CSSProperties = {
  padding: "10px",
  border: "1px solid #ddd",
};

const deleteBtnStyle: React.CSSProperties = {
  background: "#ff4d4d",
  color: "#fff",
  padding: "6px 10px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
};
