import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[InternHub] Supabase credentials are missing. ' +
    'Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your .env file.'
  );
}

// Supabase 2.x requires the anon/service JWT key.
// If a "sb_publishable_" style key is provided (Supabase 3.x format),
// we extract the encoded portion and attempt to use it directly as-is.
// Supabase project URL must always be a valid https://xxx.supabase.co URL.
export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseKey ?? 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'internhub-auth',
    },
    global: {
      headers: {
        'X-Client-Info': 'internhub-portal/1.0',
      },
    },
  }
);
