// ==============================================================================
// NelovMallickIITD CBT Platform - Supabase Client Interface
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve environment variables with safe fallbacks for both Vite & browser runtimes
const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof window !== 'undefined' && (window as any).__ENV__?.VITE_SUPABASE_URL) ||
  '';

const envAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof window !== 'undefined' && (window as any).__ENV__?.VITE_SUPABASE_ANON_KEY) ||
  '';

// Validate that credentials are set and not placeholder defaults
export const isSupabaseConfigured: boolean = Boolean(
  envUrl &&
  envAnonKey &&
  !envUrl.includes('your-project') &&
  !envAnonKey.includes('your-anon-key')
);

let supabaseClient: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(envUrl, envAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'nelov_supabase_auth_token'
      }
    });
  } catch (err) {
    console.warn('[Supabase] Failed to initialize client. Falling back to local offline mode:', err);
    supabaseClient = null;
  }
}

// Export the initialized client or null if not configured
export const supabase = supabaseClient;

/**
 * Returns whether Supabase cloud mode is currently operational.
 */
export function checkCloudStatus(): {
  isConfigured: boolean;
  url: string;
  mode: 'cloud' | 'local_fallback';
} {
  return {
    isConfigured: isSupabaseConfigured,
    url: isSupabaseConfigured ? envUrl : '',
    mode: isSupabaseConfigured ? 'cloud' : 'local_fallback'
  };
}
