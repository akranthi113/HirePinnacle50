import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "../firebase/config";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const isMock = () => false;

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [inactivityWarning, setInactivityWarning] = useState(false);
  const [mockActive, setMockActive] = useState(isMock());
  
  const lastActivityRef = useRef(Date.now());
  const inactivityTimeout = 30 * 60 * 1000; // 30 minutes
  
  const resetActivityTimer = () => {
    lastActivityRef.current = Date.now();
  };

  // Helper box compatibility
  const toggleMockMode = (active) => {};

  useEffect(() => {
    if (!currentUser || isAnonymous) return;

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    events.forEach(event => {
      window.addEventListener(event, resetActivityTimer);
    });

    const interval = setInterval(() => {
      const timePassed = Date.now() - lastActivityRef.current;
      if (timePassed >= inactivityTimeout) {
        logout();
        alert("You have been logged out due to 30 minutes of inactivity.");
      }
    }, 10000);

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetActivityTimer);
      });
      clearInterval(interval);
    };
  }, [currentUser, isAnonymous]);

  // Fetch user profile from Supabase users table
  const fetchUserProfile = async (uid) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("uid", uid)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        if (data.status === "inactive") {
          await supabase.auth.signOut();
          throw new Error("Your account is deactivated. Please contact the administrator.");
        }
        setUserProfile(data);
        return data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  };

  // Sign in anonymously (Compatibility mode)
  const loginAnonymously = async () => {
    setIsAnonymous(true);
    setCurrentUser({ uid: "anon_uid", isAnonymous: true });
    return { user: { uid: "anon_uid", isAnonymous: true }, error: null };
  };

  // Standard Login
  const login = async (email, password) => {
    try {
      setLoading(true);
      const cleanEmail = email.toLowerCase().trim();
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (authError) {
        const errMsg = authError.message || "";
        // Seeding mechanism for initial kranthiaws113@gmail.com login
        if (
          cleanEmail === "kranthiaws113@gmail.com" &&
          (errMsg.includes("Invalid login credentials") || errMsg.includes("user-not-found") || authError.status === 400)
        ) {
          console.log("Admin account not found in Auth. Seeding now...");
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
              data: {
                displayName: "System Administrator"
              }
            }
          });

          if (signUpError) throw signUpError;

          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password
          });
          if (signInError) throw signInError;

          setIsAnonymous(false);
          const profile = await fetchUserProfile(signInData.user.id);
          return { user: signInData.user, error: null };
        } else {
          throw authError;
        }
      }

      setIsAnonymous(false);
      const profile = await fetchUserProfile(data.user.id);

      if (profile) {
        await supabase
          .from("users")
          .update({ lastActive: new Date().toISOString() })
          .eq("uid", data.user.id);
      }

      return { user: data.user, error: null };
    } catch (error) {
      console.error("Login error:", error);
      return { user: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUserProfile(null);
      setCurrentUser(null);
      setIsAnonymous(false);
      return { error: null };
    } catch (error) {
      console.error("Logout error:", error);
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Password reset email
  const sendPasswordReset = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin + "/login"
      });
      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error("Password reset error:", error);
      return { success: false, error: error.message };
    }
  };

  // Admin creating recruiter accounts
  const registerRecruiter = async (email, password, displayName) => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://cwdjrandzilgwzycintr.supabase.co";
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_9i0nyym4g0iBMOz8ScXGpA_X_1b_t_v";

      // Create a secondary Supabase client instance with persistSession: false so the admin is not signed out
      const tempSupabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });

      const { data, error } = await tempSupabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            displayName
          }
        }
      });

      if (error) throw error;

      // Note: The public user row will be created automatically by the database trigger!
      return { uid: data.user.id, error: null };
    } catch (error) {
      console.error("Background registration error:", error);
      return { uid: null, error: error.message };
    }
  };

  // Listen to Supabase Auth Changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user || null;
      setCurrentUser(user);
      
      if (user) {
        setIsAnonymous(false);
        try {
          await fetchUserProfile(user.id);
        } catch (err) {
          console.error("Auth state change profile fetch error:", err);
        }
      } else {
        setUserProfile(null);
        setIsAnonymous(false);
      }
      
      setLoading(false);
      setInitialLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    isAnonymous,
    mockActive,
    login,
    logout,
    loginAnonymously,
    sendPasswordReset,
    registerRecruiter,
    toggleMockMode
  };

  return (
    <AuthContext.Provider value={value}>
      {!initialLoading && children}
    </AuthContext.Provider>
  );
};
