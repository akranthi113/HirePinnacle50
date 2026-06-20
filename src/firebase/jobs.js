import { supabase } from "./config";

// ---------- JOB FUNCTIONS ----------
// Create a new job posting
export const createJob = async (jobData, recruiterId) => {
  try {
    const payload = {
      ...jobData,
      recruiter_id: recruiterId,
      created_at: new Date().toISOString(),
    };
    const { data, error } = await supabase.from("jobs").insert(payload).select();
    if (error) throw error;
    return { job: data[0] || null, error: null };
  } catch (e) {
    console.error("Error creating job:", e);
    return { job: null, error: e.message };
  }
};

// Fetch all jobs (public)
export const fetchJobs = async () => {
  try {
    const { data, error } = await supabase.from("jobs").select("*", { count: "exact" }).order("created_at", { ascending: false });
    if (error) throw error;
    return { jobs: data || [], error: null };
  } catch (e) {
    console.error("Error fetching jobs:", e);
    return { jobs: [], error: e.message };
  }
};

// Fetch jobs created by a specific recruiter
export const fetchJobsByRecruiter = async (recruiterId) => {
  try {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("recruiter_id", recruiterId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return { jobs: data || [], error: null };
  } catch (e) {
    console.error("Error fetching recruiter jobs:", e);
    return { jobs: [], error: e.message };
  }
};

// Fetch a single job by ID
export const fetchJobById = async (jobId) => {
  try {
    const { data, error } = await supabase.from("jobs").select("*").eq("id", jobId).single();
    if (error) throw error;
    return { job: data || null, error: null };
  } catch (e) {
    console.error("Error fetching job by id:", e);
    return { job: null, error: e.message };
  }
};

// Delete a job (only recruiter)
export const deleteJob = async (jobId) => {
  try {
    const { error } = await supabase.from("jobs").delete().eq("id", jobId);
    if (error) throw error;
    return { success: true, error: null };
  } catch (e) {
    console.error("Error deleting job:", e);
    return { success: false, error: e.message };
  }
};

// Apply to a job (candidate submits)
export const applyToJob = async (jobId, applicantData) => {
  try {
    const payload = {
      job_id: jobId,
      ...applicantData,
      applied_at: new Date().toISOString(),
    };
    const { data, error } = await supabase.from("applications").insert(payload).select();
    if (error) throw error;
    return { application: data[0] || null, error: null };
  } catch (e) {
    console.error("Error applying to job:", e);
    return { application: null, error: e.message };
  }
};

// Get applications for a recruiter (by recruiter_id)
export const fetchApplicationsByRecruiter = async (recruiterId) => {
  try {
    const { data, error } = await supabase
      .from("applications")
      .select('*, jobs!inner(id, title, location, recruiter_id)')
      .eq('jobs.recruiter_id', recruiterId)
      .order('applied_at', { ascending: false });
    if (error) throw error;
    return { applications: data || [], error: null };
  } catch (e) {
    console.error("Error fetching applications:", e);
    return { applications: [], error: e.message };
  }
};

// Delete a single application (candidate) by id
export const deleteApplication = async (applicationId) => {
  try {
    const { error } = await supabase.from("applications").delete().eq("id", applicationId);
    if (error) throw error;
    return { success: true, error: null };
  } catch (e) {
    console.error("Error deleting application:", e);
    return { success: false, error: e.message };
  }
};
