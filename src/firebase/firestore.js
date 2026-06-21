import { supabase } from "./config";

// --- MOCK MODE CONFIG & SEEDING (Dummy no-ops for compatibility) ---
export const isMockActive = () => false;
export const setMockMode = (active) => {};

// --- CANDIDATE FUNCTIONS ---

export const checkDuplicateCandidate = async (email, phone) => {
  try {
    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone.trim();

    // Search email
    const { data: emailData, error: emailErr } = await supabase
      .from("candidates")
      .select("id")
      .eq("email", cleanEmail)
      .limit(1);

    if (emailErr) throw emailErr;
    if (emailData && emailData.length > 0) {
      return { isDuplicate: true, field: "email", error: null };
    }

    // Search phone
    const { data: phoneData, error: phoneErr } = await supabase
      .from("candidates")
      .select("id")
      .eq("phone", cleanPhone)
      .limit(1);

    if (phoneErr) throw phoneErr;
    if (phoneData && phoneData.length > 0) {
      return { isDuplicate: true, field: "phone", error: null };
    }

    return { isDuplicate: false, field: null, error: null };
  } catch (error) {
    console.error("Duplicate check error:", error);
    return { isDuplicate: false, field: null, error: error.message };
  }
};

export const addCandidate = async (candidateData, customId = null) => {
  try {
    const payload = {
      ...candidateData,
      status: "New",
      timestamp: new Date().toISOString()
    };
    if (customId) {
      payload.id = customId;
    }
    const { data, error } = await supabase
      .from("candidates")
      .insert(payload)
      .select("id");

    if (error) throw error;
    return { id: data[0]?.id || customId, error: null };
  } catch (error) {
    console.error("Error adding candidate:", error);
    return { id: null, error: error.message };
  }
};

export const getCandidates = async () => {
  try {
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) throw error;
    return { candidates: data || [], error: null };
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return { candidates: [], error: error.message };
  }
};

export const addContactMessage = async (messageData) => {
  try {
    const payload = {
      ...messageData,
      timestamp: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("contact_messages")
      .insert(payload)
      .select("id");

    if (error) throw error;
    return { id: data[0]?.id || null, error: null };
  } catch (error) {
    console.error("Error adding contact message:", error);
    return { id: null, error: error.message };
  }
};

// ── Delete a contact message by id ──
export const deleteContactMessage = async (msgId) => {
  try {
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", msgId);
    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting contact message:", error);
    return { success: false, error: error.message };
  }
};

export const getContactMessages = async () => {
  try {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) throw error;
    return { messages: data || [], error: null };
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return { messages: [], error: error.message };
  }
};

export const updateCandidateStatus = async (candidateId, candidateName, oldStatus, newStatus, recruiterUID, recruiterEmail) => {
  try {
    const { error: updateErr } = await supabase
      .from("candidates")
      .update({ status: newStatus })
      .eq("id", candidateId);

    if (updateErr) throw updateErr;

    const { error: logErr } = await supabase
      .from("auditLogs")
      .insert({
        recruiterUID,
        recruiterEmail,
        candidateId,
        candidateName,
        oldStatus,
        newStatus,
        timestamp: new Date().toISOString()
      });

    if (logErr) throw logErr;

    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, error: error.message };
  }
};

export const getCandidateByTrackingId = async (trackingId) => {
  try {
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .eq("tracking_id", trackingId)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return { candidate: null, error: null };
    }
    return { candidate: data, error: null };
  } catch (error) {
    console.error("Error fetching candidate by tracking ID:", error);
    if (error.message && error.message.includes("tracking_id")) {
      return { candidate: null, error: "Tracking ID feature is being initialized. Please try again later." };
    }
    return { candidate: null, error: error.message };
  }
};

export const deleteCandidateRecord = async (candidateId) => {
  try {
    const { error } = await supabase
      .from("candidates")
      .delete()
      .eq("id", candidateId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting candidate:", error);
    return { success: false, error: error.message };
  }
};

export const updateCandidateTrackingId = async (candidateId, trackingId) => {
  try {
    const { error } = await supabase
      .from("candidates")
      .update({ tracking_id: trackingId })
      .eq("id", candidateId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating tracking ID:", error);
    return { success: false, error: error.message };
  }
};

// --- RECRUITER / USER FUNCTIONS ---

export const getUserProfile = async (uid) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("uid", uid)
      .maybeSingle();

    if (error) throw error;
    if (data) {
      return { profile: data, error: null };
    }
    return { profile: null, error: "Profile not found" };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { profile: null, error: error.message };
  }
};

export const saveUserProfile = async (uid, profileData) => {
  try {
    const { error } = await supabase
      .from("users")
      .update(profileData)
      .eq("uid", uid);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error("Error saving user profile:", error);
    return { success: false, error: error.message };
  }
};

export const getRecruitersList = async () => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", "recruiter");

    if (error) throw error;
    const recruiters = (data || []).map(r => ({ id: r.uid, ...r }));
    return { recruiters, error: null };
  } catch (error) {
    console.error("Error fetching recruiters:", error);
    return { recruiters: [], error: error.message };
  }
};

export const updateRecruiterStatus = async (uid, newStatus) => {
  try {
    const { error } = await supabase
      .from("users")
      .update({ status: newStatus })
      .eq("uid", uid);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating recruiter status:", error);
    return { success: false, error: error.message };
  }
};

export const deleteRecruiterRecord = async (uid) => {
  try {
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("uid", uid);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting recruiter:", error);
    return { success: false, error: error.message };
  }
};

// --- AUDIT LOG FUNCTIONS ---

export const getAuditLogs = async () => {
  try {
    const { data, error } = await supabase
      .from("auditLogs")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) throw error;
    return { logs: data || [], error: null };
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return { logs: [], error: error.message };
  }
};
