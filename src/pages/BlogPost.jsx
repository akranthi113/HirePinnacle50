// src/pages/BlogPost.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchBlogBySlug } from "../firebase/blogs";

// Simple HTML sanitizer: strips <script> tags and event-handler attributes
function sanitizeHtml(html) {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  div.querySelectorAll("script, iframe, object, embed").forEach((el) => el.remove());
  div.querySelectorAll("*").forEach((el) => {
    for (const attr of [...el.attributes]) {
      if (/^on\w+/i.test(attr.name)) el.removeAttribute(attr.name);
    }
  });
  return div.innerHTML;
}

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareMessage, setShareMessage] = useState("");

  const handleShare = async () => {
    const url = `${window.location.origin}/HirePinnacle50/blog/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareMessage("Blog link copied!");
      setTimeout(() => setShareMessage(""), 3000);
    } catch (e) {
      console.error(e);
      setShareMessage("Failed to copy link.");
      setTimeout(() => setShareMessage(""), 3000);
    }
  };

  useEffect(() => {
    const loadPost = async () => {
      try {
        const { blog, error } = await fetchBlogBySlug(slug);
        if (error) throw new Error(error);
        setPost(blog);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-brand-primary mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-slate-600 text-xs font-semibold">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 text-rose-600 font-sans">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Unable to load post</p>
          <p className="text-sm text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-800 font-sans">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Post not found</p>
          <p className="text-sm text-slate-600">The blog post you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-[500px] bg-hero-pattern opacity-40 z-0"></div>

      <article className="max-w-3xl mx-auto relative z-10 glassmorphism p-8 rounded-3xl shadow-sm border border-slate-200">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 animate-fade-in">{post.title}</h1>
        <div className="flex items-center text-sm text-slate-600 mb-6">
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
        </div>
        <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} />
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50"
          >
            ← Back to Blog
          </button>
          <button
            onClick={handleShare}
            className="px-6 py-2.5 text-sm font-medium text-white bg-brand-primary rounded-xl hover:bg-blue-600 shadow-sm"
          >
            Share Link
          </button>
          {shareMessage && <span className="text-sm font-medium text-emerald-600 animate-fade-in">{shareMessage}</span>}
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
