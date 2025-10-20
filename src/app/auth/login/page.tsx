"use client";

import Link from "next/link";
import { useState, useRef } from "react";

export default function LoginPage() {
	const [submitting, setSubmitting] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const modalRef = useRef<HTMLDivElement>(null);

	function isValidEmail(email: string) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setErrors({});
		const form = e.currentTarget as HTMLFormElement & {
			email: { value: string };
			password: { value: string };
		};
		const email = form.email.value.trim();
		const password = form.password.value.trim();
		const nextErrors: Record<string, string> = {};
		if (!isValidEmail(email)) nextErrors.email = "Enter a valid email.";
		if (password.length < 8) nextErrors.password = "Password must be at least 8 characters.";
		if (Object.keys(nextErrors).length) { setErrors(nextErrors); return; }

		try {
			setSubmitting(true);
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			if (res.ok) {
				// server will set cookie; redirect based on role
				const data = await res.json();
				window.location.href = data.redirect || "/";
				return;
			}
			const data = await res.json().catch(() => ({} as any));
			setErrors({ form: (data as any).error || "Invalid credentials" });
		} finally {
			setSubmitting(false);
		}
	}

	async function onForgotSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = e.currentTarget as HTMLFormElement & { email: { value: string } };
		const email = form.email.value.trim();
		if (!isValidEmail(email)) { alert("Enter a valid email"); return; }
		const res = await fetch("/api/auth/forgot-password", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email }),
		});
		if (res.ok) { alert("Reset link sent if the email exists."); closeModal(); } else { alert("Failed to send reset link."); }
	}

	function openModal() {
		if (modalRef.current) modalRef.current.style.display = "flex";
	}
	function closeModal() {
		if (modalRef.current) modalRef.current.style.display = "none";
	}

	return (
		<div>
			<nav className="navbar">
				<div className="logo">JobConnect Rwanda</div>
				<ul className="nav-links">
					<li><Link href="/">Home</Link></li>
					<li><Link href="/auth/register" className="btn primary">Register</Link></li>
				</ul>
			</nav>

			<div className="login-container">
				<div className="login-card">
					<h2>Login to Your Account</h2>
					{errors.form ? <div className="flash error">{errors.form}</div> : null}
					<form id="loginForm" onSubmit={onSubmit} noValidate>
						<div className="form-group">
							<label>Email</label>
							<input type="email" name="email" id="email" placeholder="example@gmail.com" required />
							{errors.email ? <small className="error" id="err_email">{errors.email}</small> : null}
						</div>
						<div className="form-group">
							<label>Password</label>
							<input type="password" name="password" id="password" placeholder="Enter your password" required />
							{errors.password ? <small className="error" id="err_password">{errors.password}</small> : null}
						</div>
						<button type="submit" id="submitBtn" className="btn primary" disabled={submitting}>{submitting ? "Signing in..." : "Login"}</button>
					</form>

					<div className="links">
						<p>
							<Link href="/auth/register">Register</Link> | {" "}
							<a href="#" onClick={(e)=>{e.preventDefault(); openModal();}}>Forgot Password?</a>
						</p>
					</div>
				</div>
			</div>

			<div id="forgotModal" ref={modalRef} onClick={(e)=>{ if(e.target === modalRef.current) closeModal(); }}>
				<div className="modal-content">
					<span id="closeModal" onClick={closeModal}>&times;</span>
					<h2>Reset Password</h2>
					<form id="forgotForm" onSubmit={onForgotSubmit}>
						<input type="email" name="email" placeholder="Enter your registered email" required />
						<button type="submit">Send Reset Link</button>
					</form>
				</div>
			</div>

			<style>{`
				.navbar{display:flex;justify-content:space-between;align-items:center;padding:18px 30px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.06);position:sticky;top:0;z-index:10}
				.logo{font-size:1.25rem;font-weight:700;color:#00a859}
				.nav-links{list-style:none;display:flex;gap:16px;margin:0;padding:0}
				.nav-links a{text-decoration:none;color:#333;font-weight:500}
				.nav-links .btn.primary{background:#00a859;color:#fff;padding:8px 14px;border-radius:6px}
				.login-container{display:flex;justify-content:center;align-items:center;padding:60px 20px;background:#f8f8f8;min-height:100vh}
				.login-card{background:#fff;padding:40px;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.1);max-width:450px;width:100%;text-align:center}
				.login-card h2{color:#00a859;margin-bottom:25px}
				.form-group{margin-bottom:20px;display:flex;flex-direction:column;text-align:left}
				.form-group label{font-weight:500;margin-bottom:5px}
				.form-group input{padding:12px;border:1px solid #ccc;border-radius:6px}
				.form-group small.error{color:red;font-size:.85rem;margin-top:4px;display:block}
				.btn.primary{width:100%;background:#00a859;color:#fff;padding:12px;border:none;border-radius:6px;cursor:pointer;font-size:1rem}
				.btn.primary:disabled{background:gray;cursor:not-allowed}
				.links{margin-top:15px}
				.links a{color:#00a859;font-weight:600;text-decoration:none;margin:0 5px}
				#forgotModal{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);justify-content:center;align-items:center;z-index:1000}
				#forgotModal .modal-content{background:#fff;padding:30px;border-radius:10px;width:400px;max-width:90%;position:relative}
				#forgotModal h2{color:#00a859;text-align:center;margin-bottom:20px}
				#forgotModal input[type=email]{width:100%;padding:12px;margin-bottom:15px;border-radius:6px;border:1px solid #ccc}
				#forgotModal button{width:100%;padding:12px;border:none;border-radius:6px;background:#00a859;color:#fff;font-size:1rem;cursor:pointer}
				#forgotModal #closeModal{position:absolute;top:10px;right:15px;font-size:20px;cursor:pointer}
			`}</style>
		</div>
	);
}
