// src/pages/Jobs.jsx
import React, { useEffect, useState } from "react";
import { fetchJobs, deleteJob } from "../firebase/jobs";
import { useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";
import JobDetailModal from "../components/JobDetailModal";
import { useAuth } from "../context/AuthContext";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [filterJobType, setFilterJobType] = useState("");
  const [filterExperience, setFilterExperience] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Load jobs from Supabase
  useEffect(() => {
    const load = async () => {
      const { jobs, error } = await fetchJobs();
      if (!error) setJobs(jobs);
    };
    load();
  }, []);

  // Apply search and filter criteria
  useEffect(() => {
    const filtered = jobs.filter((j) => {
      const titleMatch = j.title.toLowerCase().includes(searchTitle.toLowerCase());
      const locationMatch = j.location.toLowerCase().includes(searchLocation.toLowerCase());
      const typeMatch = filterJobType ? (j.job_type || "").toLowerCase() === filterJobType.toLowerCase() : true;
      const expMatch = filterExperience ? (j.experience_level || "").toLowerCase() === filterExperience.toLowerCase() : true;
      return titleMatch && locationMatch && typeMatch && expMatch;
    });
    setFilteredJobs(filtered);
  }, [searchTitle, searchLocation, filterJobType, filterExperience, jobs]);

  const openDetail = (job) => setSelectedJob(job);
  const closeDetail = () => setSelectedJob(null);

  const handleApply = (jobId) => navigate(`/apply/${jobId}`);

  // Delete a job and update UI
  const handleDeleteJob = async (jobId) => {
    try {
      await deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (e) {
      console.error('Delete failed', e);
    }
  };

  const emptyState = (
    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
      </div>
      <p className="text-xl font-medium text-slate-800 mb-2">No jobs posted yet.</p>
      <p className="text-slate-500 mb-8 max-w-md mx-auto">It looks like there are no job opportunities available at the moment. Check back later or create a new job if you're a recruiter.</p>
      {currentUser && (
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200"
        >
          Create a new job
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Discover Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Career Move</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Explore exciting opportunities across top companies and take the next step in your professional journey.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 mb-10">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input
                type="text"
                placeholder="Search job title..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="pl-10 w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 transition-colors"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <input
                type="text"
                placeholder="Location..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="pl-10 w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 transition-colors"
              />
            </div>
            <select
              value={filterJobType}
              onChange={(e) => setFilterJobType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 transition-colors"
            >
              <option value="">Any Job Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
            <select
              value={filterExperience}
              onChange={(e) => setFilterExperience(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 transition-colors"
            >
              <option value="">Any Experience Level</option>
              <option value="Fresher">Fresher</option>
              <option value="Junior">Junior (1-3 yrs)</option>
              <option value="Mid-Level">Mid-Level (3-5 yrs)</option>
              <option value="Senior">Senior (5+ yrs)</option>
            </select>
          </div>
        </div>

        {/* Job list or empty state */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
          </h2>
        </div>

        {(filteredJobs.length ? filteredJobs : jobs).length === 0 ? (
          emptyState
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(filteredJobs.length ? filteredJobs : jobs).map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isOwner={currentUser?.id === job.recruiter_id}
                onViewDetails={() => openDetail(job)}
                onApply={() => handleApply(job.id)}
                onDelete={() => handleDeleteJob(job.id)}
              />
            ))}
          </div>
        )}

        {/* Detail modal */}
        {selectedJob && (
          <JobDetailModal
            job={selectedJob}
            onClose={closeDetail}
            onApply={() => handleApply(selectedJob.id)}
          />
        )}
      </div>
    </div>
  );
};

export default JobsPage;
