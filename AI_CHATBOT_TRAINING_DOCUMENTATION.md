# JobConnect Rwanda - Complete System Documentation for AI Chatbot Training

## Table of Contents
1. [System Overview](#system-overview)
2. [User Roles](#user-roles)
3. [Account Creation & Authentication](#account-creation--authentication)
4. [Employee Features](#employee-features)
5. [Employer Features](#employer-features)
6. [Admin Features](#admin-features)
7. [Job Application Process](#job-application-process)
8. [Common User Questions & Answers](#common-user-questions--answers)
9. [Technical Information](#technical-information)

---

## System Overview

**JobConnect Rwanda** is a comprehensive job portal platform designed to connect job seekers (employees) with employers across Rwanda. The platform reduces unemployment by providing a digital space where:
- Employees can search for jobs, apply, and manage their profiles
- Employers can post jobs, manage applications, and find qualified candidates
- Admins can oversee the entire platform, manage users, and post announcements

**Platform URL**: [Your deployment URL]
**Contact**: jobconnect@gmail.com | +250 788 123 456 | Kigali, Rwanda

---

## User Roles

The system has three distinct user roles:

### 1. EMPLOYEE (Job Seeker)
- Can search and browse available jobs
- Can apply for jobs with cover letters
- Can create and manage their profile
- Can upload documents (CV, diplomas, certificates)
- Can track application status

### 2. EMPLOYER (Company/Recruiter)
- Can create company profile
- Can post, edit, and delete job listings
- Can view and manage job applications
- Can change application status (Applied, Shortlisted, Rejected, Hired)
- Can view applicant details and documents

### 3. ADMIN (Platform Administrator)
- Can view all users, jobs, and applications
- Can manage announcements
- Can create new admin accounts
- Can delete users or jobs if needed
- Has full oversight of the platform

---

## Account Creation & Authentication

### Registration Process

**Step 1: Access Registration Page**
- Navigate to the homepage
- Click "Register" button in the navigation bar
- Or visit `/auth/register`

**Step 2: Fill Registration Form**

Required information:
1. **Full Name**: Minimum 3 characters
2. **National ID**: Exactly 16 digits (Rwandan National ID)
3. **Email**: Valid email address (must be unique)
4. **Role**: Select either "Employee" or "Employer"
5. **Password**: Must meet security requirements:
   - At least 8 characters
   - Include uppercase letter
   - Include lowercase letter
   - Include number
   - Include special character (e.g., @, #, $, %, &)
6. **Confirm Password**: Must match the password

**Step 3: Submit & Verification**
- Click "Create Account"
- System validates all information
- If successful, redirected to thank-you page
- Account is immediately active (no email verification required)

**Common Registration Errors:**
- "Email or National ID already registered" - Use different email/ID
- "Passwords do not match" - Ensure both password fields are identical
- "National ID must be 16 digits" - Check your ID number
- "Password must be at least 8 chars..." - Strengthen your password

### Login Process

**Step 1: Access Login Page**
- Click "Login" in navigation bar
- Or visit `/auth/login`

**Step 2: Enter Credentials**
- Email address
- Password

**Step 3: Automatic Redirection**
- **Employees** → `/employee/dashboard`
- **Employers** → `/employer/dashboard`
- **Admins** → `/admin/dashboard`

**Forgot Password?**
- Click "Forgot Password?" link on login page
- Enter registered email
- System sends password reset link
- Click link in email to reset password

### Logout
- Click "Logout" in navigation menu
- Session is terminated
- Redirected to homepage

---

## Employee Features

### 1. Employee Dashboard (`/employee/dashboard`)

**What You See:**
- **Announcements Section**: Latest platform announcements and updates
- **My Applications Table**: All jobs you've applied for with:
  - Job title
  - Company name
  - Application date
  - Current status (Applied, Shortlisted, Rejected, Hired)

**Navigation Menu:**
- Jobs - Browse available positions
- Profile - Manage your profile
- Documents - Upload CV and certificates
- Logout

### 2. Browse Jobs (`/jobs`)

**Search & Filter Options:**
- **Search by keyword**: Job title or description
- **Filter by location**: Kigali, Musanze, Huye, Rubavu, etc.
- **Filter by type**: 
  - Full Time
  - Part Time
  - Contract
  - Internship

**Job Card Information:**
- Job title
- Company name
- Location
- Job type
- Salary (if specified)
- "Apply" button

**Important Notes:**
- Only active jobs are shown (no expired deadlines)
- Jobs without deadlines are always visible
- Must be logged in to apply

### 3. Apply for a Job (`/jobs/[id]/apply`)

**Application Process:**

**Step 1: Click "Apply" on Job Card**
- Redirected to application page
- Job details are displayed

**Step 2: Upload Cover Letter**
- Required: Cover letter document
- Accepted formats: PDF, DOC, DOCX
- Maximum file size: Check system limits

**Step 3: Submit Application**
- Click "Submit Application"
- System validates file
- Checks if you've already applied (prevents duplicates)
- Application is saved with status "APPLIED"

**After Submission:**
- Redirected to employee dashboard
- Application appears in "My Applications" table
- Employer is notified of new application

**Application Status Meanings:**
- **APPLIED**: Application received, under review
- **SHORTLISTED**: You've been selected for next round
- **REJECTED**: Application not successful this time
- **HIRED**: Congratulations! You got the job

### 4. Manage Profile (`/employee/profile`)

**Profile Information You Can Add:**

1. **Phone Number**: Contact number
2. **Location**: Your city/area
3. **Education**: 
   - Degrees, diplomas, certifications
   - Schools attended
   - Graduation dates
4. **Skills**: 
   - Technical skills
   - Soft skills
   - Languages
5. **Work Experience**:
   - Previous jobs
   - Responsibilities
   - Duration

**How to Update Profile:**
- Fill in the form fields
- Click "Save Profile"
- Success message appears
- Information is saved immediately

**Why Complete Your Profile?**
- Employers can see your qualifications
- Increases chances of being shortlisted
- Shows professionalism
- Helps employers match you to jobs

### 5. Upload Documents (`/employee/documents`)

**Document Types:**
1. **CV (Curriculum Vitae)**: Your resume
2. **DIPLOMA**: Educational certificates
3. **CERTIFICATE**: Professional certifications, training certificates

**Upload Process:**
1. Select document type from dropdown
2. Click "Choose File" and select document
3. Click "Upload Document"
4. Document appears in "Uploaded Files" table

**Uploaded Files Table Shows:**
- Document type
- File name (clickable to view/download)
- Upload date

**Accepted File Formats:**
- PDF (.pdf)
- Word Documents (.doc, .docx)
- Images (.jpg, .jpeg, .png)

**Important Notes:**
- Employers can view your documents when reviewing applications
- Keep documents up-to-date
- Use clear, professional file names
- Ensure documents are readable

---

## Employer Features

### 1. Employer Dashboard (`/employer/dashboard`)

**Dashboard Overview:**

**Announcements Section:**
- Platform-wide announcements
- Important updates
- Policy changes

**Statistics Cards:**
1. **Total Jobs**: Number of jobs you've posted
2. **Total Applications**: All applications across your jobs
3. **Recent Applications**: Last 5 applications with:
   - Applicant name
   - Job title
   - Status
   - "View" link

**Your Jobs Section:**
- List of all posted jobs
- Each job shows:
  - Title
  - Location, type, salary
  - Deadline
  - Number of applicants
  - Action buttons: "Applicants", "Edit", "Delete"

**Top Navigation:**
- Edit Company - Update company profile
- Post Job - Create new job listing
- Logout

### 2. Company Profile (`/employer/company-profile`)

**First-Time Setup:**
- Must create company profile before posting jobs
- Required for all job postings

**Company Information:**
1. **Company Name**: Official business name
2. **Description**: About your company, mission, values
3. **Website**: Company website URL (optional)

**How to Create/Update:**
- Fill in company details
- Click "Save Company Profile"
- Profile is linked to your account
- Information appears on all your job postings

### 3. Post a Job (`/employer/jobs/create`)

**Required Information:**

1. **Job Title** (Required)
   - Example: "Senior Software Engineer"
   - Be specific and clear

2. **Description** (Required, max 191 characters)
   - Role overview
   - Key responsibilities
   - What the candidate will do

3. **Requirements** (Optional, max 191 characters)
   - Required skills
   - Experience level
   - Qualifications
   - Education requirements

4. **Location** (Optional, max 191 characters)
   - City or area
   - Example: "Kigali, Rwanda"
   - Can specify "Remote" if applicable

5. **Salary** (Optional, max 191 characters)
   - Salary range
   - Example: "500,000 - 800,000 RWF"
   - Or "Competitive" if not disclosing

6. **Job Type** (Required)
   - Full Time
   - Part Time
   - Contract
   - Internship

7. **Deadline** (Optional)
   - Last date to apply
   - Format: YYYY-MM-DD
   - If not set, job stays active indefinitely

**After Posting:**
- Job appears on homepage
- Job appears in jobs listing
- Employees can search and apply
- You can edit or delete anytime

### 4. Edit a Job (`/employer/jobs/edit/[id]`)

**What You Can Edit:**
- All job information (title, description, requirements, etc.)
- Change deadline
- Update salary
- Modify job type

**How to Edit:**
1. Go to employer dashboard
2. Find the job in "Your Jobs" section
3. Click "Edit" button
4. Update information
5. Click "Save Changes"

**Important:**
- Existing applications are not affected
- Changes are visible immediately
- Applicants are not notified of changes

### 5. Delete a Job

**How to Delete:**
1. Go to employer dashboard
2. Find the job in "Your Jobs" section
3. Click "Delete" button
4. Confirm deletion

**What Happens:**
- Job is permanently removed
- No longer visible to job seekers
- All applications for that job are also deleted
- Cannot be undone

**When to Delete:**
- Position has been filled
- Job is no longer available
- Posted by mistake

### 6. View Applicants for a Job (`/employer/applicants/job/[id]`)

**Applicants List Shows:**
- Applicant name
- Email address
- Application date
- Current status
- "View Details" button

**How to Access:**
- From dashboard, click "Applicants (X)" on any job card
- Or navigate to specific job's applicant list

### 7. View Individual Applicant (`/employer/applicants/[id]`)

**Applicant Details Page Shows:**

**Personal Information:**
- Full name
- Email
- National ID

**Profile Information:**
- Phone number
- Location
- Education background
- Skills
- Work experience

**Application Details:**
- Job applied for
- Application date
- Cover letter (downloadable)
- Current status

**Uploaded Documents:**
- CV
- Diplomas
- Certificates
- All documents are downloadable

**Status Management:**
- Dropdown to change status:
  - Applied
  - Shortlisted
  - Rejected
  - Hired
- Click "Update Status" to save
- Applicant can see status in their dashboard

**Decision Making:**
- Review all information
- Download and read documents
- Compare with job requirements
- Update status accordingly

---

## Admin Features

### 1. Admin Dashboard (`/admin/dashboard`)

**Overview Statistics:**
- Total users (employees + employers)
- Total jobs posted
- Total applications
- Recent activity

**Admin Navigation:**
- Users - Manage all users
- Jobs - View/manage all jobs
- Applications - View all applications
- Announcements - Create/manage announcements
- New Admin - Create additional admin accounts

### 2. Manage Users (`/admin/users`)

**User Management:**
- View all registered users
- See user details (name, email, role, registration date)
- Delete users if necessary
- Search and filter users

### 3. Manage Jobs (`/admin/jobs`)

**Job Management:**
- View all posted jobs
- See job details
- Delete inappropriate jobs
- Monitor job postings

### 4. Manage Applications (`/admin/applications`)

**Application Oversight:**
- View all applications across platform
- See application status
- Monitor application trends

### 5. Announcements (`/admin/announcements`)

**Create Announcement:**
1. **Title**: Announcement headline
2. **Content**: Detailed message
3. **Expiration Date** (Optional): When announcement should stop showing

**Announcement Display:**
- Shows on homepage
- Shows on employee dashboard
- Shows on employer dashboard
- Automatically hidden after expiration

**Use Cases:**
- Platform updates
- Maintenance notices
- New features
- Important policy changes
- Holiday schedules

### 6. Create New Admin (`/admin/new_admin`)

**Admin Creation:**
- Email address
- Password
- New admin can access admin dashboard
- Use for team members who need admin access

---

## Job Application Process

### Complete Flow: From Job Posting to Hiring

**Phase 1: Employer Posts Job**
1. Employer creates company profile (if first time)
2. Employer clicks "Post Job"
3. Fills in job details
4. Sets deadline (optional)
5. Submits job
6. Job appears on platform immediately

**Phase 2: Employee Discovers Job**
1. Employee logs in
2. Browses jobs page
3. Uses search/filters to find relevant jobs
4. Clicks on interesting job
5. Reviews job details

**Phase 3: Employee Applies**
1. Clicks "Apply" button
2. Uploads cover letter
3. Submits application
4. Application status: "APPLIED"
5. Application appears in employee dashboard

**Phase 4: Employer Reviews**
1. Employer sees new application notification
2. Goes to "Applicants" for that job
3. Reviews applicant profile
4. Downloads and reads CV, cover letter, certificates
5. Evaluates qualifications

**Phase 5: Employer Makes Decision**
1. **Shortlist**: Changes status to "SHORTLISTED"
   - Indicates interest
   - May contact for interview
2. **Reject**: Changes status to "REJECTED"
   - Not a good fit
   - Employee can see status
3. **Hire**: Changes status to "HIRED"
   - Offer extended
   - Position filled

**Phase 6: Employee Checks Status**
1. Employee logs into dashboard
2. Checks "My Applications" table
3. Sees updated status
4. Takes appropriate action

---

## Common User Questions & Answers

### General Questions

**Q: Is JobConnect Rwanda free to use?**
A: Yes, the platform is completely free for both job seekers and employers.

**Q: Do I need to verify my email?**
A: No, accounts are active immediately after registration.

**Q: Can I have both employee and employer accounts?**
A: No, each email can only be registered once. Choose the role that best fits your needs.

**Q: How do I contact support?**
A: Email jobconnect@gmail.com or call +250 788 123 456.

### Employee Questions

**Q: How many jobs can I apply for?**
A: There's no limit. You can apply for as many jobs as you want.

**Q: Can I apply for the same job twice?**
A: No, the system prevents duplicate applications.

**Q: How do I know if my application was received?**
A: Check your dashboard - the application will appear in "My Applications" table.

**Q: What does "Shortlisted" status mean?**
A: The employer is interested and may contact you for an interview.

**Q: Can I withdraw my application?**
A: Currently, you cannot withdraw applications. Contact the employer directly if needed.

**Q: What file formats can I upload?**
A: PDF, DOC, DOCX for documents. JPG, PNG for images.

**Q: Is my profile visible to all employers?**
A: Employers can only see your profile when you apply for their jobs.

**Q: Can I edit my application after submitting?**
A: No, applications cannot be edited after submission. Ensure all information is correct before applying.

### Employer Questions

**Q: Do I need a company profile to post jobs?**
A: Yes, you must create a company profile before posting your first job.

**Q: How long do job postings stay active?**
A: Until the deadline you set, or indefinitely if no deadline is set.

**Q: Can I edit a job after posting?**
A: Yes, click "Edit" on the job in your dashboard.

**Q: How do I remove a job posting?**
A: Click "Delete" on the job in your dashboard. This action cannot be undone.

**Q: Can I see applicant documents?**
A: Yes, when viewing an applicant's details, you can download their CV, diplomas, and certificates.

**Q: How do I contact an applicant?**
A: Use the email address shown on their applicant details page.

**Q: What happens when I mark someone as "Hired"?**
A: The status updates in their dashboard. You should contact them separately to extend the offer.

**Q: Can I repost a deleted job?**
A: No, you'll need to create a new job posting with the same information.

### Technical Questions

**Q: What browsers are supported?**
A: Chrome, Firefox, Safari, Edge (latest versions recommended).

**Q: Is there a mobile app?**
A: No mobile app yet, but the website works on mobile browsers.

**Q: My password isn't working. What should I do?**
A: Use the "Forgot Password?" link on the login page to reset it.

**Q: I forgot my National ID number. Can I still register?**
A: You need your 16-digit National ID to register. Check your ID card.

**Q: Can I change my email address?**
A: Currently, email addresses cannot be changed. Contact support for assistance.

**Q: Is my data secure?**
A: Yes, passwords are encrypted, and the platform uses secure connections (HTTPS).

---

## Technical Information

### System Architecture

**Frontend:**
- Next.js 15.5.6 (React framework)
- Server-side rendering
- TypeScript for type safety

**Backend:**
- Next.js API routes
- RESTful API design

**Database:**
- MySQL/MariaDB
- Prisma ORM for database operations

**Authentication:**
- JWT (JSON Web Tokens)
- HTTP-only cookies
- bcrypt password hashing

**File Storage:**
- Local file system
- Public uploads directory

### Database Schema

**Users Table:**
- id, full_name, national_id, email, role, password, created_at

**Companies Table:**
- id, name, description, website, owner_id, created_at, updated_at

**Jobs Table:**
- id, title, description, requirements, location, salary, type, deadline, company_id, created_at, updated_at

**Applications Table:**
- id, user_id, job_id, status, cover_letter, applied_at

**Employee Profiles Table:**
- id, user_id, phone, location, education, skills, experience, updated_at

**Employee Documents Table:**
- id, user_id, file_name, file_path, file_type, uploaded_at

**Admins Table:**
- id, email, password, created_at

**Announcements Table:**
- id, title, content, expiration_date, created_at

### API Endpoints

**Authentication:**
- POST `/api/auth/register` - Create new account
- POST `/api/auth/login` - Login
- POST `/api/auth/logout` - Logout
- POST `/api/auth/forgot-password` - Request password reset
- POST `/api/auth/reset-password` - Reset password

**Employee:**
- POST `/api/employee/profile` - Update profile
- POST `/api/employee/documents` - Upload document
- POST `/api/applications/[jobId]/apply` - Apply for job

**Employer:**
- POST `/api/employer/company-profile` - Create/update company
- POST `/api/employer/jobs` - Create job
- PUT `/api/employer/jobs/[id]` - Update job
- DELETE `/api/employer/jobs/[id]` - Delete job
- PUT `/api/employer/applications/[id]/status` - Update application status

**Admin:**
- GET `/api/admin/users` - List all users
- DELETE `/api/admin/users/[id]` - Delete user
- GET `/api/admin/jobs` - List all jobs
- DELETE `/api/admin/jobs/[id]` - Delete job
- GET `/api/admin/applications` - List all applications
- POST `/api/admin/announcements` - Create announcement
- PUT `/api/admin/announcements/[id]` - Update announcement
- DELETE `/api/admin/announcements/[id]` - Delete announcement
- POST `/api/admin/new_admin` - Create new admin

### Job Types

- **FULL_TIME**: Regular full-time employment
- **PART_TIME**: Part-time work
- **CONTRACT**: Fixed-term contract
- **INTERNSHIP**: Internship/training position

### Application Statuses

- **APPLIED**: Initial status when application is submitted
- **SHORTLISTED**: Employer has selected for further consideration
- **REJECTED**: Application not successful
- **HIRED**: Candidate has been hired

### Document Types

- **CV**: Curriculum Vitae/Resume
- **DIPLOMA**: Educational certificates
- **CERTIFICATE**: Professional certifications

---

## Chatbot Response Guidelines

### Tone & Style
- Be friendly, professional, and helpful
- Use clear, simple language
- Avoid technical jargon unless necessary
- Be patient and understanding
- Provide step-by-step instructions

### When User Asks About:

**Registration Issues:**
1. Verify they're using correct format (16-digit National ID, valid email)
2. Check password meets requirements
3. Confirm email isn't already registered
4. Guide through registration process step-by-step

**Login Problems:**
1. Verify they're using registered email
2. Suggest password reset if forgotten
3. Check if they're using correct role (employee vs employer)
4. Ensure cookies are enabled

**Job Application:**
1. Confirm they're logged in as employee
2. Verify they have required documents
3. Guide through application process
4. Explain what happens after applying

**Job Posting:**
1. Confirm they're logged in as employer
2. Check if company profile is created
3. Guide through job creation
4. Explain character limits and required fields

**Status Updates:**
1. Explain what each status means
2. Guide to where they can check status
3. Set realistic expectations for response times

**Technical Issues:**
1. Suggest browser refresh
2. Check if logged in
3. Verify internet connection
4. Recommend clearing cache if needed
5. Escalate to support if unresolved

### Sample Responses

**User: "How do I create an account?"**
Chatbot: "I'd be happy to help you create an account! Here's how:

1. Click the 'Register' button at the top of the page
2. Fill in your details:
   - Full name
   - 16-digit National ID
   - Email address
   - Choose 'Employee' if you're looking for jobs, or 'Employer' if you're hiring
   - Create a strong password (at least 8 characters with uppercase, lowercase, number, and special character)
3. Click 'Create Account'

Your account will be active immediately! Would you like help with any specific step?"

**User: "I can't log in"**
Chatbot: "I'm sorry you're having trouble logging in. Let's troubleshoot:

1. Are you using the email address you registered with?
2. Is your password correct? (Remember it's case-sensitive)
3. If you forgot your password, click 'Forgot Password?' on the login page

If you're still having issues, please let me know what error message you're seeing, and I'll help you further."

**User: "How do I apply for a job?"**
Chatbot: "Great! Here's how to apply for a job:

1. Make sure you're logged in as an Employee
2. Go to the 'Jobs' page from your dashboard
3. Browse or search for jobs you're interested in
4. Click 'Apply' on the job you want
5. Upload your cover letter (PDF, DOC, or DOCX format)
6. Click 'Submit Application'

Your application will appear in your dashboard, and you can track its status there. The employer will review your profile, CV, and documents. Good luck!"

---

## Important Notes for Chatbot

1. **Always verify user role** before providing role-specific instructions
2. **Never share passwords** or ask users for their passwords
3. **Escalate to human support** for:
   - Account deletion requests
   - Payment issues (if applicable)
   - Legal concerns
   - Harassment reports
4. **Be encouraging** - job searching can be stressful
5. **Provide realistic timelines** - don't promise immediate responses from employers
6. **Respect privacy** - don't ask for or share personal information
7. **Stay updated** - if system features change, update your knowledge base

---

## Contact Information for Escalation

**Email**: jobconnect@gmail.com
**Phone**: +250 788 123 456
**Location**: Kigali, Rwanda
**Business Hours**: [Specify if available]

---

## Version Information

**Platform Version**: 1.0
**Last Updated**: February 2025
**Documentation Version**: 1.0

---

*This documentation is designed to train AI chatbots to provide accurate, helpful assistance to JobConnect Rwanda users. Keep this document updated as the platform evolves.*
