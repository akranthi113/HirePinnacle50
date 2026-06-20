import React, { useState, useEffect } from "react";
import { createBlog } from "../firebase/blogs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BlogForm = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate("/login");
    }
  }, [currentUser, authLoading, navigate]);

  if (authLoading) {
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

  if (!currentUser) {
    return null;
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Generate a simple slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      const { blog, error: submitError } = await createBlog({
        title,
        content,
        slug,
        thumbnail_url: thumbnailUrl,
        author_id: currentUser?.id || currentUser?.uid || null
      });

      setLoading(false);

      if (submitError) {
        setError(submitError);
      } else {
        // Show a success message and navigate back to the dashboard after a short delay
        setSuccessMessage('Your blog post was published successfully!');
        // Clear the form fields
        setTitle('');
        setContent('');
        setThumbnailUrl('');
        // Redirect to dashboard after 1.5 seconds so user can see the message
        setTimeout(() => navigate('/dashboard'), 1500);
      }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-200 mt-20">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Blog Post</h2>
      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
      {successMessage && <div className="mb-4 text-green-600 text-sm">{successMessage}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition"
            placeholder="Post title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Thumbnail URL</label>
          <input
            type="url"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Content (HTML)</label>
          <textarea
            required
            rows="8"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition"
            placeholder="<p>Write your post content here...</p>"
          ></textarea>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-brand-primary text-white font-medium rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
