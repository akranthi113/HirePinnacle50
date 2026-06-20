import React, { useEffect, useState } from "react";
import { fetchJobsByRecruiter, deleteJob, deleteApplication } from "../firebase/jobs";
import { fetchBlogsByAuthor, deleteBlog } from "../firebase/blogs";
import { Link } from "react-router-dom";
import AddJobForm from "../components/AddJobForm";
import { X, FileDown, Copy, Check } from "lucide-react";

const RecruiterJobsSection = ({ currentUser, candidates = [], applications = [], refreshApplications }) => {
  const [jobs, setJobs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [copied, setCopied] = useState(false);

  const loadJobs = async () => {
    setLoading(true);
    const { jobs, error } = await fetchJobsByRecruiter(currentUser?.id);
    if (!error) setJobs(jobs);
    setLoading(false);
  };

  const loadBlogs = async () => {
    const { blogs, error } = await fetchBlogsByAuthor(currentUser?.id);
    if (!error) setBlogs(blogs);
  };

  useEffect(() => {
    if (currentUser) {
      loadJobs();
      loadBlogs();
    }
  }, [currentUser]);

  const handleDeleteJob = async (id) => {
    await deleteJob(id);
    loadJobs();
    if (refreshApplications) refreshApplications();
  };

  const handleDeleteApplication = async (id) => {
    const confirmed = window.confirm("Remove this job application record?");
    if (!confirmed) return;
    await deleteApplication(id);
    if (refreshApplications) refreshApplications();
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm("Delete this blog post?")) {
      await deleteBlog(id);
      loadBlogs();
    }
  };

  const handleViewCandidateDetails = (candidateId, app) => {
    const cand = candidates.find(c => c.id === candidateId);
    if (cand) {
      setSelectedCandidate(cand);
    } else {
      // Fallback using details stored inside application row
      setSelectedCandidate({
        id: candidateId,
        fullName: app.candidate_name,
        email: app.email,
        phone: app.phone,
        qualification: app.qualification,
        experience: app.experience,
        timestamp: app.applied_at
      });
    }
  };

  const handleCopy = () => {
    if (!selectedCandidate) return;
    const summaryText = `Name: ${selectedCandidate.fullName || ""}
Father's Name: ${selectedCandidate.fatherName || ""}
Phone Number: ${selectedCandidate.phone || ""}
Alternative Number: ${selectedCandidate.alternativeNumber || ""}
Email ID: ${selectedCandidate.email || ""}
Date of Birth: ${selectedCandidate.dob || ""}
Gender: ${selectedCandidate.gender || ""}
Marital status: ${selectedCandidate.maritalStatus || ""}
Aadhar Number: ${selectedCandidate.aadharNumber || ""}
Highest Qualification: ${selectedCandidate.qualification || ""}
Residential address with pincode : ${selectedCandidate.address || ""}
Spoken Languages: ${selectedCandidate.languages || ""}
Experience: ${selectedCandidate.experience || ""}
How often will you be able to join? ${selectedCandidate.joiningTimeline || ""}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Your Job Postings</h2>
          <p className="text-slate-600 text-sm mt-1 font-light">Manage your published opportunities</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <Link
            to="/dashboard/blog/new"
            className="px-6 py-2.5 bg-brand-accent hover:bg-emerald-600 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition flex items-center"
          >
            Add Blog
          </Link>
          <button
            className="px-6 py-2.5 bg-brand-primary hover:bg-blue-600 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)] transition"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Add New Job"}
          </button>
        </div>
      </div>
      
      {showForm && (
        <div className="mb-8 p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
          <AddJobForm onJobCreated={loadJobs} />
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 text-brand-primary border-2 border-brand-primary border-t-transparent rounded-full"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl text-center border border-slate-200 shadow-sm mb-12">
          <p className="text-slate-500">You haven't posted any jobs yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {jobs.map((job) => (
            <div key={job.id} className="p-6 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">{job.title}</h3>
                <p className="text-sm text-brand-primary font-medium mb-3">{job.location}</p>
                <p className="mt-2 text-sm text-slate-700 line-clamp-3 font-light leading-relaxed">{job.description}</p>
              </div>
              <div className="mt-6 flex space-x-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleDeleteJob(job.id)}
                  className="flex-1 py-2 bg-white text-rose-600 border border-slate-200 rounded-lg hover:bg-rose-50 hover:border-rose-200 transition text-sm font-semibold"
                >
                  Delete Job
                </button>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/HirePinnacle50/jobs/${job.id}`;
                    navigator.clipboard.writeText(url).then(() => alert("Share link copied!"));
                  }}
                  className="flex-1 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-brand-primary transition text-sm font-semibold"
                >
                  Share Link
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Applications to Your Jobs</h2>
        <p className="text-slate-600 text-sm mt-1 font-light">Candidates who applied directly to your postings</p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl text-center border border-slate-200 shadow-sm">
          <p className="text-slate-500">No applications yet.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {applications.map((app) => (
            <li key={app.id} className="p-5 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm rounded-2xl flex justify-between items-center transition">
              <div>
                <p className="font-bold text-slate-900 text-lg">{app.candidate_name || app.email}</p>
                <p className="text-sm text-brand-primary mt-1">Applied to: <span className="font-medium">{app.jobs?.title || "Unknown Job"}</span></p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewCandidateDetails(app.candidate_id, app)}
                  className="px-4 py-2 bg-white text-brand-primary border border-slate-200 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition text-sm font-semibold"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleDeleteApplication(app.id)}
                  className="px-4 py-2 bg-white text-rose-600 border border-slate-200 rounded-lg hover:bg-rose-50 hover:border-rose-200 transition text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Blogs Section */}
      <div className="mb-8 mt-12">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Your Blog Postings</h2>
        <p className="text-slate-600 text-sm mt-1 font-light">Articles you've shared with candidates</p>
      </div>

      {blogs.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl text-center border border-slate-200 shadow-sm">
          <p className="text-slate-500">You haven't posted any blogs yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {blogs.map((blog) => (
            <div key={blog.id} className="p-6 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition rounded-2xl flex flex-col justify-between">
              <div>
                {blog.thumbnail_url && (
                  <img src={blog.thumbnail_url} alt={blog.title} className="w-full h-32 object-cover rounded-lg mb-4" />
                )}
                <h3 className="font-bold text-xl text-slate-900 mb-2">{blog.title}</h3>
                <p className="text-sm text-slate-500 mb-3">{new Date(blog.created_at).toLocaleDateString()}</p>
                <div className="mt-2 text-sm text-slate-700 line-clamp-2 font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: blog.content }} />
              </div>
              <div className="mt-6 flex space-x-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleDeleteBlog(blog.id)}
                  className="flex-1 py-2 bg-white text-rose-600 border border-slate-200 rounded-lg hover:bg-rose-50 hover:border-rose-200 transition text-sm font-semibold"
                >
                  Delete Blog
                </button>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/HirePinnacle50/blog/${blog.slug}`;
                    navigator.clipboard.writeText(url).then(() => alert("Blog link copied!"));
                  }}
                  className="flex-1 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-brand-primary transition text-sm font-semibold"
                >
                  Share Link
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Candidate Details Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-200 pb-5 mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{selectedCandidate.fullName}</h3>
                <p className="text-slate-500 text-xs mt-1 tracking-wider uppercase">Application Details — Applied on {selectedCandidate.timestamp ? (selectedCandidate.timestamp.toDate ? selectedCandidate.timestamp.toDate().toLocaleDateString() : new Date(selectedCandidate.timestamp).toLocaleDateString()) : "N/A"}</p>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-slate-500 hover:bg-slate-100 hover:text-slate-900 p-2 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid of Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm mb-8">
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Father's Name</span>
                <span className="text-slate-900 font-medium">{selectedCandidate.fatherName || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Date of Birth</span>
                <span className="text-slate-900 font-medium">{selectedCandidate.dob || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Phone Number</span>
                <span className="text-slate-700 font-mono font-medium">{selectedCandidate.phone || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Alternative Number</span>
                <span className="text-slate-700 font-mono font-medium">{selectedCandidate.alternativeNumber || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Email ID</span>
                <span className="text-slate-900 font-medium">{selectedCandidate.email || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Gender</span>
                <span className="text-slate-900 font-medium">{selectedCandidate.gender || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Marital Status</span>
                <span className="text-slate-900 font-medium">{selectedCandidate.maritalStatus || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Aadhar Number</span>
                <span className="text-slate-900 font-medium">{selectedCandidate.aadharNumber || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Highest Qualification</span>
                <span className="text-slate-900 font-medium">{selectedCandidate.qualification || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Spoken Languages</span>
                <span className="text-slate-900 font-medium">{selectedCandidate.languages || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Experience</span>
                <span className="text-slate-900 font-medium">{selectedCandidate.experience || "N/A"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Join Timeline</span>
                <span className="text-slate-900 font-medium">{selectedCandidate.joiningTimeline || "N/A"}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-2">Residential Address with Pincode</span>
                <p className="text-slate-700 font-medium whitespace-pre-line bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm leading-relaxed">
                  {selectedCandidate.address || "N/A"}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center border-t border-slate-200 pt-6 gap-4">
              <span className="text-sm text-slate-600">Current Status: <strong className="ml-2 px-3 py-1 rounded-full text-xs tracking-wider border bg-blue-50 text-blue-700 border-blue-200">{selectedCandidate.status || "New"}</strong></span>
              <div className="flex space-x-3 w-full sm:w-auto">
                <button
                  onClick={handleCopy}
                  className={`flex items-center justify-center flex-grow sm:flex-grow-0 text-sm font-bold px-5 py-2.5 rounded-xl border transition ${
                    copied
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-blue-50 text-brand-primary border-blue-200 hover:bg-brand-primary hover:text-white hover:border-brand-primary"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Summary
                    </>
                  )}
                </button>
                {selectedCandidate.resumeURL && (
                  <a
                    href={selectedCandidate.resumeURL}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center flex-grow sm:flex-grow-0 text-sm btn-primary px-5 py-2.5 shadow-sm"
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    Resume
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterJobsSection;
