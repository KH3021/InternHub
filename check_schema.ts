import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf-8').split('\n');
let url = '', key = '';
for(let line of envContent) {
  if (line.startsWith('VITE_SUPABASE_URL=')) url = line.split('=')[1].trim();
  if (line.startsWith('VITE_SUPABASE_PUBLISHABLE_KEY=')) key = line.split('=')[1].trim();
}

console.log('url:', url);
console.log('key length:', key.length);

const supabase = createClient(url, key);

async function checkSchema() {
  const response = await fetch(`${url}/rest/v1/?apikey=${key}`);
  const json = await response.json();
  
  console.log('Available tables in API:', Object.keys(json.definitions || {}));
}

checkSchema();
