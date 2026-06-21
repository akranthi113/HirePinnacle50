// src/pages/BlogList.jsx
import React, { useEffect, useState } from "react";
import { fetchBlogs, deleteBlog } from "../firebase/blogs";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AlertTriangle } from "lucide-react";

const BlogList = () => {
  const { currentUser, userProfile } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    document.title = "Blog | PlaceIO - Recruitment Insights & Career Tips";
  }, []);

  const load = async () => {
    const { blogs: fetchedBlogs, error } = await fetchBlogs();
    if (!error) setBlogs(fetchedBlogs);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    setDeleteTarget(id);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await deleteBlog(deleteTarget);
    load();
    setDeleting(false);
    setDeleteTarget(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-brand-primary mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-slate-600 text-xs font-semibold">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        No blog posts available.
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-8 text-center">Our Blog</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white rounded-2xl shadow-md p-6 glassmorphism hover:shadow-lg transition">
            {blog.thumbnail_url && (
              <img src={blog.thumbnail_url} alt={blog.title} className="w-full h-40 object-cover rounded-lg mb-4" />
            )}
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{blog.title}</h2>
            <p className="text-slate-600 mb-4 line-clamp-3">{blog.content.slice(0, 150)}...</p>
            <div className="flex justify-between items-center mt-4">
              <Link to={`/blog/${blog.slug}`} className="text-brand-primary hover:underline font-medium">
                Read More →
              </Link>
              {currentUser && (currentUser.uid === blog.author_id || userProfile?.role === 'admin') && (
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="text-sm px-3 py-1 bg-rose-50 text-rose-600 rounded hover:bg-rose-100 transition"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 max-w-sm w-full">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-50 border border-rose-100 mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Delete Post?</h3>
            <p className="text-sm text-slate-600 text-center mb-6 font-light">
              This will permanently remove this blog post. This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteTarget(null)}
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
    </div>
  );
};

export default BlogList;
