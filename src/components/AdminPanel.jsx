import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  getRecruitersList, 
  updateRecruiterStatus, 
  deleteRecruiterRecord, 
  getAuditLogs, 
  getCandidates, 
  deleteCandidateRecord,
  getContactMessages,
  deleteContactMessage
} from "../firebase/firestore";
import { exportToCSV } from "../utils/exportCSV";
import { 
  UserPlus, 
  UserX, 
  Trash2, 
  Download, 
  Filter, 
  AlertCircle, 
  CheckCircle, 
  ShieldAlert, 
  FileText,
  Clock
} from "lucide-react";

const AdminPanel = () => {
  const { registerRecruiter } = useAuth();
  
  // Data States
  const [recruiters, setRecruiters] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactMessages, setContactMessages] = useState([]);

  // Form States for New Recruiter
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [submittingRecruiter, setSubmittingRecruiter] = useState(false);

  // Filters State
  const [selectedRecruiterEmail, setSelectedRecruiterEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Notifications
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const loadAdminData = async () => {
    setLoading(true);
    
    // Fetch recruiters, audit logs, and candidates
    const [recRes, logRes, candRes, contactRes] = await Promise.all([
      getRecruitersList(),
      getAuditLogs(),
      getCandidates(),
      getContactMessages()
    ]);

    if (recRes.error) triggerToast(recRes.error, "error");
    else setRecruiters(recRes.recruiters);

    if (logRes.error) triggerToast(logRes.error, "error");
    else setAuditLogs(logRes.logs);

    if (candRes.error) triggerToast(candRes.error, "error");
    else setCandidates(candRes.candidates);

    if (contactRes.error) triggerToast(contactRes.error, "error");
    else setContactMessages(contactRes.messages);

    setLoading(false);
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Handle adding recruiter
  const handleAddRecruiter = async (e) => {
    e.preventDefault();
    if (!newEmail || !newPassword || !newName) {
      triggerToast("Please fill in all recruiter fields.", "error");
      return;
    }

    setSubmittingRecruiter(true);
    try {
      const { uid, error } = await registerRecruiter(
        newEmail.trim(), 
        newPassword, 
        newName.trim()
      );

      if (error) {
        throw new Error(error);
      }

      triggerToast(`Recruiter account for ${newName} created successfully!`);
      setNewEmail("");
      setNewPassword("");
      setNewName("");
      
      // Refresh list
      loadAdminData();
    } catch (err) {
      triggerToast(err.message || "Failed to create recruiter", "error");
    } finally {
      setSubmittingRecruiter(false);
    }
  };

  // Toggle Recruiter Activation Status (Active <-> Inactive)
  const handleToggleRecruiterStatus = async (uid, currentStatus) => {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const { success, error } = await updateRecruiterStatus(uid, nextStatus);
      if (!success) throw new Error(error);
      
      setRecruiters((prev) => 
        prev.map((r) => (r.id === uid ? { ...r, status: nextStatus } : r))
      );
      triggerToast(`Recruiter account is now ${nextStatus}.`);
    } catch (err) {
      triggerToast(err.message || "Failed to toggle status", "error");
    }
  };

  // Delete recruiter account record
  const handleDeleteRecruiter = async (uid, name) => {
    if (!window.confirm(`Are you sure you want to remove recruiter account for ${name}?`)) return;

    try {
      const { success, error } = await deleteRecruiterRecord(uid);
      if (!success) throw new Error(error);

      setRecruiters((prev) => prev.filter((r) => r.id !== uid));
      triggerToast(`Recruiter account deleted successfully.`);
      loadAdminData();
    } catch (err) {
      triggerToast(err.message || "Failed to delete recruiter", "error");
    }
  };

  // Delete candidate record (Admin only)
  const handleDeleteCandidate = async (candidateId, name) => {
    if (!window.confirm(`Permanently delete all details and file links for candidate: ${name}?`)) return;

    try {
      const { success, error } = await deleteCandidateRecord(candidateId);
      if (!success) throw new Error(error);

      setCandidates((prev) => prev.filter((c) => c.id !== candidateId));
      triggerToast(`Candidate record deleted.`);
      loadAdminData();
    } catch (err) {
      triggerToast(err.message || "Failed to delete candidate", "error");
    }
  };

  const handleDeleteContact = async (messageId) => {
    const confirmed = window.confirm("Delete this contact inquiry? This action cannot be undone.");
    if (!confirmed) return;

    try {
      const { success, error } = await deleteContactMessage(messageId);
      if (!success) {
        triggerToast(error || "Unable to delete contact message.", "error");
        return;
      }

      // Remove the deleted message from state for immediate UI update
      setContactMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      triggerToast("Contact inquiry deleted.");
    } catch (err) {
      triggerToast(err.message || "Failed to delete contact inquiry", "error");
    }
  };

  // Export all candidates
  const handleExportAllCandidates = () => {
    if (candidates.length === 0) {
      triggerToast("No records to export", "error");
      return;
    }
    exportToCSV(candidates, `all_candidates_master_${Date.now()}.csv`);
    triggerToast(`Exported all ${candidates.length} candidate profiles!`);
  };

  // Recruiter Performance Calculations
  const calculatedPerformance = recruiters.map((rec) => {
    const recLogs = auditLogs.filter((log) => log.recruiterUID === rec.uid);
    const handledCandidates = new Set(recLogs.map((log) => log.candidateId)).size;
    const interviews = recLogs.filter((log) => log.newStatus === "Interview").length;
    const selected = recLogs.filter((log) => log.newStatus === "Selected").length;
    
    return {
      ...rec,
      handledCandidates,
      interviews,
      selected
    };
  });

  // Filter Audit Logs
  const filteredAuditLogs = auditLogs.filter((log) => {
    const matchesRecruiter = selectedRecruiterEmail ? log.recruiterEmail === selectedRecruiterEmail : true;
    
    let matchesDate = true;
    const logDate = log.timestamp?.toDate ? log.timestamp.toDate() : new Date(log.timestamp);
    
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      matchesDate = matchesDate && logDate >= start;
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      matchesDate = matchesDate && logDate <= end;
    }

    return matchesRecruiter && matchesDate;
  });

  // Sort candidates for Admin viewing
  const sortedCandidates = [...candidates];

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

      {/* Admin Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-800 flex items-center tracking-tight">
            <ShieldAlert className="w-7 h-7 text-blue-600 mr-2" />
            System Administration Panel
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage recruiters, performance summaries, and access complete system logs.</p>
        </div>
        <button
          onClick={handleExportAllCandidates}
          className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition mt-4 sm:mt-0"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Master CSV Export ({candidates.length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Recruiter Creation Form */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-100 p-6 shadow-xs h-fit">
          <h3 className="text-lg font-bold text-navy-800 mb-4 flex items-center">
            <UserPlus className="w-5 h-5 text-blue-600 mr-2" />
            Register Recruiter
          </h3>
          <form onSubmit={handleAddRecruiter} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Sarah Connor"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="recruiter@placeio.com"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Temp Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submittingRecruiter}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-lg shadow-sm transition disabled:opacity-50 flex items-center justify-center"
            >
              {submittingRecruiter ? "Registering User..." : "Create Account"}
            </button>
          </form>
        </div>

        {/* Recruiter Performance / List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-6 shadow-xs">
          <h3 className="text-lg font-bold text-navy-800 mb-4">Recruiter Directory & Metrics</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50 text-left text-xxs font-bold text-slate-500 uppercase tracking-wider select-none">
                <tr>
                  <th className="px-4 py-3">Recruiter Name</th>
                  <th className="px-4 py-3 text-center">Handled</th>
                  <th className="px-4 py-3 text-center">Interviews</th>
                  <th className="px-4 py-3 text-center">Selected</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-slate-400">Loading directory...</td>
                  </tr>
                ) : calculatedPerformance.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-slate-400">No recruiters registered.</td>
                  </tr>
                ) : (
                  calculatedPerformance.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3.5 font-semibold text-navy-800">
                        <div>
                          <p>{rec.displayName || "No Name"}</p>
                          <p className="text-xxs text-slate-400 font-normal mt-0.5">{rec.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold text-slate-600">{rec.handledCandidates}</td>
                      <td className="px-4 py-3.5 text-center font-bold text-purple-600">{rec.interviews}</td>
                      <td className="px-4 py-3.5 text-center font-bold text-emerald-600">{rec.selected}</td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-xxs font-bold border ${
                          rec.status === "active" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                            : "bg-rose-50 text-rose-700 border-rose-100"
                        }`}>
                          {rec.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleToggleRecruiterStatus(rec.id, rec.status)}
                          className={`p-1 rounded border text-xs font-semibold ${
                            rec.status === "active" 
                              ? "bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700" 
                              : "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700"
                          }`}
                          title={rec.status === "active" ? "Deactivate Recruiter" : "Activate Recruiter"}
                        >
                          <UserX className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRecruiter(rec.id, rec.displayName)}
                          className="p-1 rounded border bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700"
                          title="Delete Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Master Candidate Administration (Delete/Archive records) */}
      <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-xs mb-8">
        <h3 className="text-lg font-bold text-navy-800 mb-4">Master Candidate Administration</h3>
        <p className="text-xs text-slate-400 mb-4">Admins can permanently purge candidate database profiles and documents from this grid.</p>
        <div className="overflow-x-auto max-h-80">
          <table className="min-w-full divide-y divide-slate-100 text-xs">
            <thead className="bg-slate-50 text-left text-xxs font-bold text-slate-500 uppercase tracking-wider select-none sticky top-0">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Qualification</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-400">Loading candidates...</td>
                </tr>
              ) : candidates.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-400">No candidates found in database.</td>
                </tr>
              ) : (
                candidates.map((cand) => (
                  <tr key={cand.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-semibold text-navy-800">{cand.fullName}</td>
                    <td className="px-4 py-3 font-mono">{cand.phone}</td>
                    <td className="px-4 py-3">{cand.email}</td>
                    <td className="px-4 py-3">{cand.qualification}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold px-2 py-0.5 rounded-full border bg-slate-50 text-slate-600 border-slate-200">
                        {cand.status || "New"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteCandidate(cand.id, cand.fullName)}
                        className="p-1 rounded border bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700"
                        title="Permanently Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logs Filter Panel & Logs List */}
      <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-xs">
        <h3 className="text-lg font-bold text-navy-800 mb-4 flex items-center">
          <Clock className="w-5 h-5 text-blue-600 mr-2" />
          System Audit Logs
        </h3>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div>
            <label className="block text-xxs font-bold text-slate-500 uppercase mb-1">Filter Recruiter</label>
            <select
              value={selectedRecruiterEmail}
              onChange={(e) => setSelectedRecruiterEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
            >
              <option value="">All Recruiters</option>
              {recruiters.map((r) => (
                <option key={r.id} value={r.email}>{r.displayName} ({r.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xxs font-bold text-slate-500 uppercase mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
            />
          </div>
          <div>
            <label className="block text-xxs font-bold text-slate-500 uppercase mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
            />
          </div>
        </div>

        {/* Table of logs */}
        <div className="overflow-x-auto max-h-80">
          <table className="min-w-full divide-y divide-slate-100 text-xs">
            <thead className="bg-slate-50 text-left text-xxs font-bold text-slate-500 uppercase tracking-wider select-none sticky top-0">
              <tr>
                <th className="px-4 py-3">Recruiter Email</th>
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3 text-center">Transition</th>
                <th className="px-4 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-slate-400">Loading audit logs...</td>
                </tr>
              ) : filteredAuditLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-slate-400">No matching audit logs found.</td>
                </tr>
              ) : (
                filteredAuditLogs.map((log) => {
                  let formattedDate = "";
                  if (log.timestamp) {
                    const d = log.timestamp.toDate ? log.timestamp.toDate() : new Date(log.timestamp);
                    formattedDate = d.toLocaleString();
                  }
                  
                  return (
                    <tr key={log.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3 font-semibold text-slate-800">{log.recruiterEmail}</td>
                      <td className="px-4 py-3">{log.candidateName}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-semibold text-rose-600">{log.oldStatus}</span>
                        <span className="text-slate-400 mx-2">→</span>
                        <span className="font-semibold text-emerald-600">{log.newStatus}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xxs text-slate-400">{formattedDate}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

{/* Contact Messages Administration */}
<div className="bg-white rounded-xl border border-slate-100 p-6 shadow-xs mt-8">
  <h3 className="text-lg font-bold text-navy-800 mb-4">Contact Messages</h3>
  <div className="overflow-x-auto max-h-80">
    <table className="min-w-full divide-y divide-slate-100 text-xs">
      <thead className="bg-slate-50 text-left text-xxs font-bold text-slate-500 uppercase tracking-wider select-none sticky top-0">
        <tr>
          <th className="px-4 py-3">Name</th>
          <th className="px-4 py-3">Email</th>
          <th className="px-4 py-3">Message</th>
          <th className="px-4 py-3 text-right">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 text-slate-700">
        {loading ? (
          <tr>
            <td colSpan="4" className="py-6 text-center text-slate-400">Loading messages...</td>
          </tr>
        ) : contactMessages.length === 0 ? (
          <tr>
            <td colSpan="4" className="py-6 text-center text-slate-400">No contact messages.</td>
          </tr>
        ) : (
          contactMessages.map((msg) => (
            <tr key={msg.id} className="hover:bg-slate-50 transition">
              <td className="px-4 py-3 font-semibold text-navy-800">{msg.name}</td>
              <td className="px-4 py-3">{msg.email}</td>
              <td className="px-4 py-3">{msg.message}</td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => handleDeleteContact(msg.id)}
                  className="p-1 rounded border bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700"
                  title="Delete Contact Message"
                >
                  <Trash2 className="w-3.5 h-3.5" />
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

export default AdminPanel;
