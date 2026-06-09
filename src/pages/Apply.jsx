import React from "react";
import CandidateForm from "../components/CandidateForm";

const Apply = () => {
  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl font-extrabold text-navy-800 tracking-tight sm:text-4xl">
            Join the HirePinnacle50 Talent Network
          </h1>
          <p className="mt-4 text-slate-500 text-sm leading-relaxed max-w-xl mx-auto font-light">
            Fill in the details below and upload your resume. Our recruiter panel will match you 
            with active openings from our corporate partners.
          </p>
        </div>
        
        {/* Public Candidate Registration Form */}
        <CandidateForm />
      </div>
    </div>
  );
};

export default Apply;
