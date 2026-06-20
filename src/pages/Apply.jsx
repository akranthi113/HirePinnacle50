import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CandidateForm from "../components/CandidateForm";
import { fetchJobById } from "../firebase/jobs";

const Apply = () => {
  const { jobId } = useParams();
  const [selectedJob, setSelectedJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(Boolean(jobId));
  const [jobError, setJobError] = useState("");

  useEffect(() => {
    const loadJob = async () => {
      if (!jobId) return;
      setLoadingJob(true);
      const { job, error } = await fetchJobById(jobId);
      if (error) {
        setJobError(error);
      } else {
        setSelectedJob(job);
      }
      setLoadingJob(false);
    };

    loadJob();
  }, [jobId]);

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl font-extrabold text-navy-800 tracking-tight sm:text-4xl">
            Join the PlaceIO Talent Network
          </h1>
          <p className="mt-4 text-slate-500 text-sm leading-relaxed max-w-xl mx-auto font-light">
            Fill in the details below and upload your resume. Our recruiter panel will match you 
            with active openings from our corporate partners.
          </p>
        </div>

        {loadingJob ? (
          <div className="text-center py-16">
            <p className="text-slate-500">Loading job details…</p>
          </div>
        ) : (
          <>
            {jobError && (
              <div className="mb-6 rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
                Unable to load the selected job: {jobError}. You can still submit a general profile.
              </div>
            )}
            <CandidateForm jobId={jobId} jobTitle={selectedJob?.title} />
          </>
        )}
      </div>
    </div>
  );
};

export default Apply;
