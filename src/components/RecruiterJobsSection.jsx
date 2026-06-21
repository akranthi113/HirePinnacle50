import React, { useEffect, useState } from "react";
import { fetchJobsByRecruiter, deleteJob } from "../firebase/jobs";
import { fetchBlogsByAuthor, deleteBlog } from "../firebase/blogs";
import { Link } from "react-router-dom";
import AddJobForm from "../components/AddJobForm";
import { AlertTriangle } from "lucide-react";

const RecruiterJobsSection = ({ currentUser, refreshApplications }) => {
  const [jobs, setJobs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
    setDeleteTarget(id);
    setDeleteType("job");
  };

  const handleDeleteBlog = async (id) => {
    setDeleteTarget(id);
    setDeleteType("blog");
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !deleteType) return;
    setDeleting(true);
    if (deleteType === "job") {
      await deleteJob(deleteTarget);
      loadJobs();
      if (refreshApplications) refreshApplications();
    } else {
      await deleteBlog(deleteTarget);
      loadBlogs();
    }
    setDeleting(false);
    setDeleteTarget(null);
    setDeleteType(null);
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

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 max-w-sm w-full">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-50 border border-rose-100 mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
              Delete {deleteType === "job" ? "Job Posting" : "Blog Post"}?
            </h3>
            <p className="text-sm text-slate-600 text-center mb-6 font-light">
              {deleteType === "job"
                ? "This will permanently remove this job and all associated applications."
                : "This will permanently remove this blog post."}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => { setDeleteTarget(null); setDeleteType(null); }}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 py-2.5 px-4 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg transition text-sm disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default RecruiterJobsSection;
