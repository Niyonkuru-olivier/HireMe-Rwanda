import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

export default async function EmployerDashboard() {
  const session = await getSession();

  if (!session || session.role !== "EMPLOYER") {
    redirect("/auth/login");
  }

  // Get company information and dashboard data
  let company = null;
  let announcements = [];
  let jobs = [];
  let totalApplications = 0;
  let recentApplications = [];
  
  try {
    company = await prisma.company.findUnique({
      where: { owner_id: session.userId },
    });

    // Get non-expired announcements
    const now = new Date();
    announcements = await prisma.announcement.findMany({
      where: {
        OR: [
          { expiration_date: null },
          { expiration_date: { gt: now } }
        ]
      },
      orderBy: { created_at: "desc" },
      take: 5,
    });

    // Get jobs posted by this employer
    jobs = await prisma.job.findMany({
      where: { company_id: company?.id },
      include: { 
        applications: {
          include: { user: true }
        }
      },
      orderBy: { created_at: "desc" },
    });

    // Get total applications across all jobs
    totalApplications = jobs.reduce((sum, job) => sum + job.applications.length, 0);

    // Get recent applications
    recentApplications = await prisma.application.findMany({
      where: { 
        job: { company_id: company?.id }
      },
      include: { 
        user: true, 
        job: true 
      },
      orderBy: { applied_at: "desc" },
      take: 5,
    });
  } catch (error) {
    console.error('Database connection error:', error);
    // Continue with empty/default values if database is not available
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerWrap}>
          <div>
            <h1 style={styles.headerTitle}>Employer Dashboard</h1>
            <small style={styles.headerSubtitle}>
              {company?.name || 'No company profile yet'}
            </small>
          </div>
          <div style={styles.actions}>
            <Link href="/employer/company-profile" style={styles.actionLink}>
              Edit Company
            </Link>
            <Link href="/employer/jobs/create" style={styles.actionLink}>
              Post Job
            </Link>
            <Link href="/auth/logout" style={styles.logoutButton}>
              Logout
            </Link>
          </div>
        </div>
      </header>

      {/* Announcements Section */}
      <section style={styles.announcements}>
        <h2 style={styles.announcementsTitle}>Announcements</h2>
        {announcements.length > 0 ? (
          <div style={styles.annList}>
            {announcements.map((announcement) => (
              <div key={announcement.id} style={styles.annCard}>
                <strong style={styles.annTitle}>{announcement.title}</strong>
                <p style={styles.annContent}>{announcement.content}</p>
                <small style={styles.annDate}>
                  Published on {new Date(announcement.created_at).toLocaleDateString()}
                </small>
              </div>
            ))}
          </div>
        ) : (
          <p style={styles.noAnnouncements}>No announcements at this time.</p>
        )}
      </section>

      {/* Main Dashboard Content */}
      <div style={styles.wrap}>
        <div style={styles.summary}>
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Total Jobs</h4>
            <p style={styles.cardNumber}>{jobs.length}</p>
          </div>
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Total Applications</h4>
            <p style={styles.cardNumber}>{totalApplications}</p>
          </div>
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Recent Applications</h4>
            <ul style={styles.recentList}>
              {recentApplications.map((app) => (
                <li key={app.id} style={styles.recentItem}>
                  <strong>{app.user.full_name}</strong> — {app.job.title}
                  <small style={styles.status}>({app.status})</small>
                  <Link 
                    href={`/employer/applicants/${app.id}`} 
                    style={styles.viewLink}
                  >
                    View
                  </Link>
                </li>
              ))}
              {recentApplications.length === 0 && (
                <li style={styles.recentItem}>No recent applications</li>
              )}
            </ul>
          </div>
        </div>

        <section style={styles.jobsSection}>
          <h2 style={styles.jobsTitle}>Your Jobs</h2>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} style={styles.jobCard}>
                <div>
                  <h3 style={styles.jobTitle}>{job.title}</h3>
                  <div style={styles.jobMeta}>
                    {job.location} • {job.type} • {job.salary || 'Not specified'}
                  </div>
                  <div style={styles.jobMeta}>
                    Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'No deadline'}
                  </div>
                </div>
                <div style={styles.jobActions}>
                  <Link href={`/employer/applicants/job/${job.id}`} style={styles.jobActionLink}>
                    Applicants ({job.applications.length})
                  </Link>
                  <Link href={`/employer/jobs/edit/${job.id}`} style={styles.jobActionLink}>
                    Edit
                  </Link>
                  <form 
                    method="POST" 
                    action={`/api/employer/jobs/${job.id}/delete`}
                    style={styles.deleteForm}
                  >
                    <button type="submit" style={styles.deleteButton}>
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))
          ) : (
            <p style={styles.noJobs}>No jobs posted yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Segoe UI', Arial, sans-serif",
    background: "#f5f7f6",
    margin: 0,
    color: "#222",
    minHeight: "100vh",
  },
  header: {
    background: "#00a859",
    color: "#fff",
    padding: "18px 0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  headerWrap: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    margin: 0,
    fontSize: "1.8rem",
  },
  headerSubtitle: {
    display: "block",
    fontSize: "0.9rem",
    color: "#e0ffe9",
  },
  actions: {
    display: "flex",
    gap: "10px",
  },
  actionLink: {
    textDecoration: "none",
    background: "#fff",
    color: "#00a859",
    border: "1px solid #00a859",
    padding: "8px 14px",
    borderRadius: "6px",
    transition: "0.3s",
  },
  logoutButton: {
    textDecoration: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    background: "#fff",
    color: "#00a859",
    transition: "0.3s",
  },
  announcements: {
    background: "#f9fdfb",
    padding: "30px 20px",
    margin: "30px auto 10px auto",
    maxWidth: "1050px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  announcementsTitle: {
    color: "#00a859",
    textAlign: "center" as const,
    marginBottom: "20px",
  },
  annList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  annCard: {
    background: "#eaf9f0",
    borderLeft: "5px solid #00a859",
    padding: "14px 18px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
  },
  annTitle: {
    fontSize: "1rem",
    color: "#222",
    display: "block",
    marginBottom: "4px",
  },
  annContent: {
    margin: "0 0 6px 0",
    color: "#333",
    fontSize: "0.95rem",
  },
  annDate: {
    color: "#666",
    fontSize: "0.8rem",
  },
  noAnnouncements: {
    textAlign: "center" as const,
    color: "#777",
    fontStyle: "italic",
  },
  wrap: {
    maxWidth: "1100px",
    margin: "28px auto",
    padding: "0 20px",
  },
  summary: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "25px",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    transition: "transform .2s ease",
  },
  cardTitle: {
    marginTop: 0,
    color: "#00a859",
  },
  cardNumber: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: 0,
  },
  recentList: {
    paddingLeft: "20px",
  },
  recentItem: {
    marginBottom: "8px",
  },
  status: {
    marginLeft: "8px",
  },
  viewLink: {
    color: "#00a859",
    textDecoration: "none",
    marginLeft: "8px",
  },
  jobsSection: {
    marginTop: "40px",
  },
  jobsTitle: {
    color: "#00a859",
    marginBottom: "15px",
  },
  jobCard: {
    background: "#fff",
    borderRadius: "10px",
    padding: "18px",
    marginBottom: "15px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  jobTitle: {
    margin: 0,
    color: "#222",
  },
  jobMeta: {
    fontSize: "0.9rem",
    color: "#555",
    marginTop: "4px",
  },
  jobActions: {
    display: "flex",
    gap: "6px",
  },
  jobActionLink: {
    textDecoration: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    background: "#fff",
    color: "#333",
    transition: "0.3s",
  },
  deleteForm: {
    display: "inline",
  },
  deleteButton: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    background: "#fff",
    color: "#d33",
    cursor: "pointer",
    transition: "0.3s",
  },
  noJobs: {
    color: "#666",
    fontStyle: "italic",
  },
};
