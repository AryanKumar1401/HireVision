import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr';

// Create browser-compatible supabase client
export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey);
};

// Create server-side supabase client
export const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
};

// Check if a user has a specific role
export const hasRole = async (client: ReturnType<typeof createClient>, role: string) => {
  const { data: { session } } = await client.auth.getSession();
  if (!session) return false;

  const roles = session.user?.user_metadata?.app_metadata?.roles || [];
  return roles.includes(role);
};

// Check if the user is a recruiter
export const isRecruiter = async (client: ReturnType<typeof createClient>) => {
  return hasRole(client, 'recruiter');
};

// Check if the user is a candidate
export const isCandidate = async (client: ReturnType<typeof createClient>) => {
  return !await isRecruiter(client);
};