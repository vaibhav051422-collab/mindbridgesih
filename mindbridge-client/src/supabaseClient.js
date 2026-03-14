import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "❌ Supabase environment variables are missing!\n" +
      "   VITE_SUPABASE_URL: " +
      (supabaseUrl ? "✅ set" : "❌ MISSING") +
      "\n" +
      "   VITE_SUPABASE_ANON_KEY: " +
      (supabaseAnonKey ? "✅ set" : "❌ MISSING") +
      "\n\n" +
      "   If you are on Netlify:\n" +
      "   Go to Site Settings → Environment Variables and add:\n" +
      "     VITE_SUPABASE_URL\n" +
      "     VITE_SUPABASE_ANON_KEY\n" +
      "   Then trigger a new deploy.\n\n" +
      "   If running locally, make sure mindbridge-client/.env exists with these values.",
  );
}

// Create Supabase client with better configuration
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);
