import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * JobDetailModal – displays full job details in an overlay.
 * Props:
 *   job: job object containing all fields to display.
 *   onClose: function to close the modal.
 *   onApply: callback when the user clicks the Apply button.
 */
const JobDetailModal = ({ job, onClose, onApply }) => {
  const navigate = useNavigate();

  // Fallback navigation if parent does not provide onApply
  const handleApply = () => {
    if (onApply) {
      onApply();
    } else if (job && job.id) {
      navigate(`/apply/${job.id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex-none p-6 sm:p-8 border-b border-slate-100 bg-white relative z-10">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          
          <h2 className="text-3xl font-extrabold text-slate-900 pr-12 mb-4 leading-tight">{job.title}</h2>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-1.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              {job.location}
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-1.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              Recruiter ID: {job.recruiter_id?.slice(0, 8) || "N/A"}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {job.job_type && (
              <span className="px-4 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-100">{job.job_type}</span>
            )}
            {job.experience_level && (
              <span className="px-4 py-1.5 text-sm font-medium bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">{job.experience_level}</span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Job Description</h3>
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
            {job.description}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-none p-6 border-t border-slate-100 bg-white flex justify-end gap-3 sm:gap-4 relative z-10">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-8 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200"
          >
            Apply Now
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default JobDetailModal;
