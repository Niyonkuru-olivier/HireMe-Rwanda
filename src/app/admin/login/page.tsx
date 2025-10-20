"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Welcome, Admin!" });
        setTimeout(() => router.push("/admin/dashboard"), 1000);
      } else {
        setMessage({ type: "danger", text: data.error || "Invalid credentials" });
      }
    } catch {
      setMessage({
        type: "danger",
        text: "Something went wrong. Please try again later.",
      });
    }
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h2 style={headingStyle}>Admin Login</h2>

        {message && (
          <div
            style={{
              ...alertStyle,
              ...(message.type === "success"
                ? successStyle
                : message.type === "danger"
                ? dangerStyle
                : infoStyle),
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter admin email"
            required
            style={inputStyle}
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */
const pageStyle: React.CSSProperties = {
  fontFamily: "Arial, Helvetica, sans-serif",
  backgroundColor: "#f0f2f5",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const containerStyle: React.CSSProperties = {
  background: "#fff",
  padding: "40px 30px",
  borderRadius: 10,
  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
  width: 350,
};

const headingStyle: React.CSSProperties = {
  textAlign: "center",
  marginBottom: 25,
  color: "#333",
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const inputStyle: React.CSSProperties = {
  padding: 10,
  marginBottom: 20,
  border: "1px solid #ccc",
  borderRadius: 5,
  fontSize: 14,
  outline: "none",
};

const buttonStyle: React.CSSProperties = {
  padding: 12,
  backgroundColor: "#4caf50",
  color: "#fff",
  border: "none",
  fontSize: 16,
  borderRadius: 5,
  cursor: "pointer",
  transition: "background 0.3s ease",
};

const alertStyle: React.CSSProperties = {
  padding: 10,
  marginBottom: 15,
  borderRadius: 5,
  fontSize: 14,
  textAlign: "center",
};

const successStyle: React.CSSProperties = { backgroundColor: "#d4edda", color: "#155724" };
const dangerStyle: React.CSSProperties = { backgroundColor: "#f8d7da", color: "#721c24" };
const infoStyle: React.CSSProperties = { backgroundColor: "#cce5ff", color: "#004085" };
