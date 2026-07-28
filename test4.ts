import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://vchszqjajmwwtjbndkrt.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...';

// I need the actual anon key! Let me read it from .env or Vite env.
import fs from 'fs';
const envContent = fs.readFileSync('.env', 'utf-8').split('\n');
let url = '', key = '';
for(let line of envContent) {
  if (line.startsWith('VITE_SUPABASE_URL=')) url = line.split('=')[1].trim();
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
}

const supabase = createClient(url, key);

async function run() {
  const { data: companies, error: err1 } = await supabase.from('companies').select('*').limit(1);
  console.log('companies:', companies, err1);

  const { data: users, error: err2 } = await supabase.from('users').select('company_id').limit(1);
  console.log('users company_id:', users, err2);
}
run();
