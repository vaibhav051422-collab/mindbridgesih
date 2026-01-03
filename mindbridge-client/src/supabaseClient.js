import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oxnrpdnlxgqkfhreflow.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94bnJwZG5seGdxa2ZocmVmbG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3ODE2NjgsImV4cCI6MjA3MzM1NzY2OH0.M7CkONiafihy6hI5j4VJdHltJaTsklDnCZBcp7PKJ_8';

// Create Supabase client with better configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
}); 