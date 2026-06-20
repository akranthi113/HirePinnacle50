// src/pages/BlogPost.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchBlogBySlug } from "../firebase/blogs";

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
        Loading post...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 text-red-600">
        {error}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        Post not found.
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
        <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: post.content }} />
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
