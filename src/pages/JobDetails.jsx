// src/pages/JobDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchJobById } from "../firebase/jobs";
import { useAuth } from "../context/AuthContext";

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
    const url = `${window.location.origin}${window.location.pathname}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareMessage('Job link copied to clipboard!');
      setTimeout(() => setShareMessage(''), 3000);
    } catch (e) {
      console.error(e);
      setShareMessage('Failed to copy link.');
      setTimeout(() => setShareMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-800">
        Loading job details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 text-red-600">
        {error}
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-800">
        Job not found.
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-full h-[500px] bg-hero-pattern opacity-50 z-0"></div>

      <div className="max-w-4xl mx-auto relative z-10 glassmorphism p-8 rounded-3xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4">{job.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-1.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            {job.location}
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-1.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            Recruiter ID: {job.recruiter_id?.slice(0, 8) || "N/A"}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {job.job_type && (
            <span className="px-4 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-100">
              {job.job_type}
            </span>
          )}
          {job.experience_level && (
            <span className="px-4 py-1.5 text-sm font-medium bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
              {job.experience_level}
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Job Description</h3>
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line mb-8">
          {job.description}
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex gap-4 justify-end">
             <button
               onClick={() => navigate(-1)}
               className="px-6 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors"
             >
               Back
             </button>
             <button
               onClick={handleShare}
               className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200"
             >
               Share Link
             </button>
             <button
               onClick={handleApply}
               className="px-8 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200"
             >
               Apply Now
             </button>
          </div>
          {shareMessage && (
            <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium rounded-lg shadow-sm animate-fade-in">
              {shareMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
