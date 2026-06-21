import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardComponent from "../components/Dashboard";
import RecruiterJobsSection from "../components/RecruiterJobsSection";
import { getCandidates, getContactMessages, updateCandidateStatus, deleteContactMessage, deleteCandidateRecord } from "../firebase/firestore";
import { fetchApplicationsByRecruiter } from "../firebase/jobs";
import { AlertCircle } from "lucide-react";

const Dashboard = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [applications, setApplications] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  // Load candidates, contact messages, and recruiter applications
  const loadCandidatesData = async (silent = false) => {
    if (!silent) setDataLoading(true);
    setDashboardError("");

    const [candidateResult, contactResult, applicationResult] = await Promise.all([
      getCandidates(),
      getContactMessages(),
      currentUser?.id ? fetchApplicationsByRecruiter(currentUser.id) : { applications: [], error: null }
    ]);

    const errors = [];
    if (candidateResult.error) {
      errors.push("Candidates");
    } else {
      setCandidates(candidateResult.candidates);
    }
    if (contactResult.error) {
      errors.push("Contact messages");
    } else {
      setContactMessages(contactResult.messages);
    }
    if (applicationResult?.error) {
      errors.push("Applications");
    } else if (applicationResult) {
      setApplications(applicationResult.applications);
    }

    if (errors.length > 0) {
      setDashboardError(`Failed to load: ${errors.join(", ")}. Some data may be outdated.`);
    }
    setDataLoading(false);
  };

  // Auth check and initial data load
  useEffect(() => {
    if (!authLoading) {
      if (!currentUser || currentUser.isAnonymous) {
        navigate("/login");
      } else {
        loadCandidatesData();
      }
    }
   
  }, [currentUser, authLoading, navigate]);

  // Show spinner while auth or data loading
  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-16">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-brand-primary mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-slate-600 text-xs font-semibold">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Guard against missing auth (should not reach here)
  if (!currentUser || currentUser.isAnonymous) {
    return null;
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 rounded-full filter blur-[150px] pointer-events-none z-0"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {dashboardError && (
          <div className="mb-6 bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start">
            <AlertCircle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-800 font-medium">{dashboardError}</p>
              <button
                onClick={() => loadCandidatesData()}
                className="mt-2 text-xs font-bold text-amber-700 hover:text-amber-900 underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        <DashboardComponent
          candidates={candidates}
          contactMessages={contactMessages}
          applications={applications}
          refreshData={() => loadCandidatesData(true)}
          updateCandidateStatus={updateCandidateStatus}
          deleteContactMessage={deleteContactMessage}
          deleteCandidateRecord={deleteCandidateRecord}
        />
        {/* Recruiter Job Management */}
        <RecruiterJobsSection 
          currentUser={currentUser} 
          candidates={candidates}
          applications={applications}
          refreshApplications={() => loadCandidatesData(true)}
        />
      </div>
    </div>
  );
};

export default Dashboard;
