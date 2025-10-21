import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const session = await getSession();

  if (!session || session.role !== "EMPLOYEE") {
    return (
      <div style={styles.unauthorized}>
        <p style={{ marginBottom: 10 }}>Unauthorized access.</p>
        <Link href="/auth/login" style={styles.loginLink}>
          Go to Login
        </Link>
      </div>
    );
  }

  const profile = await prisma.employeeProfile.findUnique({
    where: { user_id: session.userId },
  });

  const resolvedSearchParams = await searchParams;
  const isSaved = resolvedSearchParams.saved === "true";

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>JobConnect Rwanda</div>
        <div style={styles.navLinks}>
          <Link href="/jobs" style={styles.link}>Jobs</Link>
          <Link href="/employee/dashboard" style={styles.link}>Dashboard</Link>
          <Link href="/auth/logout" style={styles.logoutLink}>Logout</Link>
        </div>
      </nav>

      {/* Profile Container */}
      <div style={styles.container}>
        <h2 style={styles.title}>My Profile</h2>

        {/* ✅ Success Message */}
        {isSaved && (
          <div style={styles.successMessage}>
            ✅ Profile updated successfully!
          </div>
        )}

        <form method="POST" action="/api/employee/profile" style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Phone</label>
            <input type="text" name="phone" defaultValue={profile?.phone || ""} style={styles.input} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Location</label>
            <input type="text" name="location" defaultValue={profile?.location || ""} style={styles.input} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Education</label>
            <textarea name="education" defaultValue={profile?.education || ""} style={styles.textarea} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Skills</label>
            <textarea name="skills" defaultValue={profile?.skills || ""} style={styles.textarea} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Work Experience</label>
            <textarea name="experience" defaultValue={profile?.experience || ""} style={styles.textarea} />
          </div>

          <button type="submit" style={styles.button}>Save Profile</button>
        </form>
      </div>
    </div>
  );
}

/* 🎨 Inline CSS styles for consistent layout */
const styles = {
  page: {
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  },
  navbar: {
    display: "flex" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    backgroundColor: "#ffffff",
    padding: "16px 40px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    position: "sticky" as const,
    top: 0,
    zIndex: 10,
  },
  logo: {
    fontSize: "1.4rem",
    fontWeight: 700,
    color: "#009a55",
  },
  navLinks: {
    display: "flex",
    gap: "22px",
  },
  link: {
    color: "#333",
    textDecoration: "none",
    fontWeight: 500,
    transition: "color 0.2s",
  },
  logoutLink: {
    color: "#d33",
    textDecoration: "none",
    fontWeight: 600,
  },
  container: {
    maxWidth: "700px",
    margin: "50px auto",
    backgroundColor: "#ffffff",
    padding: "40px 45px",
    borderRadius: "12px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  },
  title: {
    color: "#009a55",
    fontSize: "1.6rem",
    fontWeight: 700,
    marginBottom: "25px",
    borderBottom: "2px solid #009a55",
    paddingBottom: "10px",
  },
  successMessage: {
    backgroundColor: "#e6f8ee",
    border: "1px solid #00a859",
    color: "#008040",
    padding: "10px 15px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontWeight: 600,
  },
  form: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: "18px",
  },
  formGroup: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: "6px",
  },
  label: {
    fontWeight: 600,
    color: "#333",
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px",
    outlineColor: "#009a55",
  },
  textarea: {
    padding: "10px 12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    minHeight: "90px",
    fontSize: "15px",
    resize: "vertical" as const,
    outlineColor: "#009a55",
  },
  button: {
    backgroundColor: "#009a55",
    color: "#fff",
    fontWeight: 600,
    padding: "12px 0",
    border: "none",
    borderRadius: "8px",
    marginTop: "15px",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  unauthorized: {
    padding: "40px",
    textAlign: "center" as const,
    color: "#d33",
    fontSize: "18px",
  },
  loginLink: {
    color: "#009a55",
    fontWeight: 600,
    textDecoration: "underline",
  },
};
