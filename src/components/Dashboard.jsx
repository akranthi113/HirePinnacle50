import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getCandidates, getContactMessages, updateCandidateStatus } from "../firebase/firestore";
import { sendCandidateStatusEmail } from "../utils/emailService";
import { exportToCSV } from "../utils/exportCSV";
import AnalyticsCards from "./AnalyticsCards";
import NotificationBadge from "./NotificationBadge";
import CandidateRow from "./CandidateRow";
import { Search, Filter, RefreshCw, Download, CheckCircle, AlertCircle, LayoutGrid } from "lucide-react";

const Dashboard = () => {
  const { currentUser, userProfile } = useAuth();
  
  const [candidates, setCandidates] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQualification, setSelectedQualification] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedJoiningTimeline, setSelectedJoiningTimeline] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  
  // Sort State (defaults to latest first)
  const [sortOrder, setSortOrder] = useState("latest");

  // Notifications
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const loadCandidatesData = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    const [candidateResult, contactResult] = await Promise.all([getCandidates(), getContactMessages()]);

    if (candidateResult.error) {
      triggerToast(candidateResult.error, "error");
    } else {
      setCandidates(candidateResult.candidates);
    }

    if (contactResult.error) {
      triggerToast(contactResult.error, "error");
    } else {
      setContactMessages(contactResult.messages);
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadCandidatesData();
  }, []);

  const handleStatusChange = async (candidateId, candidateName, oldStatus, newStatus) => {
    if (!currentUser) return;
    
    try {
      // 1. Update Firestore Candidate status + write Audit Log
      const { success, error } = await updateCandidateStatus(
        candidateId,
        candidateName,
        oldStatus,
        newStatus,
        currentUser.uid,
        currentUser.email
      );

      if (!success) {
        throw new Error(error);
      }

      // Update local candidates state
      setCandidates((prev) => 
        prev.map((c) => (c.id === candidateId ? { ...c, status: newStatus } : c))
      );
      
      triggerToast(`Status updated to ${newStatus} for ${candidateName}`);

      // 2. Dispatch status change email if newStatus is Interview or Selected
      if (newStatus === "Interview" || newStatus === "Selected") {
        const candidate = candidates.find((c) => c.id === candidateId);
        if (candidate && candidate.email) {
          // Trigger async emailing
          sendCandidateStatusEmail(candidate.email, candidate.fullName, newStatus)
            .then((res) => {
              if (res.isMock) {
                triggerToast(`Email simulated to ${candidate.fullName}`, "success");
              } else if (res.success) {
                triggerToast(`Email dispatched to ${candidate.fullName}`, "success");
              }
            })
            .catch((err) => console.error(err));
        }
      }
    } catch (err) {
      triggerToast(err.message || "Failed to update status", "error");
    }
  };

  const handleExportCSV = () => {
    if (filteredCandidates.length === 0) {
      triggerToast("No records to export", "error");
      return;
    }
    exportToCSV(filteredCandidates, `candidates_export_${Date.now()}.csv`);
    triggerToast(`Exported ${filteredCandidates.length} candidate profiles!`);
  };

  // Extract unique locations and qualifications for filters
  const uniqueQualifications = Array.from(new Set(candidates.map((c) => c.qualification).filter(Boolean)));
  const uniqueJoiningTimelines = Array.from(new Set(candidates.map((c) => c.joiningTimeline).filter(Boolean)));

  // Filter & Search Candidates
  const filteredCandidates = candidates.filter((cand) => {
    const nameMatch = cand.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const phoneMatch = cand.phone?.includes(searchTerm);
    const emailMatch = cand.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = nameMatch || phoneMatch || emailMatch;

    const matchesQual = selectedQualification ? cand.qualification === selectedQualification : true;
    const matchesExp = selectedExperience ? cand.experience === selectedExperience : true;
    const matchesLoc = selectedJoiningTimeline ? cand.joiningTimeline === selectedJoiningTimeline : true;
    const matchesStatus = selectedStatus ? cand.status === selectedStatus : true;

    return matchesSearch && matchesQual && matchesExp && matchesLoc && matchesStatus;
  });

  // Sort Candidates
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || 0);
    const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp || 0);
    
    if (sortOrder === "latest") {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  // New unread candidates count (status === "New")
  const newCandidatesCount = candidates.filter((c) => c.status === "New" || !c.status).length;

  return (
    <div className="py-8">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center p-4 rounded-xl shadow-lg border transition-all duration-300 ${
          toast.type === "error" 
            ? "bg-rose-50 border-rose-100 text-rose-800" 
            : "bg-emerald-50 border-emerald-100 text-emerald-800"
        }`}>
          {toast.type === "error" ? (
            <AlertCircle className="w-5 h-5 text-rose-500 mr-2 flex-shrink-0" />
          ) : (
            <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" />
          )}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-800 tracking-tight">Recruiter Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Welcome back, <span className="font-semibold text-slate-800">{userProfile?.displayName || currentUser?.email}</span>
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <NotificationBadge count={newCandidatesCount} />
          
          <button
            onClick={() => loadCandidatesData(true)}
            disabled={refreshing}
            className="bg-white border border-slate-200 text-slate-600 hover:text-navy-800 hover:bg-slate-50 p-2.5 rounded-lg shadow-sm transition disabled:opacity-50"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      {!loading && <AnalyticsCards candidates={candidates} />}

      {/* Search and Filter Panel */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Real-time search */}
          <div className="md:col-span-4 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Qualification Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedQualification}
              onChange={(e) => setSelectedQualification(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition"
            >
              <option value="">Qualification</option>
              {uniqueQualifications.map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </div>

          {/* Experience Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition"
            >
              <option value="">Experience</option>
              {["Fresher", "1 Year", "2 Years", "3 Years", "4 Years", "5+ Years"].map((exp) => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </div>

          {/* Joining Timeline Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedJoiningTimeline}
              onChange={(e) => setSelectedJoiningTimeline(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition"
            >
              <option value="">Joining Timeline</option>
              {uniqueJoiningTimelines.map((jt) => (
                <option key={jt} value={jt}>{jt}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition"
            >
              <option value="">Status</option>
              {["New", "Contacted", "Interview", "Selected", "Rejected", "On Hold"].map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sorting & Export controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-5 pt-4 border-t border-slate-100 gap-4">
          <div className="flex items-center space-x-2.5">
            <span className="text-xs font-semibold text-slate-500">Sort:</span>
            <button
              onClick={() => setSortOrder(sortOrder === "latest" ? "oldest" : "latest")}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-semibold transition"
            >
              {sortOrder === "latest" ? "Latest First" : "Oldest First"}
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-xs hover:shadow transition"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Bulk CSV Export ({filteredCandidates.length})
          </button>
        </div>
      </div>

      {/* Candidate Records Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50 text-left text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
              <tr>
                <th className="px-6 py-4">Candidate Name</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Qual.</th>
                <th className="px-6 py-4">Exp.</th>
                <th className="px-6 py-4">Join Timeline</th>
                <th className="px-6 py-4">Applied</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                // SKELETON LOADER
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded-full w-28"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded-full w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded-full w-36"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded-full w-12"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded-full w-12"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded-full w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-3 bg-slate-200 rounded-full w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-7 bg-slate-200 rounded-full w-20"></div></td>
                    <td className="px-6 py-4 text-right flex justify-end space-x-2"><div className="h-7 bg-slate-200 rounded-md w-7"></div><div className="h-7 bg-slate-200 rounded-md w-7"></div></td>
                  </tr>
                ))
              ) : sortedCandidates.length === 0 ? (
                // EMPTY STATE
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <LayoutGrid className="w-12 h-12 text-slate-300 mb-3" />
                      <p className="text-base font-bold text-navy-800">No applicants found</p>
                      <p className="text-xs text-slate-400 mt-1">Try resetting your filters or search criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedCandidates.map((cand) => (
                  <CandidateRow
                    key={cand.id}
                    candidate={cand}
                    onStatusChange={handleStatusChange}
                    userProfile={userProfile}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact Form Inquiries */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden mt-8">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-navy-800">Contact Form Inquiries</h2>
            <p className="text-sm text-slate-500">Messages submitted through the public contact form.</p>
          </div>
          <span className="text-xs font-semibold text-slate-600">{contactMessages.length} message{contactMessages.length === 1 ? "" : "s"}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50 text-left text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contactMessages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No contact inquiries found.
                  </td>
                </tr>
              ) : (
                contactMessages.map((message) => (
                  <tr key={message.id || message.timestamp}>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{message.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{message.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-mono">{message.phone || "-"}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-md break-words">{message.message}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{message.timestamp ? new Date(message.timestamp).toLocaleString() : "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
