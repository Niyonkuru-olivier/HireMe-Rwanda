import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

interface ApplicantDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicantDetailsPage({ params }: ApplicantDetailsPageProps) {
  const session = await getSession();

  if (!session || session.role !== "EMPLOYER") {
    redirect("/auth/login");
  }

  const resolvedParams = await params;
  const applicationId = parseInt(resolvedParams.id);

  // Get application and verify ownership
  const application = await prisma.application.findFirst({
    where: { 
      id: applicationId,
      job: { 
        company: { owner_id: session.userId }
      }
    },
    include: { 
      user: true,
      job: { include: { company: true } },
    },
  });

  if (!application) {
    redirect("/employer/dashboard");
  }

  // Get applicant profile
  const profile = await prisma.employeeProfile.findUnique({
    where: { user_id: application.user_id },
  });

  // Get uploaded documents
  const documents = await prisma.employeeDocument.findMany({
    where: { user_id: application.user_id },
    orderBy: { uploaded_at: "desc" },
  });

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <Link 
          href={`/employer/applicants/job/${application.job_id}`}
          style={styles.backLink}
        >
          ← Back to Applicants
        </Link>

        <h1 style={styles.title}>{application.user.full_name}</h1>
        
        <div style={styles.infoGrid}>
          <p style={styles.infoItem}>
            <strong>Email:</strong> {application.user.email}
          </p>
          <p style={styles.infoItem}>
            <strong>National ID:</strong> {application.user.national_id}
          </p>
          <p style={styles.infoItem}>
            <strong>Applied for:</strong> {application.job.title}
          </p>
          <p style={styles.infoItem}>
            <strong>Status:</strong> 
            <span style={styles.status}>{application.status}</span>
          </p>
          <p style={styles.infoItem}>
            <strong>Applied on:</strong> {new Date(application.applied_at).toLocaleDateString()}
          </p>
        </div>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Profile Information</h2>
          {profile ? (
            <div style={styles.profileGrid}>
              <p style={styles.profileItem}>
                <strong>Phone:</strong> {profile.phone || "Not provided"}
              </p>
              <p style={styles.profileItem}>
                <strong>Location:</strong> {profile.location || "Not provided"}
              </p>
              <div style={styles.profileItem}>
                <strong>Education:</strong>
                <p style={styles.profileText}>{profile.education || "Not provided"}</p>
              </div>
              <div style={styles.profileItem}>
                <strong>Skills:</strong>
                <p style={styles.profileText}>{profile.skills || "Not provided"}</p>
              </div>
              <div style={styles.profileItem}>
                <strong>Work Experience:</strong>
                <p style={styles.profileText}>{profile.experience || "Not provided"}</p>
              </div>
            </div>
          ) : (
            <p style={styles.noProfile}>No profile information available.</p>
          )}
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Cover Letter</h2>
          {application.cover_letter ? (
            <div style={styles.coverSection}>
              <Link 
                href={`/uploads/${application.cover_letter}`}
                target="_blank"
                style={styles.downloadLink}
              >
                📄 View / Download Cover Letter
              </Link>
            </div>
          ) : (
            <p style={styles.noCover}>No cover letter uploaded.</p>
          )}
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Uploaded Documents</h2>
          {documents.length > 0 ? (
            <div style={styles.documentsGrid}>
              {documents.map((doc) => (
                <div key={doc.id} style={styles.documentItem}>
                  <Link 
                    href={`/uploads/${doc.file_name}`}
                    target="_blank"
                    style={styles.documentLink}
                  >
                    📎 {doc.file_type} ({doc.file_name})
                  </Link>
                  <small style={styles.documentDate}>
                    Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.noDocuments}>No documents uploaded.</p>
          )}
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Actions</h2>
          <div style={styles.actionsGrid}>
            <form 
              method="POST" 
              action={`/api/employer/applications/${applicationId}/status`}
              style={styles.actionForm}
            >
              <input type="hidden" name="status" value="SHORTLISTED" />
              <button type="submit" style={styles.actionButton}>
                Shortlist Candidate
              </button>
            </form>

            <form 
              method="POST" 
              action={`/api/employer/applications/${applicationId}/status`}
              style={styles.actionForm}
            >
              <input type="hidden" name="status" value="REJECTED" />
              <button type="submit" style={styles.rejectButton}>
                Reject Application
              </button>
            </form>

            <form 
              method="POST" 
              action={`/api/employer/applications/${applicationId}/status`}
              style={styles.actionForm}
            >
              <input type="hidden" name="status" value="HIRED" />
              <button type="submit" style={styles.hireButton}>
                Hire Candidate
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "Arial, Helvetica, sans-serif",
    background: "#f8f9f8",
    margin: 0,
    color: "#333",
    minHeight: "100vh",
  },
  wrap: {
    maxWidth: "900px",
    margin: "40px auto",
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  backLink: {
    textDecoration: "none",
    color: "#00a859",
    display: "inline-block",
    marginBottom: "20px",
    fontWeight: 600,
  },
  title: {
    color: "#00a859",
    marginTop: 0,
    marginBottom: "20px",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "10px",
    marginBottom: "30px",
  },
  infoItem: {
    margin: "5px 0",
    fontSize: "14px",
  },
  status: {
    color: "#00a859",
    fontWeight: 600,
    marginLeft: "5px",
  },
  section: {
    marginBottom: "30px",
  },
  sectionTitle: {
    borderBottom: "2px solid #00a859",
    paddingBottom: "5px",
    marginTop: "25px",
    color: "#00a859",
  },
  profileGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px",
  },
  profileItem: {
    margin: "5px 0",
  },
  profileText: {
    margin: "5px 0 0 0",
    padding: "10px",
    background: "#f8f9f8",
    borderRadius: "6px",
    fontSize: "14px",
    lineHeight: "1.4",
  },
  noProfile: {
    color: "#666",
    fontStyle: "italic",
  },
  coverSection: {
    padding: "10px 0",
  },
  downloadLink: {
    display: "inline-block",
    background: "#00a859",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: "6px",
    margin: "5px 0",
    textDecoration: "none",
    transition: "0.3s",
  },
  noCover: {
    color: "#666",
    fontStyle: "italic",
  },
  documentsGrid: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  documentItem: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    background: "#f8f9f8",
  },
  documentLink: {
    display: "inline-block",
    background: "#00a859",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: "6px",
    margin: "5px 0",
    textDecoration: "none",
    transition: "0.3s",
  },
  documentDate: {
    display: "block",
    color: "#666",
    fontSize: "12px",
    marginTop: "5px",
  },
  noDocuments: {
    color: "#666",
    fontStyle: "italic",
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
  },
  actionForm: {
    display: "inline",
  },
  actionButton: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #00a859",
    background: "#fff",
    color: "#00a859",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    transition: "0.3s",
  },
  rejectButton: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #d33",
    background: "#fff",
    color: "#d33",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    transition: "0.3s",
  },
  hireButton: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    background: "#00a859",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    transition: "0.3s",
  },
};
