import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";

const JobCard = ({ job, isOwner, onViewDetails, onApply, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const handleView = () => {
    if (onViewDetails) onViewDetails();
  };

  const handleApply = () => {
    if (onApply) onApply();
  };

  const handleDelete = async () => {
    setDeleting(true);
    if (onDelete) onDelete();
    setDeleting(false);
    setShowDeleteModal(false);
  };

  return (
    <div className="group relative p-6 glassmorphism glassmorphism-hover rounded-2xl flex flex-col justify-between h-full overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-brand-primary transition-colors duration-300">{job.title}</h3>
        </div>
        
        <div className="flex items-center text-sm text-slate-600 mb-5">
          <svg className="w-4 h-4 mr-1 text-brand-primary/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          {job.location}
        </div>

        <p className="text-sm text-slate-700 line-clamp-2 mb-6 leading-relaxed font-light">{job.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {job.job_type && (
            <span className="px-3 py-1 text-xs font-medium bg-brand-primary/10 text-brand-primary rounded-full border border-brand-primary/20 tracking-wide">{job.job_type}</span>
          )}
          {job.experience_level && (
            <span className="px-3 py-1 text-xs font-medium bg-brand-accent/10 text-brand-accent rounded-full border border-brand-accent/20 tracking-wide">{job.experience_level}</span>
          )}
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-3 pt-5 border-t border-slate-200">
        <button 
          onClick={handleView} 
          className="flex-1 py-2.5 px-4 bg-slate-100 text-slate-800 font-medium rounded-xl hover:bg-slate-200 transition-colors duration-200 border border-slate-300 text-sm text-center"
        >
          Details
        </button>
        {onApply && (
          <button 
            onClick={handleApply} 
            className="flex-1 py-2.5 px-4 btn-primary text-sm text-center shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            Apply
          </button>
        )}
        {isOwner && (
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="p-2.5 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-colors duration-200 border border-transparent hover:border-rose-500/30"
            title="Delete Job"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        )}

        {showDeleteModal && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm rounded-2xl p-4">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 max-w-sm w-full">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-50 border border-rose-100 mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Delete Job?</h3>
              <p className="text-sm text-slate-600 text-center mb-6 font-light">
                This will permanently remove this job posting. This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg transition text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-2.5 px-4 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg transition text-sm disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCard;
