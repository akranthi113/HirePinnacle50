import React, { useEffect, useState } from "react";
import { fetchJobsByRecruiter, deleteJob, fetchApplicationsByRecruiter, deleteApplication } from "../firebase/jobs";
import AddJobForm from "../components/AddJobForm";

const RecruiterJobsSection = ({ currentUser }) => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);


  const loadJobs = async () => {
    setLoading(true);
    const { jobs, error } = await fetchJobsByRecruiter(currentUser?.id);
    if (!error) setJobs(jobs);
    setLoading(false);
  };

  const loadApplications = async () => {
    const { applications, error } = await fetchApplicationsByRecruiter(currentUser?.id);
    if (!error) setApplications(applications);
  };

  useEffect(() => {
    if (currentUser) {
      loadJobs();
      loadApplications();
    }
  }, [currentUser]);

  const handleDeleteJob = async (id) => {
    await deleteJob(id);
    loadJobs();
    loadApplications();
  };

  const handleDeleteApplication = async (id) => {
    await deleteApplication(id);
    loadApplications();
  };

  // No internal form handling; AddJobForm manages its own state
  // We'll pass a callback to refresh jobs after a new job is posted


  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-navy-800 mb-4">Your Job Postings</h2>
      <button
        className="mb-4 px-4 py-2 bg-navy-600 text-white rounded hover:bg-navy-700"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "Add New Job"}
      </button>
      {showForm && (
        <AddJobForm onJobCreated={loadJobs} />
      )}
      {loading ? (
        <p>Loading jobs…</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {jobs.map((job) => (
            <div key={job.id} className="p-4 border rounded bg-white shadow">
              <h3 className="font-semibold text-lg">{job.title}</h3>
              <p className="text-sm text-slate-600">{job.location}</p>
              <p className="mt-2 text-sm line-clamp-3">{job.description}</p>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleDeleteJob(job.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Delete Job
                </button>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/HirePinnacle50/apply/${job.id}`;
                    navigator.clipboard.writeText(url).then(() => alert("Share link copied!"));
                  }}
                  className="px-2 py-1 bg-navy-500 text-white rounded hover:bg-navy-600 text-sm"
                >
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-2xl font-bold text-navy-800 mt-8 mb-4">Applications to Your Jobs</h2>
      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <ul className="space-y-2">
          {applications.map((app) => (
            <li key={app.id} className="p-2 border rounded bg-white flex justify-between items-center">
              <div>
                <p className="font-medium">{app.candidate_name || app.email}</p>
                <p className="text-sm text-slate-500">Applied to: {app.jobs.title}</p>
              </div>
              <button
                onClick={() => handleDeleteApplication(app.id)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecruiterJobsSection;
