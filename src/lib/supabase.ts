import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Helper function to check if a user is an admin
export async function isAdmin(): Promise<boolean> {
  const session = await supabase.auth.getSession();
  return session.data.session?.user.role === 'admin';
}

// Helper function to get the current user's profile
export async function getCurrentProfile() {
  const session = await supabase.auth.getSession();
  if (!session.data.session) return null;

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', session.data.session.user.id)
    .single();

  if (error) throw error;
  return data;
}

// Helper function to format error messages
export function formatError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}