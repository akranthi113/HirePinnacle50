import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminPanelComponent from "../components/AdminPanel";

const Admin = () => {
  const { currentUser, userProfile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!currentUser || currentUser.isAnonymous) {
        navigate("/login");
      } else if (userProfile && userProfile.role !== "admin") {
        // Recruiter trying to access Admin panel -> redirect to Recruiter Dashboard
        navigate("/dashboard");
      }
    }
  }, [currentUser, userProfile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-16">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-blue-600 mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-slate-500 text-xs font-semibold">Verifying administrative credentials...</p>
        </div>
      </div>
    );
  }

  // Guard checks
  if (!currentUser || currentUser.isAnonymous || userProfile?.role !== "admin") {
    return null;
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <AdminPanelComponent />
      </div>
    </div>
  );
};

export default Admin;
