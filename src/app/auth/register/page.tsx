"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
	const [submitting, setSubmitting] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	function isValidEmail(email: string) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}
	function isStrongPassword(pw: string) {
		return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pw);
	}

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setErrors({});

		const form = e.currentTarget as HTMLFormElement & {
			full_name: { value: string };
			national_id: { value: string };
			email: { value: string };
			role: { value: string };
			password: { value: string };
			confirm_password: { value: string };
		};

		const full_name = form.full_name.value.trim();
		const national_id = form.national_id.value.trim();
		const email = form.email.value.trim();
		const role = form.role.value;
		const password = form.password.value;
		const confirm_password = form.confirm_password.value;

		const nextErrors: Record<string, string> = {};
		if (full_name.length < 3) nextErrors.full_name = "Full name is required (min 3 characters).";
		if (!/^\d{16}$/.test(national_id)) nextErrors.national_id = "National ID must be exactly 16 digits.";
		if (!isValidEmail(email)) nextErrors.email = "Enter a valid email address.";
		if (!role) nextErrors.role = "Please select a role.";
		if (!isStrongPassword(password)) nextErrors.password = "Password must be at least 8 chars, include uppercase, lowercase, number & symbol.";
		if (password !== confirm_password) nextErrors.confirm_password = "Passwords do not match.";

		if (Object.keys(nextErrors).length) {
			setErrors(nextErrors);
			return;
		}

		try {
			setSubmitting(true);
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ full_name, national_id, email, role, password, confirm_password }),
			});
			if (res.ok) {
				window.location.href = `/auth/thank-you?role=${encodeURIComponent(role)}`;
				return;
			}
			const data = await res.json().catch(() => ({} as Record<string, unknown>));
			setErrors({ form: (data as Record<string, unknown>).error as string || "Registration failed" });
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div>
			<nav className="navbar" role="navigation">
				<div className="logo">JobConnect Rwanda</div>
				<div>
					<ul className="nav-links" style={{ alignItems: "center" }}>
						<li><Link href="/">Home</Link></li>
						<li><a href="#about">About</a></li>
						<li><Link href="/auth/login">Login</Link></li>
						<li><Link href="/auth/register" className="btn primary">Register</Link></li>
					</ul>
				</div>
			</nav>

			<div className="register-container">
				<div className="register-card">
					<h2>Create Your Account</h2>
					<p className="subtitle">Join JobConnect Rwanda to find jobs or hire top talent.</p>

					{errors.form ? (
						<div className="flash error">{errors.form}</div>
					) : null}

					<form onSubmit={onSubmit} noValidate>
						<div className="two-col">
							<div className="form-group">
								<label htmlFor="full_name">Full Name</label>
								<input id="full_name" name="full_name" type="text" placeholder="Enter your full name" required />
								{errors.full_name ? <small className="error">{errors.full_name}</small> : null}
							</div>

							<div className="form-group">
								<label htmlFor="national_id">National ID (16 digits)</label>
								<input id="national_id" name="national_id" type="text" maxLength={16} placeholder="1234567890123456" required />
								{errors.national_id ? <small className="error">{errors.national_id}</small> : null}
							</div>
						</div>

						<div className="form-group">
							<label htmlFor="email">Email</label>
							<input id="email" name="email" type="email" placeholder="example@email.com" required />
							{errors.email ? <small className="error">{errors.email}</small> : null}
						</div>

						<div className="form-group">
							<label htmlFor="role">Role</label>
							<select id="role" name="role" required>
								<option value="">Select your role</option>
								<option value="EMPLOYEE">Employee</option>
								<option value="EMPLOYER">Employer</option>
							</select>
							{errors.role ? <small className="error">{errors.role}</small> : null}
						</div>

						<div className="two-col">
							<div className="form-group">
								<label htmlFor="password">Password</label>
								<input id="password" name="password" type="password" placeholder="Enter password" required />
								{errors.password ? <small className="error">{errors.password}</small> : null}
							</div>

							<div className="form-group">
								<label htmlFor="confirm_password">Confirm Password</label>
								<input id="confirm_password" name="confirm_password" type="password" placeholder="Re-enter password" required />
								{errors.confirm_password ? <small className="error">{errors.confirm_password}</small> : null}
							</div>
						</div>

						<div className="form-foot">
							<small className="hint">By registering, you agree to our terms and privacy policy.</small>
						</div>

						<button id="submitBtn" type="submit" className="btn primary" disabled={submitting}>
							{submitting ? "Creating..." : "Create Account"}
						</button>
					</form>

					<p className="login-link">Already have an account? <Link href="/auth/login">Login</Link></p>
					<p className="small-note">We recommend using a strong, unique password.</p>
				</div>
			</div>

			<style>{`
				.navbar{display:flex;justify-content:space-between;align-items:center;padding:18px 30px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.06);position:sticky;top:0;z-index:10}
				.logo{font-size:1.25rem;font-weight:700;color:#00a859}
				.nav-links{list-style:none;display:flex;gap:16px;margin:0;padding:0}
				.nav-links a{text-decoration:none;color:#333;font-weight:500}
				.nav-links .btn.primary{background:#00a859;color:#fff;padding:8px 14px;border-radius:6px}
				.register-container{display:flex;justify-content:center;align-items:center;padding:48px 20px;min-height:calc(100vh - 80px);}
				.register-card{background:#fff;padding:36px;border-radius:10px;box-shadow:0 8px 30px rgba(8,24,48,0.06);max-width:640px;width:100%}
				.register-card h2{text-align:center;margin-bottom:6px;color:#00a859}
				.subtitle{text-align:center;color:#666;margin:0 0 18px}
				.two-col{display:grid;grid-template-columns:1fr;gap:14px}
				@media (min-width:720px){.two-col{grid-template-columns:1fr 1fr;gap:18px}}
				.form-group{margin-bottom:14px;display:flex;flex-direction:column;text-align:left}
				.form-group label{font-weight:600;margin-bottom:6px;color:#333}
				.form-group input,.form-group select,.form-group textarea{padding:11px 12px;border-radius:8px;border:1px solid #d1d5db;font-size:.98rem;background:#fff}
				.form-group input:focus,.form-group select:focus,.form-group textarea:focus{outline:none;border-color:#00a859;box-shadow:0 0 0 4px rgba(0,168,89,0.06)}
				.form-foot{margin:12px 0 18px;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
				.hint{color:#6b7280;font-size:.9rem}
				.btn{display:inline-block;text-decoration:none;border:none;cursor:pointer;border-radius:8px;font-weight:600}
				.btn.primary{width:100%;background:#00a859;color:#fff;padding:12px 14px;font-size:1rem}
				.btn.primary[disabled]{opacity:.6;cursor:not-allowed}
				.login-link{margin-top:14px;text-align:center}
				.login-link a{color:#00a859;font-weight:600;text-decoration:none}
				.form-group small.error{color:#c62828;display:block;font-size:.86rem;margin-top:6px}
				.small-note{font-size:.85rem;color:#666;text-align:center;margin-top:12px}
			`}</style>
		</div>
	);
}
