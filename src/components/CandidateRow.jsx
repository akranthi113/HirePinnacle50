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
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Contacted":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Interview":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "Selected":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Rejected":
        return "bg-rose-50 text-rose-700 border-rose-100";
      case "On Hold":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
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
            className="text-left font-semibold text-navy-800 hover:text-blue-600 hover:underline focus:outline-none transition"
            title="Click to view all details"
          >
            {candidate.fullName}
          </button>
        </td>

        {/* Phone */}
        <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-mono">
          {candidate.phone}
        </td>

        {/* Email */}
        <td className="px-6 py-4 whitespace-nowrap text-slate-600">
          {candidate.email}
        </td>

        {/* Qualification */}
        <td className="px-6 py-4 whitespace-nowrap text-slate-600">
          {candidate.qualification}
        </td>

        {/* Experience */}
        <td className="px-6 py-4 whitespace-nowrap text-slate-600">
          {candidate.experience}
        </td>

        {/* Joining Timeline */}
        <td className="px-6 py-4 whitespace-nowrap text-slate-600">
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
            className={`text-xs font-semibold px-2.5 py-1.5 rounded-full border focus:outline-none cursor-pointer ${getStatusColor(candidate.status || "New")}`}
          >
            {statuses.map((s) => (
              <option key={s} value={s} className="bg-white text-slate-800 font-medium">
                {s}
              </option>
            ))}
          </select>
        </td>

        {/* Actions */}
        <td className="px-6 py-4 whitespace-nowrap text-right text-slate-500 flex items-center justify-end space-x-2.5">
          {/* Copy WhatsApp / Clipboard Summary */}
          <button
            onClick={handleCopy}
            className={`p-1.5 rounded border transition ${
              copied 
                ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                : "bg-white text-slate-500 border-slate-200 hover:text-navy-800 hover:bg-slate-50"
            }`}
            title="Copy Info Summary"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* View Details Modal Trigger */}
          <button
            onClick={() => setShowDetailsModal(true)}
            className="p-1.5 rounded border bg-white text-slate-500 border-slate-200 hover:text-blue-600 hover:bg-blue-50 transition"
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
              className="p-1.5 rounded border bg-white text-slate-500 border-slate-200 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition flex items-center justify-center"
              title="Download/View Resume"
            >
              <FileDown className="w-4 h-4" />
            </a>
          ) : (
            <span className="p-1.5 rounded border bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed" title="No Resume Uploaded">
              <FileDown className="w-4 h-4" />
            </span>
          )}

          {onDeleteCandidate && (
            <button
              onClick={() => onDeleteCandidate(candidate.id)}
              className="p-1.5 rounded border bg-white text-rose-500 border-rose-200 hover:text-rose-700 hover:bg-rose-50 transition"
              title="Delete Candidate Record"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </td>
      </tr>

      {/* Candidate Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-slate-100 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="text-xl font-bold text-navy-800">{candidate.fullName}</h3>
                <p className="text-slate-400 text-xs mt-0.5">Application Details — Applied on {appliedDate}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-slate-400 hover:bg-slate-100 hover:text-slate-600 p-1.5 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid of Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
              <div>
                <span className="block text-xxs font-bold text-slate-400 uppercase">Father's Name</span>
                <span className="text-slate-700 font-semibold">{candidate.fatherName || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xxs font-bold text-slate-400 uppercase">Date of Birth</span>
                <span className="text-slate-700 font-semibold">{candidate.dob || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xxs font-bold text-slate-400 uppercase">Phone Number</span>
                <span className="text-slate-700 font-mono font-semibold">{candidate.phone || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xxs font-bold text-slate-400 uppercase">Alternative Number</span>
                <span className="text-slate-700 font-mono font-semibold">{candidate.alternativeNumber || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xxs font-bold text-slate-400 uppercase">Email ID</span>
                <span className="text-slate-700 font-semibold">{candidate.email || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xxs font-bold text-slate-400 uppercase">Gender</span>
                <span className="text-slate-700 font-semibold">{candidate.gender || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xxs font-bold text-slate-400 uppercase">Marital Status</span>
                <span className="text-slate-700 font-semibold">{candidate.maritalStatus || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xxs font-bold text-slate-400 uppercase">Aadhar Number</span>
                <span className="text-slate-700 font-semibold">{candidate.aadharNumber || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xxs font-bold text-slate-400 uppercase">Highest Qualification</span>
                <span className="text-slate-700 font-semibold">{candidate.qualification || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xxs font-bold text-slate-400 uppercase">Spoken Languages</span>
                <span className="text-slate-700 font-semibold">{candidate.languages || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xxs font-bold text-slate-400 uppercase">Experience</span>
                <span className="text-slate-700 font-semibold">{candidate.experience || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xxs font-bold text-slate-400 uppercase">How often will you be able to join?</span>
                <span className="text-slate-700 font-semibold">{candidate.joiningTimeline || "N/A"}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="block text-xxs font-bold text-slate-400 uppercase">Residential Address with Pincode</span>
                <p className="text-slate-700 font-semibold whitespace-pre-line bg-slate-50 border border-slate-100 p-3 rounded-lg mt-1 text-xs leading-relaxed">
                  {candidate.address || "N/A"}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center border-t border-slate-100 pt-4 gap-3">
              <span className="text-xs text-slate-400">Current Status: <strong>{candidate.status || "New"}</strong></span>
              <div className="flex space-x-3 w-full sm:w-auto">
                <button
                  onClick={handleCopy}
                  className={`flex items-center justify-center flex-grow sm:flex-grow-0 text-xs font-bold px-4 py-2.5 rounded-lg border transition ${
                    copied
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100/50"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1.5" />
                      Copy Info Summary
                    </>
                  )}
                </button>
                {candidate.resumeURL && (
                  <a
                    href={candidate.resumeURL}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center flex-grow sm:flex-grow-0 text-xs bg-navy-800 hover:bg-navy-900 text-white font-bold px-4 py-2.5 rounded-lg transition"
                  >
                    <FileDown className="w-3.5 h-3.5 mr-1.5" />
                    Download Resume
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
