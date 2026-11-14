import { createClient, RealtimeChannel } from '@supabase/supabase-js';

// Retrieve credentials from Vite env or fallback to user settings stored in localStorage
const getSavedCredentials = () => {
  const url = (import.meta as any).env?.VITE_SUPABASE_URL || localStorage.getItem('STUDYHUB_SUPABASE_URL') || '';
  const key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || localStorage.getItem('STUDYHUB_SUPABASE_ANON_KEY') || '';
  return { url, key };
};

const creds = getSavedCredentials();
export const isSupabaseConfigured = Boolean(creds.url && creds.key);

export const supabase = isSupabaseConfigured
  ? createClient(creds.url, creds.key)
  : null;

export const updateSupabaseCredentials = (url: string, key: string) => {
  if (url) localStorage.setItem('STUDYHUB_SUPABASE_URL', url.trim());
  else localStorage.removeItem('STUDYHUB_SUPABASE_URL');

  if (key) localStorage.setItem('STUDYHUB_SUPABASE_ANON_KEY', key.trim());
  else localStorage.removeItem('STUDYHUB_SUPABASE_ANON_KEY');

  window.location.reload();
};

export const getSupabaseSettings = () => {
  return {
    url: (import.meta as any).env?.VITE_SUPABASE_URL || localStorage.getItem('STUDYHUB_SUPABASE_URL') || '',
    key: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || localStorage.getItem('STUDYHUB_SUPABASE_ANON_KEY') || '',
    isEnv: Boolean((import.meta as any).env?.VITE_SUPABASE_URL)
  };
};
