"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function ResetPasswordPage() {
	const params = useSearchParams();
	const token = params.get("token") || "";
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string>("");

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError("");
		const form = e.currentTarget as HTMLFormElement & { password: { value: string }; confirm: { value: string } };
		const pw = form.password.value;
		const confirm = form.confirm.value;
		if (pw.length < 8) { setError("Password must be at least 8 characters."); return; }
		if (pw !== confirm) { setError("Passwords do not match."); return; }
		try {
			setSubmitting(true);
			const res = await fetch("/api/auth/reset-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token, password: pw }),
			});
			if (res.ok) {
				window.location.href = "/auth/login";
				return;
			}
			const data = await res.json().catch(() => ({} as any));
			setError((data as any).error || "Failed to reset password");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f8f8f8" }}>
			<div style={{ background: "#fff", padding: 30, borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: 400 }}>
				<h2 style={{ color: "#00a859", textAlign: "center", marginBottom: 20 }}>Reset Password</h2>
				{error ? <div style={{ color: "#a32a2a", marginBottom: 10 }}>{error}</div> : null}
				<form onSubmit={onSubmit}>
					<input type="password" name="password" placeholder="New password" required style={{ width: "100%", padding: 12, marginBottom: 15, borderRadius: 6, border: "1px solid #ccc" }} />
					<input type="password" name="confirm" placeholder="Confirm password" required style={{ width: "100%", padding: 12, marginBottom: 15, borderRadius: 6, border: "1px solid #ccc" }} />
					<button type="submit" disabled={submitting} style={{ width: "100%", padding: 12, border: 0, borderRadius: 6, background: "#00a859", color: "#fff", fontSize: "1rem", cursor: "pointer" }}>{submitting ? "Resetting..." : "Reset Password"}</button>
				</form>
				<p style={{ textAlign: "center", marginTop: 10 }}><Link href="/auth/login" style={{ color: "#00a859" }}>Back to Login</Link></p>
			</div>
		</div>
	);
}
