import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cgmzhnxdrjhceqhshkju.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_KfSnRl-6wd6PB8nV1c6ELw_PdOxE0JW';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Real-time features will be disabled.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
