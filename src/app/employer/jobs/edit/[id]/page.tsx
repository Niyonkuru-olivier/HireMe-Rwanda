import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

interface EditJobPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const session = await getSession();

  if (!session || session.role !== "EMPLOYER") {
    redirect("/auth/login");
  }

  const resolvedParams = await params;
  const jobId = parseInt(resolvedParams.id);
  const job = await prisma.job.findFirst({
    where: { 
      id: jobId,
      company: { owner_id: session.userId }
    },
  });

  if (!job) {
    redirect("/employer/dashboard");
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Edit Job</h2>
        <form method="POST" action={`/api/employer/jobs/${jobId}`} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Title</label>
            <input 
              name="title" 
              defaultValue={job.title}
              required 
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description (max 191 characters)</label>
            <textarea 
              name="description" 
              defaultValue={job.description}
              required 
              maxLength={191}
              style={styles.textarea}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Requirements (max 191 characters)</label>
            <textarea 
              name="requirements" 
              defaultValue={job.requirements || ""}
              maxLength={191}
              style={styles.textarea}
            />
          </div>

          <div style={styles.twoCol}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Location (max 191 characters)</label>
              <input 
                name="location" 
                defaultValue={job.location || ""}
                maxLength={191}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Salary (max 191 characters)</label>
              <input 
                name="salary" 
                defaultValue={job.salary || ""}
                maxLength={191}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Type</label>
            <select name="type" defaultValue={job.type} style={styles.select}>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Deadline</label>
            <input 
              type="date" 
              name="deadline" 
              defaultValue={job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : ""}
              style={styles.input}
            />
          </div>

          <div style={styles.actions}>
            <button type="submit" style={styles.submitButton}>
              Update Job
            </button>
            <Link href="/employer/dashboard" style={styles.cancelLink}>
              Cancel
            </Link>
          </div>
        </form>
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
    padding: "20px",
  },
  card: {
    maxWidth: "900px",
    margin: "28px auto",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
  },
  title: {
    color: "#00a859",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },
  label: {
    display: "block",
    margin: "8px 0",
    fontWeight: 600,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    minHeight: "100px",
    fontSize: "14px",
    resize: "vertical" as const,
    outline: "none",
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  actions: {
    marginTop: "12px",
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  submitButton: {
    background: "#00a859",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
  },
  cancelLink: {
    color: "#666",
    textDecoration: "none",
    marginLeft: "8px",
  },
};
