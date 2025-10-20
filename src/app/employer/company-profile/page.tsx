import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CompanyProfilePage({ 
  searchParams 
}: { 
  searchParams: { saved?: string } 
}) {
  const session = await getSession();

  if (!session || session.role !== "EMPLOYER") {
    redirect("/auth/login");
  }

  const company = await prisma.company.findUnique({
    where: { owner_id: session.userId },
  });

  const isSaved = searchParams.saved === "true";

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          {company ? 'Edit Company Profile' : 'Create Company Profile'}
        </h2>

        {/* Success Message */}
        {isSaved && (
          <div style={styles.successMessage}>
            ✅ Company profile {company ? 'updated' : 'created'} successfully!
          </div>
        )}

        <form method="POST" action="/api/employer/company-profile" style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Company Name</label>
            <input 
              name="name" 
              defaultValue={company?.name || ""}
              required 
              style={styles.input}
              placeholder="Enter your company name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea 
              name="description" 
              defaultValue={company?.description || ""}
              style={styles.textarea}
              placeholder="Describe your company, its mission, values, and what makes it unique..."
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Website</label>
            <input 
              name="website" 
              defaultValue={company?.website || ""}
              style={styles.input}
              placeholder="https://yourcompany.com"
              type="url"
            />
          </div>

          <div style={styles.actions}>
            <button type="submit" style={styles.submitButton}>
              {company ? 'Update' : 'Create'} Company Profile
            </button>
            <Link href="/employer/dashboard" style={styles.backLink}>
              Back to Dashboard
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
    maxWidth: "800px",
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
    minHeight: "120px",
    fontSize: "14px",
    resize: "vertical" as const,
    outline: "none",
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
  backLink: {
    color: "#666",
    textDecoration: "none",
    marginLeft: "8px",
  },
};
