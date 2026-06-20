// src/pages/BlogList.jsx
import React, { useEffect, useState } from "react";
import { fetchBlogs, deleteBlog } from "../firebase/blogs";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BlogList = () => {
  const { currentUser, userProfile } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { blogs: fetchedBlogs, error } = await fetchBlogs();
    if (!error) setBlogs(fetchedBlogs);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deleteBlog(id);
      load(); // Refresh list after deletion
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        Loading blogs...
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
    </div>
  );
};

export default BlogList;
