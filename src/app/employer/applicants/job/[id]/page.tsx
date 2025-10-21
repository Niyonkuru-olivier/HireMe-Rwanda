import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

interface ApplicantsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicantsPage({ params }: ApplicantsPageProps) {
  const session = await getSession();

  if (!session || session.role !== "EMPLOYER") {
    redirect("/auth/login");
  }

  const resolvedParams = await params;
  const jobId = parseInt(resolvedParams.id);

  // Get job and verify ownership
  const job = await prisma.job.findFirst({
    where: { 
      id: jobId,
      company: { owner_id: session.userId }
    },
    include: { company: true },
  });

  if (!job) {
    redirect("/employer/dashboard");
  }

  // Get applicants for this job
  const applicants = await prisma.application.findMany({
    where: { job_id: jobId },
    include: { 
      user: true,
      job: true,
    },
    orderBy: { applied_at: "desc" },
  });

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <Link href="/employer/dashboard" style={styles.backLink}>
          ← Back to Dashboard
        </Link>

        <h2 style={styles.title}>Applicants — {job.title}</h2>

        {applicants.length > 0 ? (
          <div style={styles.applicantsList}>
            {applicants.map((applicant) => (
              <div key={applicant.id} style={styles.appCard}>
                <div style={styles.appInfo}>
                  <h3 style={styles.appName}>{applicant.user.full_name}</h3>
                  <p style={styles.appMeta}>
                    {applicant.user.email} • Applied: {new Date(applicant.applied_at).toLocaleDateString()}
                  </p>

                  {applicant.cover_letter ? (
                    <p style={styles.coverLink}>
                      📄 Cover Letter: 
                      <Link 
                        href={`/uploads/${applicant.cover_letter}`} 
                        target="_blank"
                        style={styles.downloadLink}
                      >
                        View / Download
                      </Link>
                    </p>
                  ) : (
                    <p style={styles.noCover}>📄 Cover Letter: —</p>
                  )}

                  <p style={styles.statusText}>
                    Status: <span style={styles.status}>{applicant.status}</span>
                  </p>
                </div>

                <div style={styles.appActions}>
                  <form 
                    method="POST" 
                    action={`/api/employer/applications/${applicant.id}/status`}
                    style={styles.statusForm}
                  >
                    <input type="hidden" name="status" value="SHORTLISTED" />
                    <button type="submit" style={styles.actionButton}>
                      Shortlist
                    </button>
                  </form>

                  <form 
                    method="POST" 
                    action={`/api/employer/applications/${applicant.id}/status`}
                    style={styles.statusForm}
                  >
                    <input type="hidden" name="status" value="REJECTED" />
                    <button type="submit" style={styles.actionButton}>
                      Reject
                    </button>
                  </form>

                  <form 
                    method="POST" 
                    action={`/api/employer/applications/${applicant.id}/status`}
                    style={styles.statusForm}
                  >
                    <input type="hidden" name="status" value="HIRED" />
                    <button type="submit" style={styles.hireButton}>
                      Hire
                    </button>
                  </form>

                  <Link 
                    href={`/employer/applicants/${applicant.id}`}
                    style={styles.viewButton}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.noApplicants}>
            <p>No applicants yet for this job.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    background: "#f8f8f8",
    margin: 0,
    minHeight: "100vh",
  },
  wrap: {
    maxWidth: "900px",
    margin: "28px auto",
    padding: "18px",
  },
  backLink: {
    color: "#00a859",
    textDecoration: "none",
    display: "inline-block",
    marginBottom: "20px",
    fontWeight: 600,
  },
  title: {
    color: "#00a859",
    marginBottom: "20px",
  },
  applicantsList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  appCard: {
    background: "#fff",
    padding: "14px",
    borderRadius: "8px",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  appInfo: {
    maxWidth: "70%",
  },
  appName: {
    margin: 0,
    color: "#333",
    fontSize: "16px",
  },
  appMeta: {
    margin: "2px 0",
    fontSize: "14px",
    color: "#666",
  },
  coverLink: {
    margin: "5px 0",
    fontSize: "14px",
  },
  downloadLink: {
    color: "#00a859",
    textDecoration: "none",
    marginLeft: "5px",
  },
  noCover: {
    margin: "5px 0",
    fontSize: "14px",
    color: "#999",
  },
  statusText: {
    margin: "5px 0 0 0",
    fontSize: "14px",
  },
  status: {
    fontWeight: 600,
    color: "#00a859",
  },
  appActions: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  },
  statusForm: {
    display: "inline",
  },
  actionButton: {
    padding: "8px 10px",
    borderRadius: "6px",
    textDecoration: "none",
    border: "1px solid #ddd",
    background: "#fff",
    marginRight: "5px",
    cursor: "pointer",
    fontSize: "12px",
    color: "#333",
    transition: "0.3s",
  },
  hireButton: {
    padding: "8px 10px",
    borderRadius: "6px",
    textDecoration: "none",
    border: "none",
    background: "#00a859",
    color: "#fff",
    marginRight: "5px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
    transition: "0.3s",
  },
  viewButton: {
    padding: "8px 10px",
    borderRadius: "6px",
    textDecoration: "none",
    border: "1px solid #00a859",
    background: "#fff",
    color: "#00a859",
    cursor: "pointer",
    fontSize: "12px",
    textAlign: "center" as const,
    transition: "0.3s",
  },
  noApplicants: {
    textAlign: "center" as const,
    padding: "40px",
    color: "#666",
  },
};
