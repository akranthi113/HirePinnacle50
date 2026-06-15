// src/components/AddJobForm.jsx
import React, { useState } from "react";
import { createJob } from "../firebase/jobs";
import { useAuth } from "../context/AuthContext";

/**
 * AddJobForm – a modern, responsive form for recruiters to create a new job posting.
 * Uses existing Tailwind‑like utility classes for a polished look, includes validation,
 * loading indicator, and success/error feedback.
 */
const AddJobForm = ({ onJobCreated }) => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [jobType, setJobType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [status, setStatus] = useState(null); // {type: "error"|"success", message: string}
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!title || !location || !description) {
      setStatus({ type: "error", message: "Title, location and description are required." });
      return;
    }
    // Approx. 200 words ≈ 1200 characters
    if (description.length > 1200) {
      setStatus({ type: "error", message: "Description is too long (max 1200 characters)." });
      return;
    }
    setLoading(true);
    const jobData = {
      title,
      location,
      description,
      salary_range: salaryRange,
      job_type: jobType,
      experience_level: experienceLevel,
    };
    const result = await createJob(jobData, currentUser?.id);
    setLoading(false);
    if (result.error) {
      setStatus({ type: "error", message: result.error });
    } else {
      setStatus({ type: "success", message: "Job posted successfully!" });
      if (typeof onJobCreated === "function") onJobCreated();
      // Reset form fields
      setTitle("");
      setLocation("");
      setDescription("");
      setSalaryRange("");
      setJobType("");
      setExperienceLevel("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Add New Job</h2>
      {status && (
        <div className={`p-3 rounded ${status.type === "error" ? "bg-rose-50 text-rose-800" : "bg-emerald-50 text-emerald-800"}`}>
          {status.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4" aria-busy={loading}>
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Job Title <span className="text-rose-600">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Senior Front‑End Engineer"
            required
            disabled={loading}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-navy-500 focus:ring-navy-500 px-3 py-2"
          />
        </div>
        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location <span className="text-rose-600">*</span>
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Remote, New York, London"
            required
            disabled={loading}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-navy-500 focus:ring-navy-500 px-3 py-2"
          />
        </div>
        {/* Optional fields grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
            <input
              id="salary"
              type="text"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              placeholder="e.g. $70k‑$90k"
              disabled={loading}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-navy-500 focus:ring-navy-500 px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
            <input
              id="jobType"
              type="text"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              placeholder="Full‑time, Contract…"
              disabled={loading}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-navy-500 focus:ring-navy-500 px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
            <input
              id="experience"
              type="text"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              placeholder="Mid‑level, Senior…"
              disabled={loading}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-navy-500 focus:ring-navy-500 px-3 py-2"
            />
          </div>
        </div>
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (max 200 words) <span className="text-rose-600">*</span>
          </label>
          <textarea
            id="description"
            rows={5}
            maxLength={1200}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a concise overview of the role, responsibilities, and requirements."
            required
            disabled={loading}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-navy-500 focus:ring-navy-500 px-3 py-2 resize-none"
          />
        </div>
        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center bg-navy-600 text-white py-2 rounded hover:bg-navy-700 transition disabled:opacity-60"
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
            </svg>
          )}
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default AddJobForm;
