import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Job, Company, Announcement } from "@prisma/client";

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

export default async function Home() {
	const now = new Date();
	
	// Get all active jobs (no deadline or deadline in the future) with company info
	let allJobs: (Job & { company: Company | null })[] = [];
	let announcements: Announcement[] = [];
	
	try {
		allJobs = await prisma.job.findMany({
			where: {
				OR: [
					{ deadline: null },
					{ deadline: { gt: now } }
				]
			},
			include: { company: true },
			orderBy: { created_at: "desc" },
		});

		// Get non-expired announcements
		announcements = await prisma.announcement.findMany({
			where: {
				OR: [
					{ expiration_date: null },
					{ expiration_date: { gt: now } }
				]
			},
			orderBy: { created_at: "desc" },
		});
	} catch (error) {
		console.error('Database connection error:', error);
		// Continue with empty arrays if database is not available
	}

	return (
		<div className="home-container">
			<nav className="navbar">
				<div className="logo">JobConnect Rwanda</div>
				<ul className="nav-links">
					<li><Link href="/">Home</Link></li>
					<li><a href="#about">About Us</a></li>
					<li><a href="#contact">Contact</a></li>
					<li><Link href="/auth/login">Login</Link></li>
					<li><Link href="/auth/register" className="btn primary">Register</Link></li>
				</ul>
			</nav>

			<section className="hero">
				<div className="hero-content">
					<h1>Find Your Next Opportunity with <span className="brand">JobConnect Rwanda</span></h1>
					<p>Bridging the gap between Employers and Job Seekers across Rwanda</p>

					<div className="search-bar">
						<input type="text" placeholder="Search jobs by title, keyword..." />
						<input type="text" placeholder="Location" />
						<button>Search</button>
					</div>

					<div className="cta-buttons">
						<Link href="/auth/register" className="btn primary">Find Jobs</Link>
						<Link href="/auth/register?role=employer" className="btn secondary">Post a Job</Link>
					</div>
				</div>
			</section>

			<section className="announcements">
				<h2>Latest Announcements ({announcements.length})</h2>
				{announcements.length > 0 ? (
					<div className="ann-list">
						{announcements.map((a) => {
							const expiresSoon = a.expiration_date && new Date(a.expiration_date) < new Date(Date.now() + 24 * 60 * 60 * 1000);
							return (
								<div className="ann-card" key={a.id}>
									<h3>{a.title}</h3>
									<p>{a.content}</p>
									<div className="ann-meta">
										<small>Published on {new Date(a.created_at).toLocaleString()}</small>
										{a.expiration_date && (
											<small className={expiresSoon ? "expires-soon" : "expires-normal"}>
												{expiresSoon ? "⚠️ Expires soon: " : "Expires: "}
												{new Date(a.expiration_date).toLocaleString()}
											</small>
										)}
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<p className="no-ann">No announcements at this time.</p>
				)}
			</section>

			<section className="all-jobs">
				<h2>Available Jobs ({allJobs.length})</h2>
				{allJobs.length > 0 ? (
					<div className="job-list">
						{allJobs.map((job) => (
							<div className="job-card" key={job.id}>
								<h3>{job.title}</h3>
								<p><strong>Company:</strong> {job.company?.name || "Not specified"}</p>
								<p><strong>Location:</strong> {job.location || "Not specified"}</p>
								<p><strong>Type:</strong> {job.type.replace('_', ' ')}</p>
								{job.salary && <p><strong>Salary:</strong> {job.salary}</p>}
								<p><strong>Posted:</strong> {new Date(job.created_at).toLocaleDateString()}</p>
								<p><strong>Deadline:</strong> {job.deadline ? new Date(job.deadline).toLocaleDateString() : "No deadline"}</p>
								<div className="job-actions">
									<Link href="/auth/login">
										<button className="view-btn">View Details</button>
									</Link>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="no-jobs">
						<p>No jobs available at the moment. Check back later!</p>
						<Link href="/auth/register?role=employer" className="btn primary">Post a Job</Link>
					</div>
				)}
			</section>

			<section className="how-it-works">
				<h2>How It Works</h2>
				<div className="steps">
					<div className="step">
						<h3>1. Create Account</h3>
						<p>Sign up as an Employer or Employee to get started.</p>
					</div>
					<div className="step">
						<h3>2. Build Profile</h3>
						<p>Employers add company details, employees upload CVs & certificates.</p>
					</div>
					<div className="step">
						<h3>3. Connect</h3>
						<p>Employers post jobs, employees apply & get hired.</p>
					</div>
				</div>
			</section>

			<section id="about" className="about">
				<h2>About Us</h2>
				<p>
					JobConnect Rwanda is a digital platform dedicated to reducing unemployment by connecting
					skilled Rwandans with employers. Our mission is to empower individuals and help companies
					find the right talent efficiently and professionally.
				</p>
			</section>

			<section id="contact" className="contact">
				<h2>Contact Us</h2>
				<form method="POST" action="/api/contact">
					<input type="text" name="name" placeholder="Your Name" required />
					<input type="email" name="email" placeholder="Your Email" required />
					<textarea name="message" placeholder="Your Message" required />
					<button type="submit">Send Message</button>
				</form>
				<div className="contact-info">
					<p>Email: jobconnect@gmail.com</p>
					<p>Phone: +250 788 123 456</p>
					<p>Location: Kigali, Rwanda</p>
				</div>
			</section>

			<footer className="footer">
				<p>© 2025 JobConnect Rwanda. All Rights Reserved.</p>
			</footer>

			<style>{`
				.navbar{display:flex;justify-content:space-between;align-items:center;padding:20px 50px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.1);position:sticky;top:0;z-index:10}
				.logo{font-size:1.5rem;font-weight:700;color:#00a859}
				.nav-links{list-style:none;display:flex;gap:20px}
				.nav-links a{text-decoration:none;color:#333;font-weight:500}
				.nav-links .btn.primary{background:#00a859;color:#fff;padding:8px 15px;border-radius:5px}
				.hero{background:linear-gradient(to right,#00a859,#1abc9c);color:#fff;padding:100px 20px;text-align:center}
				.hero h1{font-size:2.8rem;margin-bottom:10px}
				.brand{color:#ffd700}
				.search-bar{margin:30px auto;display:flex;justify-content:center;gap:10px;flex-wrap:wrap}
				.search-bar input{padding:12px;border-radius:5px;border:none;width:200px}
				.search-bar button{padding:12px 20px;background:#ffd700;border:none;border-radius:5px;cursor:pointer}
				.cta-buttons{margin-top:20px}
				.btn{text-decoration:none;padding:12px 20px;margin:5px;border-radius:5px;display:inline-block}
				.primary{background:#ffd700;color:#333}
				.secondary{background:#fff;color:#00a859}
				.all-jobs{padding:60px 20px;text-align:center;background:#f8f8f8}
				.job-list{display:grid;grid-template-columns:repeat(auto-fill, minmax(350px, 1fr));gap:20px;max-width:1200px;margin:0 auto}
				.job-card{border:1px solid #ddd;padding:20px;border-radius:8px;background:#fff;text-align:left;box-shadow:0 2px 6px rgba(0,0,0,0.05);transition:transform 0.2s, box-shadow 0.2s}
				.job-card:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,0.1)}
				.job-card.deadline-passed{opacity:0.7;border-left:4px solid #ff6b6b}
				.job-card h3{color:#00a859;margin:0 0 10px;font-size:1.2rem}
				.job-card p{margin:5px 0;color:#333;font-size:0.9rem}
				.deadline-warning{color:#ff6b6b;font-weight:600;margin:10px 0;padding:5px;background:#ffe6e6;border-radius:4px}
				.job-actions{margin-top:15px;text-align:center}
				.view-btn{padding:8px 16px;background:#00a859;color:#fff;border:none;border-radius:5px;cursor:pointer;font-weight:600;transition:background 0.2s}
				.view-btn:hover{background:#008f47}
				.no-jobs{padding:40px;text-align:center;color:#666}
				.no-jobs .btn{margin-top:15px}
				.how-it-works{padding:60px 20px;text-align:center;background:#f8f8f8}
				.steps{display:flex;justify-content:center;gap:20px;margin-top:30px;flex-wrap:wrap}
				.step{flex:1;max-width:300px;background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,0.1)}
				.about{padding:60px 20px;text-align:center}
				.contact{padding:60px 20px;background:#f8f8f8;text-align:center}
				.contact form{max-width:500px;margin:0 auto 20px;display:flex;flex-direction:column;gap:15px}
				.contact input,.contact textarea{padding:12px;border-radius:5px;border:1px solid #ccc}
				.contact button{background:#00a859;color:#fff;padding:12px;border:none;border-radius:5px;cursor:pointer}
				.footer{background:#00a859;color:#fff;text-align:center;padding:15px;margin-top:30px}
				.announcements{background:#f9fdfb;padding:40px 20px;margin:40px auto;max-width:1000px;text-align:center}
				.announcements h2{color:#00a859;margin-bottom:20px}
				.ann-list{display:flex;flex-direction:column;gap:15px}
				.ann-card{background:#eaf9f0;border-left:5px solid #00a859;padding:15px 20px;border-radius:10px;text-align:left;box-shadow:0 2px 6px rgba(0,0,0,0.05)}
				.ann-card h3{margin:0 0 5px;color:#007f43}
				.ann-card p{margin:0 0 6px;color:#333}
				.ann-meta{display:flex;justify-content:space-between;align-items:center;margin-top:8px;flex-wrap:wrap;gap:10px}
				.ann-card small{color:#666;font-size:0.8rem}
				.expires-soon{color:#ff6b6b;font-weight:600}
				.expires-normal{color:#666}
				.no-ann{color:#777;font-style:italic}
			`}</style>
		</div>
	);
}
