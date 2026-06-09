import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RecruiterLogin from "../components/RecruiterLogin";

const Login = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard automatically
  useEffect(() => {
    if (currentUser && !currentUser.isAnonymous) {
      if (userProfile?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [currentUser, userProfile, navigate]);

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        <RecruiterLogin />
      </div>
    </div>
  );
};

export default Login;
