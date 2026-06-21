// src/pages/Jobs.jsx
import React, { useEffect, useState, useMemo } from "react";
import { fetchJobs, deleteJob } from "../firebase/jobs";
import { useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";
import { useAuth } from "../context/AuthContext";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);

  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [filterJobType, setFilterJobType] = useState("");
  const [filterExperience, setFilterExperience] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Set page title
  useEffect(() => {
    document.title = "Job Opportunities | PlaceIO";
  }, []);

  // Load jobs from Supabase
  useEffect(() => {
    const load = async () => {
      const { jobs, error } = await fetchJobs();
      if (!error) setJobs(jobs);
    };
    load();
  }, []);

  // Derive filtered jobs with useMemo to avoid extra state and effect
  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const titleMatch = j.title.toLowerCase().includes(searchTitle.toLowerCase());
      const locationMatch = j.location.toLowerCase().includes(searchLocation.toLowerCase());
      const typeMatch = filterJobType ? (j.job_type || "").toLowerCase() === filterJobType.toLowerCase() : true;
      const expMatch = filterExperience ? (j.experience_level || "").toLowerCase() === filterExperience.toLowerCase() : true;
      return titleMatch && locationMatch && typeMatch && expMatch;
    });
  }, [jobs, searchTitle, searchLocation, filterJobType, filterExperience]);

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
    <div className="text-center py-24 glassmorphism rounded-3xl border border-slate-200 shadow-sm">
      <div className="w-24 h-24 bg-white border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
        <svg className="w-12 h-12 text-brand-primary animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
      </div>
      <p className="text-2xl font-medium text-slate-900 mb-4">No opportunities found.</p>
      <p className="text-slate-600 mb-10 max-w-md mx-auto font-light leading-relaxed">It looks like there are no roles matching your criteria at the moment. Try adjusting your filters or check back later.</p>
      {currentUser && (
        <button
          onClick={() => navigate("/dashboard")}
          className="btn-primary"
        >
          Create a new job
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-full h-[500px] bg-hero-pattern opacity-50 z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Discover Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-blue-600">Career Move</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-light">
            Explore exciting opportunities across top companies and take the next step in your professional journey.
          </p>
        </div>

        {/* Filters */}
        <div className="glassmorphism p-6 md:p-8 rounded-3xl mb-12 animate-slide-up">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-400 group-focus-within:text-brand-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input
                type="text"
                placeholder="Search job title..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="pl-12 w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm rounded-xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary block p-4 transition-all"
              />
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-400 group-focus-within:text-brand-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <input
                type="text"
                placeholder="Location..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="pl-12 w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm rounded-xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary block p-4 transition-all"
              />
            </div>
            <select
              value={filterJobType}
              onChange={(e) => setFilterJobType(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary block p-4 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-white text-slate-900">Any Job Type</option>
              <option value="Full-time" className="bg-white text-slate-900">Full-time</option>
              <option value="Part-time" className="bg-white text-slate-900">Part-time</option>
              <option value="Contract" className="bg-white text-slate-900">Contract</option>
              <option value="Internship" className="bg-white text-slate-900">Internship</option>
            </select>
            <select
              value={filterExperience}
              onChange={(e) => setFilterExperience(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary block p-4 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-white text-slate-900">Any Experience Level</option>
              <option value="Fresher" className="bg-white text-slate-900">Fresher</option>
              <option value="Junior" className="bg-white text-slate-900">Junior (1-3 yrs)</option>
              <option value="Mid-Level" className="bg-white text-slate-900">Mid-Level (3-5 yrs)</option>
              <option value="Senior" className="bg-white text-slate-900">Senior (5+ yrs)</option>
            </select>
          </div>
        </div>

        {/* Job list or empty state */}
        <div className="mb-8 flex justify-between items-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-bold text-slate-900">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'Opportunity' : 'Opportunities'} Found
          </h2>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {(filteredJobs.length ? filteredJobs : jobs).length === 0 ? (
            emptyState
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(filteredJobs.length ? filteredJobs : jobs).map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isOwner={currentUser?.id === job.recruiter_id}
                  onViewDetails={() => navigate(`/jobs/${job.id}`, { state: { job } })}
                  onApply={() => handleApply(job.id)}
                  onDelete={() => handleDeleteJob(job.id)}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default JobsPage;
