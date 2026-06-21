import React, { useState, useEffect } from "react";
import { Copy, Check, FileDown, Eye, X, Trash2 } from "lucide-react";

const CandidateRow = ({ candidate, onStatusChange, onDeleteCandidate, userProfile, applications = [] }) => {
  const [copied, setCopied] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    if (!showDetailsModal) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setShowDetailsModal(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [showDetailsModal]);

  const appliedDate = candidate.timestamp
    ? (candidate.timestamp.toDate ? candidate.timestamp.toDate().toLocaleDateString() : new Date(candidate.timestamp).toLocaleDateString())
    : "N/A";

  const candidateApps = (applications || []).filter(app => app.candidate_id === candidate.id);
  const appliedRoles = candidateApps.map(app => app.jobs?.title).filter(Boolean);
  const roleText = appliedRoles.length > 0 ? appliedRoles.join(", ") : "General Network";

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Contacted":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Interview":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Selected":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "On Hold":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
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
      <tr className="hover:bg-slate-50 transition border-b border-slate-100 text-sm">
        {/* Name */}
        <td className="px-6 py-4 whitespace-nowrap">
          <button
            onClick={() => setShowDetailsModal(true)}
            className="text-left font-semibold text-slate-900 hover:text-brand-primary hover:underline focus:outline-none transition"
            title="Click to view all details"
          >
            {candidate.fullName}
          </button>
        </td>

        {/* Applied Role */}
        <td className="px-6 py-4 whitespace-nowrap">
          {appliedRoles.length > 0 ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {roleText}
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200">
              General Network
            </span>
          )}
        </td>

        {/* Phone */}
        <td className="px-6 py-4 whitespace-nowrap text-slate-700 font-mono">
          {candidate.phone}
        </td>

        {/* Email */}
        <td className="px-6 py-4 whitespace-nowrap text-slate-700">
          {candidate.email}
        </td>

        {/* Qualification */}
        <td className="px-6 py-4 whitespace-nowrap text-slate-700">
          {candidate.qualification}
        </td>

        {/* Experience */}
        <td className="px-6 py-4 whitespace-nowrap text-slate-700">
          {candidate.experience}
        </td>

        {/* Joining Timeline */}
        <td className="px-6 py-4 whitespace-nowrap text-slate-700">
          {candidate.joiningTimeline || "N/A"}
        </td>

        {/* Applied Date */}
        <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-mono text-xs">
          {appliedDate}
        </td>

        {/* Tracking ID */}
        <td className="px-6 py-4 whitespace-nowrap">
          {candidate.tracking_id ? (
            <span className="text-xs font-mono font-semibold text-brand-primary bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
              {candidate.tracking_id}
            </span>
          ) : (
            <span className="text-xs text-slate-400">—</span>
          )}
        </td>

        {/* Status */}
        <td className="px-6 py-4 whitespace-nowrap">
          <select
            value={candidate.status || "New"}
            onChange={(e) => onStatusChange(candidate.id, candidate.fullName, candidate.status || "New", e.target.value)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border focus:outline-none cursor-pointer tracking-wider ${getStatusColor(candidate.status || "New")}`}
          >
            {statuses.map((s) => (
              <option key={s} value={s} className="bg-white text-slate-900 font-medium">
                {s}
              </option>
            ))}
          </select>
        </td>

        {/* Actions */}
        <td className="px-6 py-4 whitespace-nowrap text-right text-slate-600 flex items-center justify-end space-x-3">
          {/* Copy WhatsApp / Clipboard Summary */}
          <button
            onClick={handleCopy}
            className={`p-2 rounded-lg border transition ${
              copied 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                : "bg-white text-slate-600 border-slate-200 hover:text-brand-primary hover:bg-slate-50 hover:border-brand-primary"
            }`}
            title="Copy Info Summary"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* View Details Modal Trigger */}
          <button
            onClick={() => setShowDetailsModal(true)}
            className="p-2 rounded-lg border bg-white text-slate-600 border-slate-200 hover:text-brand-primary hover:bg-slate-50 hover:border-brand-primary transition"
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
              className="p-2 rounded-lg border bg-white text-slate-600 border-slate-200 hover:text-brand-primary hover:bg-slate-50 hover:border-brand-primary transition flex items-center justify-center"
              title="Download/View Resume"
            >
              <FileDown className="w-4 h-4" />
            </a>
          ) : (
            <span className="p-2 rounded-lg border bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed" title="No Resume Uploaded">
              <FileDown className="w-4 h-4" />
            </span>
          )}

          {onDeleteCandidate && (
            <button
              onClick={() => onDeleteCandidate(candidate.id)}
              className="p-2 rounded-lg border bg-white text-rose-600 border-slate-200 hover:bg-rose-50 hover:border-rose-200 transition"
              title="Delete Candidate Record"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </td>
      </tr>

      {/* Candidate Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="candidate-modal-title">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-200 pb-5 mb-6">
              <div>
                <h3 id="candidate-modal-title" className="text-2xl font-bold text-slate-900">{candidate.fullName}</h3>
                <p className="text-slate-500 text-xs mt-1 tracking-wider uppercase">Application Details — Applied on {appliedDate}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-slate-500 hover:bg-slate-100 hover:text-slate-900 p-2 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid of Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm mb-8">
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Father's Name</span>
                <span className="text-slate-900 font-medium">{candidate.fatherName || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Date of Birth</span>
                <span className="text-slate-900 font-medium">{candidate.dob || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Phone Number</span>
                <span className="text-slate-700 font-mono font-medium">{candidate.phone || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Alternative Number</span>
                <span className="text-slate-700 font-mono font-medium">{candidate.alternativeNumber || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Email ID</span>
                <span className="text-slate-900 font-medium">{candidate.email || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Gender</span>
                <span className="text-slate-900 font-medium">{candidate.gender || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Marital Status</span>
                <span className="text-slate-900 font-medium">{candidate.maritalStatus || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Aadhar Number</span>
                <span className="text-slate-900 font-medium">{candidate.aadharNumber || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Highest Qualification</span>
                <span className="text-slate-900 font-medium">{candidate.qualification || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Spoken Languages</span>
                <span className="text-slate-900 font-medium">{candidate.languages || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Experience</span>
                <span className="text-slate-900 font-medium">{candidate.experience || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Join Timeline</span>
                <span className="text-slate-900 font-medium">{candidate.joiningTimeline || "N/A"}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Applied Roles / Context</span>
                <div className="mt-1">
                  {appliedRoles.length > 0 ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {roleText}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200">
                      General Network (Apply Now)
                    </span>
                  )}
                </div>
              </div>
              <div className="sm:col-span-2">
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-2">Residential Address with Pincode</span>
                <p className="text-slate-700 font-medium whitespace-pre-line bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm leading-relaxed">
                  {candidate.address || "N/A"}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center border-t border-slate-200 pt-6 gap-4">
              <span className="text-sm text-slate-600">Current Status: <strong className={`ml-2 px-3 py-1 rounded-full text-xs tracking-wider border ${getStatusColor(candidate.status || "New")}`}>{candidate.status || "New"}</strong></span>
              <div className="flex space-x-3 w-full sm:w-auto">
                <button
                  onClick={handleCopy}
                  className={`flex items-center justify-center flex-grow sm:flex-grow-0 text-sm font-bold px-5 py-2.5 rounded-xl border transition ${
                    copied
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-blue-50 text-brand-primary border-blue-200 hover:bg-brand-primary hover:text-white hover:border-brand-primary"
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
                    className="flex items-center justify-center flex-grow sm:flex-grow-0 text-sm btn-primary px-5 py-2.5 shadow-sm"
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
