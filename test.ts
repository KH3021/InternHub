import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://vchszqjajmwwtjbndkrt.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjaHN6cWpham13d3RqYm5ka3J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIwNjg0MjUsImV4cCI6MjAzNzg0NDQyNX0.Fv43_q-N-g42dYvF2YvF4_YvF2YvF2YvF2YvF2YvF2';
// Wait, I need the actual anon key. I can just import supabase from src/lib/supabase.ts
import { supabase } from './src/lib/supabase.js';

async function test() {
  const { data, error } = await supabase.from('users').select('resume_url').limit(1);
  console.log('Data:', data);
  console.log('Error:', error);
}

test();
