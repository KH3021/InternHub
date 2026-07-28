import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!);

async function run() {
  const { data, error } = await supabase.from('companies').select('*').limit(1);
  console.log('Data:', data);
  console.log('Error:', error);
}
run();
