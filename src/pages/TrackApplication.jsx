import React, { useState } from "react";
import { getCandidateByTrackingId } from "../firebase/firestore";
import { Search, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

const TrackApplication = () => {
  const [trackingId, setTrackingId] = useState("");
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    setLoading(true);
    setError("");
    setCandidate(null);
    try {
      const result = await getCandidateByTrackingId(trackingId.trim().toUpperCase());
      if (result.error) {
        setError(result.error);
      } else if (!result.candidate) {
        setError("No application found with this Tracking ID. Please check and try again.");
      } else {
        setCandidate(result.candidate);
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "New":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "Contacted":
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case "Interview":
        return <AlertCircle className="w-5 h-5 text-purple-500" />;
      case "Selected":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "Rejected":
        return <XCircle className="w-5 h-5 text-rose-500" />;
      case "On Hold":
        return <Clock className="w-5 h-5 text-slate-500" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Track Your Application</h1>
          <p className="mt-4 text-slate-500 text-sm font-light">Enter your Application Tracking ID to check your current status.</p>
        </div>

        <form onSubmit={handleTrack} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Enter Tracking ID (e.g., PLACE-RA-ABCDEF)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition tracking-wider uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-brand-primary hover:bg-blue-600 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-sm transition disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Checking...
              </>
            ) : (
              "Check Status"
            )}
          </button>
        </form>

        {error && (
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-rose-700 text-center font-medium">{error}</p>
          </div>
        )}

        {candidate && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Application Status</p>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(candidate.status)}
                  <span className="text-xl font-extrabold text-slate-900">{candidate.status || "New"}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Tracking ID</p>
                <p className="text-lg font-extrabold text-brand-primary tracking-wider">{candidate.tracking_id}</p>
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Name</p>
                <p className="text-slate-900 font-medium">{candidate.fullName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Email</p>
                <p className="text-slate-900 font-medium">{candidate.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Phone</p>
                <p className="text-slate-900 font-medium font-mono">{candidate.phone}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Qualification</p>
                <p className="text-slate-900 font-medium">{candidate.qualification}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Experience</p>
                <p className="text-slate-900 font-medium">{candidate.experience}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Applied On</p>
                <p className="text-slate-900 font-medium">
                  {candidate.timestamp ? new Date(candidate.timestamp).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
            {candidate.status === "Selected" && (
              <div className="bg-emerald-50 border-t border-emerald-100 px-6 py-4">
                <p className="text-sm text-emerald-800 font-medium">Congratulations! Your profile has been shortlisted. Our team will reach out to you soon with next steps.</p>
              </div>
            )}
            {candidate.status === "Rejected" && (
              <div className="bg-rose-50 border-t border-rose-100 px-6 py-4">
                <p className="text-sm text-rose-800 font-medium">We're sorry, your application was not selected this time. We encourage you to apply for future openings.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackApplication;
