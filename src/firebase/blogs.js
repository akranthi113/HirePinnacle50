// src/firebase/blogs.js
// Supabase CRUD operations for the Blog feature
// Requires a Supabase table named 'blogs' with the following columns:
// id (uuid) primary key, title (text), slug (text unique), content (text), author_id (uuid),
// created_at (timestamp), updated_at (timestamp), thumbnail_url (text nullable)

import { supabase } from "./config";

/**
 * Create a new blog post.
 * @param {Object} blogData - { title, slug, content, author_id, thumbnail_url }
 * @returns {{ blog: Object | null, error: string | null }}
 */
export const createBlog = async (blogData) => {
  try {
    const payload = {
      ...blogData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase.from("blogs").insert(payload).select();
    if (error) throw error;
    return { blog: data[0] ?? null, error: null };
  } catch (e) {
    console.error("Error creating blog:", e);
    return { blog: null, error: e.message };
  }
};

/**
 * Fetch all blog posts (public list).
 * @returns {{ blogs: Array, error: string | null }}
 */
export const fetchBlogs = async () => {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("id, title, slug, content, author_id, created_at, updated_at, thumbnail_url")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return { blogs: data ?? [], error: null };
  } catch (e) {
    console.error("Error fetching blogs:", e);
    return { blogs: [], error: e.message };
  }
};

/**
 * Fetch all blog posts by a specific author.
 * @param {string} authorId - The author's UUID
 * @returns {{ blogs: Array, error: string | null }}
 */
export const fetchBlogsByAuthor = async (authorId) => {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("id, title, slug, content, author_id, created_at, updated_at, thumbnail_url")
      .eq("author_id", authorId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return { blogs: data ?? [], error: null };
  } catch (e) {
    console.error("Error fetching blogs by author:", e);
    return { blogs: [], error: e.message };
  }
};

/**
 * Fetch a single blog post by its slug.
 * @param {string} slug
 * @returns {{ blog: Object | null, error: string | null }}
 */
export const fetchBlogBySlug = async (slug) => {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("id, title, slug, content, author_id, created_at, updated_at, thumbnail_url")
      .eq("slug", slug)
      .single();
    if (error) throw error;
    return { blog: data ?? null, error: null };
  } catch (e) {
    console.error("Error fetching blog by slug:", e);
    return { blog: null, error: e.message };
  }
};

/**
 * Update an existing blog post.
 * @param {string} id - blog id (uuid)
 * @param {Object} updates - fields to update (title, slug, content, thumbnail_url)
 * @returns {{ blog: Object | null, error: string | null }}
 */
export const updateBlog = async (id, updates) => {
  try {
    const payload = {
      ...updates,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from("blogs")
      .update(payload)
      .eq("id", id)
      .select();
    if (error) throw error;
    return { blog: data[0] ?? null, error: null };
  } catch (e) {
    console.error("Error updating blog:", e);
    return { blog: null, error: e.message };
  }
};

/**
 * Delete a blog post.
 * @param {string} id - blog id (uuid)
 * @returns {{ success: boolean, error: string | null }}
 */
export const deleteBlog = async (id) => {
  try {
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) throw error;
    return { success: true, error: null };
  } catch (e) {
    console.error("Error deleting blog:", e);
    return { success: false, error: e.message };
  }
};
