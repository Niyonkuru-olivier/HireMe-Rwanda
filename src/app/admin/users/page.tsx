"use client";

import { useEffect, useState } from "react";

interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  // Fetch all users
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
        } else {
          setMessage({ type: "danger", text: data.error || "Failed to load users." });
        }
      } catch {
        setMessage({ type: "danger", text: "Server error while fetching users." });
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Delete/Block user
  async function handleDelete(id: number) {
    if (!confirm("Remove this user?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        setMessage({ type: "success", text: "User removed successfully." });
      } else {
        setMessage({ type: "danger", text: data.error || "Failed to remove user." });
      }
    } catch {
      setMessage({ type: "danger", text: "Server error while removing user." });
    }
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={headingStyle}>Manage Users</h1>

        {message && (
          <div
            style={{
              ...alertStyle,
              ...(message.type === "success" ? successStyle : dangerStyle),
            }}
          >
            {message.text}
          </div>
        )}

        {loading ? (
          <p style={{ textAlign: "center", marginTop: 20 }}>Loading users...</p>
        ) : users.length > 0 ? (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={tdStyle}>{u.id}</td>
                  <td style={tdStyle}>{u.full_name}</td>
                  <td style={tdStyle}>{u.email}</td>
                  <td style={tdStyle}>{u.role}</td>
                  <td style={tdStyle}>
                    <button onClick={() => handleDelete(u.id)} style={deleteBtnStyle}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: "center", marginTop: 20 }}>No users found.</p>
        )}

        <p style={{ marginTop: 20, textAlign: "center" }}>
          <a href="/admin/dashboard" style={backLinkStyle}>
            ← Back to Dashboard
          </a>
        </p>
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */
const pageStyle: React.CSSProperties = {
  fontFamily: "Arial, Helvetica, sans-serif",
  background: "#f5f7f7",
  color: "#222",
  margin: 0,
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1000,
  width: "95%",
  background: "#fff",
  padding: 25,
  borderRadius: 10,
  boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
};

const headingStyle: React.CSSProperties = {
  color: "#00a859",
  textAlign: "center",
  marginBottom: 20,
  fontSize: "1.5rem",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  border: "1px solid #ddd",
};

const thStyle: React.CSSProperties = {
  background: "#00a859",
  color: "#fff",
  padding: 10,
  textAlign: "left",
};

const tdStyle: React.CSSProperties = {
  padding: 10,
  border: "1px solid #ddd",
};

const deleteBtnStyle: React.CSSProperties = {
  background: "#ff4d4d",
  color: "#fff",
  padding: "6px 12px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
};

const alertStyle: React.CSSProperties = {
  padding: 10,
  borderRadius: 6,
  marginBottom: 15,
  textAlign: "center",
  fontWeight: 500,
};

const successStyle: React.CSSProperties = {
  backgroundColor: "#d4edda",
  color: "#155724",
};

const dangerStyle: React.CSSProperties = {
  backgroundColor: "#f8d7da",
  color: "#721c24",
};

const backLinkStyle: React.CSSProperties = {
  color: "#00a859",
  textDecoration: "none",
  fontWeight: 500,
};
