import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CreateJobPage() {
  const session = await getSession();

  if (!session || session.role !== "EMPLOYER") {
    redirect("/auth/login");
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Post a Job</h2>
        <form method="POST" action="/api/employer/jobs" style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Title</label>
            <input 
              name="title" 
              required 
              style={styles.input}
              placeholder="e.g., Senior Software Engineer"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description (max 191 characters)</label>
            <textarea 
              name="description" 
              required 
              maxLength={191}
              style={styles.textarea}
              placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Requirements (max 191 characters)</label>
            <textarea 
              name="requirements" 
              maxLength={191}
              style={styles.textarea}
              placeholder="List the required skills, experience, and qualifications..."
            />
          </div>

          <div style={styles.twoCol}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Location (max 191 characters)</label>
              <input 
                name="location" 
                maxLength={191}
                style={styles.input}
                placeholder="e.g., Kigali, Rwanda"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Salary (max 191 characters)</label>
              <input 
                name="salary" 
                maxLength={191}
                style={styles.input}
                placeholder="e.g., 500,000 - 800,000 RWF"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Type</label>
            <select name="type" style={styles.select}>
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
              style={styles.input}
            />
          </div>

          <div style={styles.actions}>
            <button type="submit" style={styles.submitButton}>
              Post Job
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
