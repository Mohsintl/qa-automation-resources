import { createClient } from '@supabase/supabase-js';
import type { Session, User } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;

// Initialize Supabase client with public credentials for client-side authentication
export const supabase = createClient(supabaseUrl, publicAnonKey);

/**
 * Sign in user with email and password.
 * @param email - User's email address
 * @param password - User's password
 * @returns Authentication data including user and session
 * @throws Error if authentication fails
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Sign out the current user and clear session.
 * @throws Error if sign out fails
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Retrieve the current user's session.
 * @returns Current session or null if not authenticated
 * @throws Error if session retrieval fails
 */
export async function getSession(): Promise<Session | null> {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

/**
 * Check if user has admin privileges.
 * @param user - Supabase user object
 * @returns true if user has isAdmin flag in metadata
 */
export async function isAdmin(user: User | null): Promise<boolean> {
  if (!user) return false;
  return user.user_metadata?.isAdmin === true;
}