import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY);
async function test() { 
  const { data } = await supabase.from('jobs').select('*'); 
  console.log('Jobs from DB:', data?.length); 
}
test();
