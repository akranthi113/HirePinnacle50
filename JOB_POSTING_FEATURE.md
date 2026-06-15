# Job Posting & Application Feature Specification

## Overview
Recruiters can create, manage, and delete job postings from the recruiter dashboard. Job postings appear on the public Jobs page where candidates can view jobs and apply. Applications submitted through job postings are tracked in the recruiter dashboard.

---

## Feature Components

### 1. Recruiter Dashboard - Add Job Section
**Location:** `src/pages/Dashboard.jsx` or `src/components/Dashboard.jsx`

**Functionality:**
- Add a new section/card in the recruiter dashboard: **"Post a New Job"**
- Form fields required:
  - Job Name (text input, required)
  - Job Description (textarea, required)
  - Location (text input, required)
  - Optional: Salary Range, Job Type, Experience Level
- Submit button: "Post Job"
- Success/error toast notifications
- After submission, the form clears and new job appears in the Jobs page

**Backend Integration:**
- Use existing `createJob()` function from `src/firebase/jobs.js`
- Pass `recruiterId` from `currentUser.uid`
- Store timestamp and recruiter metadata

---

### 2. Jobs Page Display
**Location:** `src/pages/Jobs.jsx` or `src/components/RecruiterJobsSection.jsx`

**Functionality:**
- Display all active job postings in a card/table layout
- Each job card shows:
  - Job Name (prominent)
  - Job Description (truncated or full)
  - Location
  - Posted by (recruiter name/email)
  - Posted date
  - "Apply Now" button (primary CTA)
  - Delete button (only visible if current user is the job creator)
- Job cards are clickable to view full details (optional enhancement)

**Backend Integration:**
- Fetch jobs using `fetchJobsByRecruiter()` for recruiter-specific jobs
- Fetch all jobs for public view using a new function if needed
- Display jobs in real-time order (newest first)

---

### 3. Apply Now Button & Navigation
**Functionality:**
- **Apply Now** button on each job card
- Clicking redirects to: `/apply?jobId={jobId}` or `/apply/{jobId}`
- Pass job details to Apply page so candidate sees which job they're applying for

**Apply Page Integration:**
- `src/pages/Apply.jsx` or `src/components/CandidateForm.jsx` enhanced with job context
- Pre-populate or display:
  - Job Name they're applying for
  - Job Description
  - Location
- Application submission:
  - Record `jobId` reference in the application
  - Link candidate to the specific job
  - Store in `applications` table with `job_id` foreign key

---

### 4. Job Deletion
**Functionality:**
- Delete button visible only on jobs posted by the current recruiter
- Confirm dialog: "Are you sure you want to delete this job? This action cannot be undone."
- After deletion:
  - Remove from UI immediately
  - Show success toast
  - Refresh jobs list
  - Cascade delete applications linked to this job (or mark as archived)

**Backend Integration:**
- Use existing `deleteJob()` function from `src/firebase/jobs.js`
- Consider: should applications for deleted jobs be removed or archived?

---

### 5. Recruiter Dashboard - Applications Tracking
**Location:** `src/components/Dashboard.jsx` (Applications/Candidates section)

**Enhancement:**
- Show which job each candidate applied for
- Link/reference to the job posting
- Filter applications by job
- Display job name in the candidate list or applications table
- Example: "John Doe - Applied for **Senior Developer** position in **Bangalore**"

**Backend Integration:**
- Modify `fetchApplicationsByRecruiter()` to include job details
- Join `applications` table with `jobs` table on `job_id`
- Return job name, location, description with each application

---

## Data Flow

### Add Job Workflow
1. Recruiter fills form in Dashboard → "Post Job" button
2. `createJob(jobData, recruiterId)` → Supabase `jobs` table
3. Job appears in Jobs page immediately
4. Confirmation toast shown

### Apply to Job Workflow
1. Candidate views job in Jobs page → clicks "Apply Now"
2. Redirected to Apply page with `jobId` in URL
3. Candidate fills application form (name, email, resume, etc.)
4. Application submitted → `applications` table with `job_id` reference
5. Application appears in recruiter dashboard under that job
6. Recruiter sees: "Candidate X applied for Job Y"

### Delete Job Workflow
1. Recruiter views job in Jobs page or Dashboard
2. Clicks "Delete" button on their own job
3. Confirmation dialog appears
4. On confirmation → `deleteJob(jobId)` → Supabase
5. Job removed from UI and database
6. Related applications handled (deleted or archived)

---

## Database Tables (Already Exist)

### `jobs` Table
- `id` (UUID PK)
- `recruiter_id` (UUID FK to `users`)
- `title` (TEXT)
- `description` (TEXT)
- `location` (TEXT)
- `salary_range` (TEXT, optional)
- `job_type` (TEXT, optional)
- `experience_level` (TEXT, optional)
- `timestamp` (TIMESTAMPTZ)

### `applications` Table
- `id` (UUID PK)
- `job_id` (UUID FK to `jobs`)
- `candidate_id` (UUID FK to `candidates`)
- `status` (TEXT: pending, accepted, rejected)
- `timestamp` (TIMESTAMPTZ)

---

## UI/UX Considerations

1. **Dashboard Add Job Form:**
   - Clean, minimal form layout
   - Validation: all required fields before submit
   - Disabled submit button while loading
   - Clear error messages on failure

2. **Jobs Page Display:**
   - Responsive card layout (grid on desktop, stack on mobile)
   - Clear "Apply Now" CTA (distinct color, prominent placement)
   - Delete button only for job creator (icon or subtle styling)
   - Empty state: "No jobs posted yet"

3. **Candidate Experience:**
   - Job context preserved on Apply page
   - Clear indication of which job they're applying for
   - Resume upload and form submission simplified

4. **Recruiter Dashboard:**
   - Shows count of applications per job
   - Separate section: "Applications by Job"
   - Quick filters by job name/location

---

## Implementation Checklist

- [ ] Add job posting form to recruiter dashboard
- [ ] Create "Add Job" UI component
- [ ] Implement job creation function (use existing `createJob()`)
- [ ] Display jobs on Jobs page (use existing `fetchJobsByRecruiter()` or create list view)
- [ ] Add "Apply Now" button and routing
- [ ] Enhance Apply page to show job details
- [ ] Link applications to jobs in database
- [ ] Add delete job functionality with confirmation
- [ ] Update recruiter dashboard to show applications by job
- [ ] Add toast notifications for all actions
- [ ] Test: Add job → See in Jobs page → Apply → See in Dashboard
- [ ] Test: Delete job and verify cascade/archive behavior
- [ ] Mobile responsiveness for all new UI
- [ ] Error handling for failed operations

---

## Files to Modify/Create

- `src/pages/Dashboard.jsx` - Add job posting section
- `src/pages/Jobs.jsx` - Enhance job display and filtering
- `src/pages/Apply.jsx` or `src/components/CandidateForm.jsx` - Job context integration
- `src/components/Dashboard.jsx` - Show job references in applications list
- `src/firebase/jobs.js` - Verify existing functions are complete
- `src/components/AddJobForm.jsx` - New component for job creation form (if separate)

---

## Success Criteria

- [x] Recruiter can post a job from dashboard
- [x] Job appears on Jobs page within seconds
- [x] Job displays: name, description, location, posted date
- [x] Candidate clicks "Apply Now" and is directed to apply page
- [x] Application submission links to the job
- [x] Recruiter sees applications linked to jobs in dashboard
- [x] Recruiter can delete their own jobs
- [x] Delete action removes job and related data
- [x] All actions show success/error notifications
- [x] Mobile responsive design
