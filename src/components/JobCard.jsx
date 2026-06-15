import React from "react";

/**
 * JobCard – displays a concise job summary.
 * Props:
 *   job: job object containing title, location, description, job_type, experience_level, recruiter_id, id
 *   isOwner: boolean indicating if the current user is the recruiter who posted the job
 *   onViewDetails: callback to open the job detail view
 *   onApply: callback to initiate application process
 *   onDelete: callback after successful deletion (e.g., refresh list)
 */
const JobCard = ({ job, isOwner, onViewDetails, onApply, onDelete }) => {
  const handleView = () => {
    if (onViewDetails) onViewDetails();
  };

  const handleApply = () => {
    if (onApply) onApply();
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this job?")) {
      if (onDelete) onDelete();
    }
  };

  return (
    <div className="group relative p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-full overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors duration-200">{job.title}</h3>
        </div>
        
        <div className="flex items-center text-sm text-slate-500 mb-4">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          {job.location}
        </div>

        <p className="text-sm text-slate-600 line-clamp-2 mb-5 leading-relaxed">{job.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {job.job_type && (
            <span className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-100">{job.job_type}</span>
          )}
          {job.experience_level && (
            <span className="px-3 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">{job.experience_level}</span>
          )}
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-3 pt-4 border-t border-slate-100">
        <button 
          onClick={handleView} 
          className="flex-1 py-2 px-4 bg-slate-50 text-slate-700 font-medium rounded-xl hover:bg-slate-100 transition-colors duration-200 border border-slate-200 text-sm text-center"
        >
          View Details
        </button>
        {onApply && (
          <button 
            onClick={handleApply} 
            className="flex-1 py-2 px-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 text-sm text-center"
          >
            Apply Now
          </button>
        )}
        {isOwner && (
          <button 
            onClick={handleDelete} 
            className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors duration-200 border border-transparent hover:border-rose-100"
            title="Delete Job"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
