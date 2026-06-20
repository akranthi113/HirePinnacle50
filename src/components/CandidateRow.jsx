import React, { useState } from "react";
import { Copy, Check, FileDown, Eye, X, Trash2 } from "lucide-react";

const CandidateRow = ({ candidate, onStatusChange, onDeleteCandidate, userProfile }) => {
  const [copied, setCopied] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const appliedDate = candidate.timestamp
    ? (candidate.timestamp.toDate ? candidate.timestamp.toDate().toLocaleDateString() : new Date(candidate.timestamp).toLocaleDateString())
    : "N/A";

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Contacted":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "Interview":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Selected":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "Rejected":
        return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      case "On Hold":
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
      default:
        return "bg-white/10 text-slate-300 border-white/20";
    }
  };

  const handleCopy = () => {
    const summaryText = `Name: ${candidate.fullName || ""}
Father's Name: ${candidate.fatherName || ""}
Phone Number: ${candidate.phone || ""}
Alternative Number: ${candidate.alternativeNumber || ""}
Email ID: ${candidate.email || ""}
Date of Birth: ${candidate.dob || ""}
Gender: ${candidate.gender || ""}
Marital status: ${candidate.maritalStatus || ""}
Aadhar Number: ${candidate.aadharNumber || ""}
Highest Qualification: ${candidate.qualification || ""}
Residential address with pincode : ${candidate.address || ""}
Spoken Languages: ${candidate.languages || ""}
Experience: ${candidate.experience || ""}
How often will you be able to join? ${candidate.joiningTimeline || ""}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statuses = ["New", "Contacted", "Interview", "Selected", "Rejected", "On Hold"];

  return (
    <>
      <tr className="hover:bg-white/5 transition border-b border-white/5 text-sm">
        {/* Name */}
        <td className="px-6 py-4 whitespace-nowrap">
          <button
            onClick={() => setShowDetailsModal(true)}
            className="text-left font-semibold text-white hover:text-brand-primary hover:underline focus:outline-none transition"
            title="Click to view all details"
          >
            {candidate.fullName}
          </button>
        </td>

        {/* Phone */}
        <td className="px-6 py-4 whitespace-nowrap text-slate-300 font-mono">
          {candidate.phone}
        </td>

        {/* Email */}
        <td className="px-6 py-4 whitespace-nowrap text-slate-300">
          {candidate.email}
        </td>

        {/* Qualification */}
        <td className="px-6 py-4 whitespace-nowrap text-slate-300">
          {candidate.qualification}
        </td>

        {/* Experience */}
        <td className="px-6 py-4 whitespace-nowrap text-slate-300">
          {candidate.experience}
        </td>

        {/* Joining Timeline */}
        <td className="px-6 py-4 whitespace-nowrap text-slate-300">
          {candidate.joiningTimeline || "N/A"}
        </td>

        {/* Applied Date */}
        <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-mono text-xs">
          {appliedDate}
        </td>

        {/* Status */}
        <td className="px-6 py-4 whitespace-nowrap">
          <select
            value={candidate.status || "New"}
            onChange={(e) => onStatusChange(candidate.id, candidate.fullName, candidate.status || "New", e.target.value)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border focus:outline-none cursor-pointer tracking-wider ${getStatusColor(candidate.status || "New")}`}
          >
            {statuses.map((s) => (
              <option key={s} value={s} className="bg-brand-darker text-white font-medium">
                {s}
              </option>
            ))}
          </select>
        </td>

        {/* Actions */}
        <td className="px-6 py-4 whitespace-nowrap text-right text-slate-400 flex items-center justify-end space-x-3">
          {/* Copy WhatsApp / Clipboard Summary */}
          <button
            onClick={handleCopy}
            className={`p-2 rounded-lg border transition ${
              copied 
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
                : "bg-white/5 text-slate-300 border-white/10 hover:text-brand-primary hover:bg-brand-primary/10 hover:border-brand-primary/30"
            }`}
            title="Copy Info Summary"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* View Details Modal Trigger */}
          <button
            onClick={() => setShowDetailsModal(true)}
            className="p-2 rounded-lg border bg-white/5 text-slate-300 border-white/10 hover:text-brand-primary hover:bg-brand-primary/10 hover:border-brand-primary/30 transition"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Resume Download */}
          {candidate.resumeURL ? (
            <a
              href={candidate.resumeURL}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg border bg-white/5 text-slate-300 border-white/10 hover:text-brand-primary hover:bg-brand-primary/10 hover:border-brand-primary/30 transition flex items-center justify-center"
              title="Download/View Resume"
            >
              <FileDown className="w-4 h-4" />
            </a>
          ) : (
            <span className="p-2 rounded-lg border bg-white/5 text-slate-600 border-white/5 cursor-not-allowed" title="No Resume Uploaded">
              <FileDown className="w-4 h-4" />
            </span>
          )}

          {onDeleteCandidate && (
            <button
              onClick={() => onDeleteCandidate(candidate.id)}
              className="p-2 rounded-lg border bg-white/5 text-rose-400 border-white/10 hover:text-rose-300 hover:bg-rose-500/20 hover:border-rose-500/30 transition"
              title="Delete Candidate Record"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </td>
      </tr>

      {/* Candidate Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-darker/80 backdrop-blur-md">
          <div className="glassmorphism rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-white/10 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-white/10 pb-5 mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">{candidate.fullName}</h3>
                <p className="text-slate-400 text-xs mt-1 tracking-wider uppercase">Application Details — Applied on {appliedDate}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-slate-400 hover:bg-white/10 hover:text-white p-2 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid of Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm mb-8">
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Father's Name</span>
                <span className="text-white font-medium">{candidate.fatherName || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Date of Birth</span>
                <span className="text-white font-medium">{candidate.dob || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Phone Number</span>
                <span className="text-slate-300 font-mono font-medium">{candidate.phone || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Alternative Number</span>
                <span className="text-slate-300 font-mono font-medium">{candidate.alternativeNumber || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Email ID</span>
                <span className="text-white font-medium">{candidate.email || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Gender</span>
                <span className="text-white font-medium">{candidate.gender || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Marital Status</span>
                <span className="text-white font-medium">{candidate.maritalStatus || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Aadhar Number</span>
                <span className="text-white font-medium">{candidate.aadharNumber || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Highest Qualification</span>
                <span className="text-white font-medium">{candidate.qualification || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Spoken Languages</span>
                <span className="text-white font-medium">{candidate.languages || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Experience</span>
                <span className="text-white font-medium">{candidate.experience || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Join Timeline</span>
                <span className="text-white font-medium">{candidate.joiningTimeline || "N/A"}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-2">Residential Address with Pincode</span>
                <p className="text-slate-300 font-medium whitespace-pre-line bg-brand-dark/50 border border-white/5 p-4 rounded-xl text-sm leading-relaxed">
                  {candidate.address || "N/A"}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center border-t border-white/10 pt-6 gap-4">
              <span className="text-sm text-slate-400">Current Status: <strong className={`ml-2 px-3 py-1 rounded-full text-xs tracking-wider border ${getStatusColor(candidate.status || "New")}`}>{candidate.status || "New"}</strong></span>
              <div className="flex space-x-3 w-full sm:w-auto">
                <button
                  onClick={handleCopy}
                  className={`flex items-center justify-center flex-grow sm:flex-grow-0 text-sm font-bold px-5 py-2.5 rounded-xl border transition ${
                    copied
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-brand-primary/10 text-brand-primary border-brand-primary/30 hover:bg-brand-primary/20 hover:text-white hover:border-brand-primary"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Summary
                    </>
                  )}
                </button>
                {candidate.resumeURL && (
                  <a
                    href={candidate.resumeURL}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center flex-grow sm:flex-grow-0 text-sm bg-white text-brand-darker hover:bg-slate-200 font-bold px-5 py-2.5 rounded-xl transition shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    Resume
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CandidateRow;
