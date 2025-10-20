"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddNewAdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    try {
      const res = await fetch("/api/admin/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "New admin added successfully!" });
        setTimeout(() => router.push("/admin/dashboard"), 1000);
      } else {
        setMessage({ type: "danger", text: data.error || "Failed to add admin." });
      }
    } catch {
      setMessage({ type: "danger", text: "Server error. Try again later." });
    }
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={headingStyle}>Add New Admin</h1>

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

        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="email"
            placeholder="Admin email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Add Admin
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 20 }}>
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
  margin: 0,
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#222",
};

const containerStyle: React.CSSProperties = {
  maxWidth: 500,
  width: "90%",
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

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 12,
  marginBottom: 15,
  border: "1px solid #ccc",
  borderRadius: 6,
  fontSize: 14,
};

const buttonStyle: React.CSSProperties = {
  background: "#00a859",
  color: "#fff",
  border: "none",
  padding: "12px 16px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: "bold",
  width: "100%",
  fontSize: 15,
  transition: "background 0.3s ease",
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
