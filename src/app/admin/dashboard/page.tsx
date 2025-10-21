import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await getSession();

  // 🔒 Only admins can access
  if (!session || session.role !== "ADMIN") {
    return (
      <div style={{ padding: 20 }}>
        Unauthorized. <Link href="/admin/login">Login</Link>
      </div>
    );
  }

  // ✅ Fetch dashboard stats
  let totalUsers = 0, totalJobs = 0, totalApplications = 0, totalAnnouncements = 0;
  
  try {
    [totalUsers, totalJobs, totalApplications, totalAnnouncements] = await Promise.all([
      prisma.user.count(),
      prisma.job.count(),
      prisma.application.count(),
      prisma.announcement.count(),
    ]);
  } catch (error) {
    console.error('Database connection error:', error);
    // Continue with zero values if database is not available
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* Header */}
        <header style={headerStyle}>
          <h1 style={headingStyle}>Admin Dashboard</h1>
          <div style={headerBtnGroup}>
            <Link href="/admin/users" style={btnStyle}>Users</Link>
            <Link href="/admin/jobs" style={btnStyle}>Jobs</Link>
            <Link href="/admin/announcements" style={btnStyle}>Announcements</Link>
            <Link href="/admin/new" style={btnStyle}>New Admin</Link>
            <Link href="/auth/logout" style={{ ...btnStyle, background: "#00a859", color: "#fff" }}>Logout</Link>
          </div>
        </header>

        {/* Summary Cards */}
        <div style={cardsContainer}>
          <Link href="/admin/users" style={cardStyle}>
            <h3 style={cardTitle}>Total Users</h3>
            <p style={cardNumber}>{totalUsers}</p>
          </Link>

          <Link href="/admin/jobs" style={cardStyle}>
            <h3 style={cardTitle}>Total Jobs</h3>
            <p style={cardNumber}>{totalJobs}</p>
          </Link>

          <Link href="/admin/applications" style={cardStyle}>
            <h3 style={cardTitle}>Applications</h3>
            <p style={cardNumber}>{totalApplications}</p>
          </Link>

          <Link href="/admin/announcements" style={cardStyle}>
            <h3 style={cardTitle}>Announcements</h3>
            <p style={cardNumber}>{totalAnnouncements}</p>
          </Link>
        </div>
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
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1100,
  margin: "30px auto",
  padding: 20,
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
};

const headingStyle: React.CSSProperties = {
  color: "#00a859",
  marginBottom: 10,
  fontSize: "1.8rem",
};

const headerBtnGroup: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const btnStyle: React.CSSProperties = {
  textDecoration: "none",
  padding: "8px 14px",
  borderRadius: 8,
  border: "1px solid #ccc",
  background: "#fff",
  fontWeight: 500,
  transition: "all 0.2s",
};

const cardsContainer: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 16,
  marginTop: 20,
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  padding: 16,
  borderRadius: 10,
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  flex: 1,
  minWidth: 200,
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  textAlign: "center",
  textDecoration: "none",
  color: "inherit",
};

const cardTitle: React.CSSProperties = {
  margin: "0 0 10px 0",
  color: "#00a859",
  fontSize: "1.1rem",
};

const cardNumber: React.CSSProperties = {
  fontSize: 24,
  margin: 0,
  fontWeight: "bold",
};
