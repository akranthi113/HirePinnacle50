// src/pages/JobDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchJobById } from "../firebase/jobs";

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [shareMessage, setShareMessage] = useState("");
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const { job, error } = await fetchJobById(jobId);
        if (error) throw new Error(error);
        setJob(job);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [jobId]);

  const handleApply = () => navigate(`/apply/${jobId}`);
  const handleShare = async () => {
    if (!job) {
      alert('Job data not loaded yet.');
      return;
    }
    const url = `${window.location.origin}/HirePinnacle50/jobs/${jobId}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareMessage('Job link copied!');
      setTimeout(() => setShareMessage(''), 3000);
    } catch (e) {
      console.error(e);
      setShareMessage('Failed to copy link.');
      setTimeout(() => setShareMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-800 font-sans">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-brand-primary mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-slate-600 text-xs font-semibold">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 text-red-600 font-sans">
        {error}
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-800 font-sans">
        Job not found.
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-3xl -mr-40 -mt-40 z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-accent/10 rounded-full blur-3xl -ml-40 -mb-40 z-0 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 glassmorphism p-10 rounded-[2rem] shadow-lg border border-white/60 bg-white/80 backdrop-blur-xl">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
              {job.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-slate-600 mb-8">
              <div className="flex items-center bg-slate-100 px-4 py-2 rounded-full">
                <svg className="w-5 h-5 mr-2 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                {job.location}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {job.job_type && (
                  <span className="px-4 py-2 text-sm font-bold bg-brand-primary/10 text-brand-primary rounded-full border border-brand-primary/20">
                    {job.job_type}
                  </span>
                )}
                {job.experience_level && (
                  <span className="px-4 py-2 text-sm font-bold bg-brand-accent/10 text-brand-accent rounded-full border border-brand-accent/20">
                    {job.experience_level}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 font-sans">About The Role</h3>
            <div className="prose prose-lg prose-slate max-w-none text-slate-700 leading-loose whitespace-pre-line font-light">
              {job.description}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <div className="glassmorphism p-8 rounded-3xl shadow-lg border border-white/60 bg-white/80 backdrop-blur-xl sticky top-32 flex flex-col gap-4">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to join?</h3>
            
            <button
              onClick={handleApply}
              className="w-full py-4 px-6 text-lg font-bold text-white bg-brand-primary rounded-2xl hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Apply Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>

            <button
              onClick={handleShare}
              className="w-full py-3.5 px-6 text-base font-semibold text-slate-700 bg-white border-2 border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
              Share Job
            </button>
            
            {shareMessage && (
              <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium rounded-xl shadow-sm text-center animate-fade-in">
                {shareMessage}
              </div>
            )}

            <button
              onClick={() => navigate(-1)}
              className="w-full py-3.5 mt-2 px-6 text-base font-semibold text-slate-500 bg-transparent hover:text-slate-700 hover:bg-slate-100 rounded-2xl transition-all duration-200"
            >
              Back to List
            </button>

            <div className="mt-6 pt-6 border-t border-slate-200 flex items-center gap-3 text-sm text-slate-500 font-medium">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              Posted by Recruiter
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
