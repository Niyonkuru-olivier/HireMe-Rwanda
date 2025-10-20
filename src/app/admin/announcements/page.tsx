"use client";

import Link from "next/link";
import { useEffect, useState, FormEvent } from "react";
import { Announcement } from "@prisma/client";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  // ✅ Fetch announcements from API
  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/announcements");
      const data = await res.json();
      if (res.ok) setAnnouncements(data.announcements || data);
      else setMessage({ type: "danger", text: data.error || "Failed to fetch announcements." });
    } catch {
      setMessage({ type: "danger", text: "Server error while fetching announcements." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // ✅ Add new announcement
  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          content, 
          expiration_date: expirationDate || null 
        }),
      });

      if (res.ok) {
        setTitle("");
        setContent("");
        setExpirationDate("");
        fetchAnnouncements();
        setMessage({ type: "success", text: "Announcement added successfully!" });
      } else {
        const data = await res.json();
        setMessage({ type: "danger", text: data.error || "Failed to add announcement." });
      }
    } catch {
      setMessage({ type: "danger", text: "Server error while adding announcement." });
    }
  };

  // ✅ Delete announcement
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this announcement?")) return;

    try {
      const res = await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchAnnouncements();
        setMessage({ type: "success", text: "Announcement deleted successfully!" });
      } else {
        const data = await res.json();
        setMessage({ type: "danger", text: data.error || "Failed to delete announcement." });
      }
    } catch {
      setMessage({ type: "danger", text: "Server error while deleting announcement." });
    }
  };

  // ✅ Clean up expired announcements
  const handleCleanup = async () => {
    if (!confirm("Delete all expired announcements? This action cannot be undone.")) return;

    try {
      const res = await fetch("/api/admin/announcements/cleanup", { method: "POST" });
      const data = await res.json();
      
      if (res.ok) {
        fetchAnnouncements();
        setMessage({ 
          type: "success", 
          text: `Successfully deleted ${data.deletedCount} expired announcement(s)!` 
        });
      } else {
        setMessage({ type: "danger", text: data.error || "Failed to clean up expired announcements." });
      }
    } catch {
      setMessage({ type: "danger", text: "Server error while cleaning up announcements." });
    }
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h1 style={{ color: "#00a859", margin: 0 }}>Manage Announcements</h1>
          <button
            onClick={handleCleanup}
            style={{
              background: "#ff6b6b",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px"
            }}
          >
            Clean Up Expired
          </button>
        </div>

        {message && (
          <div
            style={{
              padding: 10,
              borderRadius: 6,
              marginBottom: 15,
              textAlign: "center",
              fontWeight: 500,
              background: message.type === "success" ? "#d4edda" : "#f8d7da",
              color: message.type === "success" ? "#155724" : "#721c24",
            }}
          >
            {message.text}
          </div>
        )}

        {/* Add New Announcement */}
        <form onSubmit={handleAdd} style={{ marginBottom: 20 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            name="title"
            placeholder="Announcement title"
            required
            style={inputStyle}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            name="content"
            rows={4}
            placeholder="Write announcement..."
            required
            style={textareaStyle}
          ></textarea>
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: "block", marginBottom: 5, fontWeight: 600, color: "#333" }}>
              Expiration Date & Time (Optional)
            </label>
            <input
              type="datetime-local"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              name="expiration_date"
              style={inputStyle}
            />
            <small style={{ color: "#666", fontSize: "12px" }}>
              Leave empty for no expiration. Announcement will be automatically deleted after this time.
            </small>
          </div>
          <button type="submit" style={buttonStyle}>
            Publish
          </button>
        </form>

        {/* Announcements List */}
        {loading ? (
          <p>Loading...</p>
        ) : announcements.length > 0 ? (
          announcements.map((a) => {
            const isExpired = a.expiration_date && new Date(a.expiration_date) < new Date();
            const expiresSoon = a.expiration_date && new Date(a.expiration_date) < new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
            
            return (
              <div key={a.id} style={{
                ...annCardStyle,
                borderLeft: isExpired ? "4px solid #ff4d4d" : expiresSoon ? "4px solid #ffa500" : "4px solid #00a859",
                opacity: isExpired ? 0.7 : 1
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>{a.title}</strong>
                  <button
                    onClick={() => handleDelete(a.id)}
                    style={{
                      background: "none",
                      color: "#ff4d4d",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1.1rem",
                    }}
                  >
                    ✖
                  </button>
                </div>
                <p style={{ margin: "8px 0" }}>{a.content}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                  <small style={{ color: "#666" }}>
                    Posted: {new Date(a.created_at).toLocaleString()}
                  </small>
                  {a.expiration_date && (
                    <small style={{ 
                      color: isExpired ? "#ff4d4d" : expiresSoon ? "#ffa500" : "#666",
                      fontWeight: isExpired || expiresSoon ? 600 : 400
                    }}>
                      {isExpired ? "EXPIRED" : expiresSoon ? "Expires Soon" : "Expires"}: {new Date(a.expiration_date).toLocaleString()}
                    </small>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p style={{ color: "#666" }}>No announcements yet.</p>
        )}

        <p style={{ marginTop: 20 }}>
          <Link href="/admin/dashboard" style={{ color: "#00a859", textDecoration: "none" }}>
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
  margin: 0,
  minHeight: "100vh",
  color: "#222",
};

const containerStyle: React.CSSProperties = {
  maxWidth: 800,
  margin: "30px auto",
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  border: "1px solid #ccc",
  borderRadius: 6,
};

const textareaStyle = { ...inputStyle, resize: "vertical" };

const buttonStyle: React.CSSProperties = {
  background: "#00a859",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
};

const annCardStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: 10,
  borderRadius: 6,
  marginBottom: 10,
  background: "#fff",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
};
