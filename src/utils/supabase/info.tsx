/**
 * Supabase Configuration (loaded from environment variables)
 * These values are safe to expose as they use the PUBLIC anon key
 * Never put service keys or private credentials here
 */

export const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || '';
export const publicAnonKey = import.meta.env.VITE_SUPABASE_PUBLIC_ANON_KEY || '';
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || `https://${projectId}.supabase.co`;

// Validate that required credentials are configured
if (!projectId || !publicAnonKey) {
  console.warn(
    '⚠️  Supabase credentials not configured.\n' +
    'Please set VITE_SUPABASE_PROJECT_ID and VITE_SUPABASE_PUBLIC_ANON_KEY in .env.local'
  );
}