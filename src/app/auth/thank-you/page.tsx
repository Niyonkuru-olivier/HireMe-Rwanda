import Link from "next/link";

export default function ThankYouPage({ searchParams }: { searchParams: { role?: string } }) {
	const role = searchParams?.role;
	return (
		<div style={{ maxWidth: 720, margin: "40px auto", padding: 20 }}>
			<h1 style={{ color: "#00a859" }}>Registration successful!</h1>
			{role ? <p>Your selected role: <strong>{role}</strong></p> : null}
			<p>You can now <Link href="/auth/login">login</Link>.</p>
		</div>
	);
}
