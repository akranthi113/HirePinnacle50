import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://cwdjrandzilgwzycintr.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_9i0nyym4g0iBMOz8ScXGpA_X_1b_t_v";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
