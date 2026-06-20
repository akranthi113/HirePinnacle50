import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { sendCandidateStatusEmail } from "../utils/emailService";
import { exportToCSV } from "../utils/exportCSV";
import AnalyticsCards from "./AnalyticsCards";
import NotificationBadge from "./NotificationBadge";
import CandidateRow from "./CandidateRow";
import { Search, Filter, RefreshCw, Download, CheckCircle, AlertCircle, LayoutGrid } from "lucide-react";

const Dashboard = ({ candidates, contactMessages, refreshData, updateCandidateStatus, deleteContactMessage, deleteCandidateRecord, loading = false }) => {
  const { currentUser, userProfile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [candidatesState, setCandidates] = useState(candidates);
  const [contactMessagesState, setContactMessagesState] = useState(contactMessages);

  // Sync props updates
  useEffect(() => {
    setCandidates(candidates);
  }, [candidates]);

  useEffect(() => {
    setContactMessagesState(contactMessages);
  }, [contactMessages]);  
  
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleStatusChange = async (candidateId, candidateName, oldStatus, newStatus) => {
    if (!currentUser) return;
    
    try {
      // 1. Update Firestore Candidate status + write Audit Log
      const { success, error } = await updateCandidateStatus(
        candidateId,
        candidateName,
        oldStatus,
        newStatus,
        currentUser.id,
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
        const candidate = candidatesState.find((c) => c.id === candidateId);
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

  const handleDeleteCandidate = async (candidateId) => {
    const confirmed = window.confirm("Delete this candidate record? This action cannot be undone.");
    if (!confirmed) return;

    const { success, error } = await deleteCandidateRecord(candidateId);
    if (!success) {
      triggerToast(error || "Unable to delete candidate.", "error");
      return;
    }

    triggerToast("Candidate record deleted.");
    setCandidates((prev) => prev.filter((c) => c.id !== candidateId));
  };

  const handleDeleteContact = async (messageId) => {
    const confirmed = window.confirm("Delete this contact inquiry? This action cannot be undone.");
    if (!confirmed) return;

    console.log('Attempting to delete contact message with id:', messageId);
    const { success, error } = await deleteContactMessage(messageId);
    if (!success) {
      console.error('Delete contact message failed:', error);
      triggerToast(error || "Unable to delete contact message.", "error");
      return;
    }

    triggerToast("Contact inquiry deleted.");
    setContactMessagesState((prev) => prev.filter((msg) => msg.id !== messageId));
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
  const uniqueQualifications = Array.from(new Set(candidatesState.map((c) => c.qualification).filter(Boolean)));
  const uniqueJoiningTimelines = Array.from(new Set(candidatesState.map((c) => c.joiningTimeline).filter(Boolean)));

  // Filter & Search Candidates
  const filteredCandidates = candidatesState.filter((cand) => {
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
  const newCandidatesCount = candidatesState.filter((c) => c.status === "New" || !c.status).length;

  return (
    <div className="py-4">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center p-4 rounded-xl shadow-2xl border transition-all duration-300 backdrop-blur-md ${
          toast.type === "error" 
            ? "bg-rose-900/80 border-rose-500/50 text-rose-200" 
            : "bg-emerald-900/80 border-emerald-500/50 text-emerald-200"
        }`}>
          {toast.type === "error" ? (
            <AlertCircle className="w-5 h-5 text-rose-400 mr-3 flex-shrink-0" />
          ) : (
            <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0" />
          )}
          <span className="text-sm font-semibold tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Recruiter Dashboard</h1>
          <p className="text-slate-400 text-sm mt-2 font-light">
            Welcome back, <span className="font-semibold text-white">{userProfile?.displayName || currentUser?.email}</span>
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-6 sm:mt-0">
          <NotificationBadge count={newCandidatesCount} />
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="glassmorphism border border-white/10 text-slate-300 hover:text-brand-primary hover:bg-white/10 p-3 rounded-xl shadow-lg transition-all disabled:opacity-50"
            title="Refresh database records"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      {!loading && <AnalyticsCards candidates={candidatesState} />}

      {/* Search and Filter Panel */}
      <div className="glassmorphism rounded-2xl border border-white/10 p-6 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Real-time search */}
          <div className="md:col-span-4 relative group">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 group-focus-within:text-brand-primary transition-colors pointer-events-none">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-brand-darker/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
            />
          </div>

          {/* Qualification Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedQualification}
              onChange={(e) => setSelectedQualification(e.target.value)}
              className="w-full bg-brand-darker/50 border border-white/10 text-white text-sm rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary block p-3 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-brand-dark text-white">Qualification</option>
              {uniqueQualifications.map((q) => (
                <option key={q} value={q} className="bg-brand-dark text-white">{q}</option>
              ))}
            </select>
          </div>

          {/* Experience Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full bg-brand-darker/50 border border-white/10 text-white text-sm rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary block p-3 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-brand-dark text-white">Experience</option>
              {["Fresher", "1 Year", "2 Years", "3 Years", "4 Years", "5+ Years"].map((exp) => (
                <option key={exp} value={exp} className="bg-brand-dark text-white">{exp}</option>
              ))}
            </select>
          </div>

          {/* Joining Timeline Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedJoiningTimeline}
              onChange={(e) => setSelectedJoiningTimeline(e.target.value)}
              className="w-full bg-brand-darker/50 border border-white/10 text-white text-sm rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary block p-3 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-brand-dark text-white">Join Timeline</option>
              {uniqueJoiningTimelines.map((jt) => (
                <option key={jt} value={jt} className="bg-brand-dark text-white">{jt}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-brand-darker/50 border border-white/10 text-white text-sm rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary block p-3 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-brand-dark text-white">Status</option>
              {["New", "Contacted", "Interview", "Selected", "Rejected", "On Hold"].map((st) => (
                <option key={st} value={st} className="bg-brand-dark text-white">{st}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sorting & Export controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-5 border-t border-white/10 gap-5">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Sort By:</span>
            <button
              onClick={() => setSortOrder(sortOrder === "latest" ? "oldest" : "latest")}
              className="text-xs bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg font-semibold transition border border-white/10 tracking-wide"
            >
              {sortOrder === "latest" ? "Latest First" : "Oldest First"}
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-400 font-bold text-xs px-5 py-2.5 rounded-lg shadow-lg hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition"
          >
            <Download className="w-4 h-4 mr-2" />
            Bulk CSV Export ({filteredCandidates.length})
          </button>
        </div>
      </div>

      {/* Candidate Records Table */}
      <div className="glassmorphism rounded-2xl border border-white/10 overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5 text-left text-xs font-bold text-brand-primary uppercase tracking-wider select-none">
              <tr>
                <th className="px-6 py-5">Candidate Name</th>
                <th className="px-6 py-5">Phone</th>
                <th className="px-6 py-5">Email</th>
                <th className="px-6 py-5">Qual.</th>
                <th className="px-6 py-5">Exp.</th>
                <th className="px-6 py-5">Join Timeline</th>
                <th className="px-6 py-5">Applied</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-white/5">
              {loading ? (
                // SKELETON LOADER
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded-full w-28"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded-full w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded-full w-36"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded-full w-12"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded-full w-12"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded-full w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-3 bg-white/10 rounded-full w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-7 bg-white/10 rounded-full w-20"></div></td>
                    <td className="px-6 py-4 text-right flex justify-end space-x-2"><div className="h-7 bg-white/10 rounded-md w-8"></div><div className="h-7 bg-white/10 rounded-md w-8"></div></td>
                  </tr>
                ))
              ) : sortedCandidates.length === 0 ? (
                // EMPTY STATE
                <tr>
                  <td colSpan="9" className="px-6 py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center">
                      <LayoutGrid className="w-12 h-12 text-slate-500 mb-4 opacity-50" />
                      <p className="text-lg font-bold text-white">No applicants found</p>
                      <p className="text-sm text-slate-500 mt-2 font-light">Try resetting your filters or search criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedCandidates.map((cand) => (
                  <CandidateRow
                    key={cand.id}
                    candidate={cand}
                    onStatusChange={handleStatusChange}
                    onDeleteCandidate={handleDeleteCandidate}
                    userProfile={userProfile}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact Form Inquiries */}
      <div className="glassmorphism rounded-2xl border border-white/10 overflow-hidden mb-10">
        <div className="px-8 py-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Contact Inquiries</h2>
            <p className="text-sm text-slate-400 mt-1 font-light">Messages submitted through the public contact form.</p>
          </div>
          <span className="text-xs font-semibold text-brand-accent tracking-widest uppercase bg-brand-accent/10 border border-brand-accent/20 px-3 py-1.5 rounded-full">{contactMessagesState.length} message{contactMessagesState.length === 1 ? "" : "s"}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5 text-left text-xs font-bold text-brand-primary uppercase tracking-wider select-none">
              <tr>
                <th className="px-8 py-5">Name</th>
                <th className="px-8 py-5">Email</th>
                <th className="px-8 py-5">Phone</th>
                <th className="px-8 py-5">Message</th>
                <th className="px-8 py-5">Submitted</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {contactMessagesState.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-16 text-center text-slate-500 font-light">
                    No contact inquiries found.
                  </td>
                </tr>
              ) : (
                contactMessagesState.map((message) => (
                  <tr key={message.id || message.timestamp} className="hover:bg-white/5 transition border-b border-white/5">
                    <td className="px-8 py-5 text-sm font-semibold text-white">{message.name}</td>
                    <td className="px-8 py-5 text-sm text-slate-300">{message.email}</td>
                    <td className="px-8 py-5 text-sm text-slate-400 font-mono">{message.phone || "-"}</td>
                    <td className="px-8 py-5 text-sm text-slate-300 max-w-md break-words font-light leading-relaxed">{message.message}</td>
                    <td className="px-8 py-5 text-sm text-slate-500">{message.timestamp ? new Date(message.timestamp).toLocaleString() : "-"}</td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => handleDeleteContact(message.id)}
                        className="inline-flex items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition"
                      >
                        Delete
                      </button>
                    </td>
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
