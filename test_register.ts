import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const envVars = Object.fromEntries(
  envFile.split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => line.split('=').map(part => part.trim()))
);

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testRegistration() {
  const email = `testuser_${Date.now()}@example.com`;
  const fullName = 'Test User';
  const role = 'candidate';
  const phone = '1234567890';

  console.log(`\n--- TESTING REGISTRATION FOR: ${email} ---`);

  // 1. Check Duplicate
  console.log('1. Checking for duplicates...');
  const { data: emailData, error: emailError } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', email)
    .limit(1);

  if (emailError) {
    console.log('ERROR checking duplicate (RLS Blocked?):', emailError.message);
  } else if (emailData && emailData.length > 0) {
    console.log('FAIL: User already exists in public.users');
    return;
  } else {
    console.log('SUCCESS: No duplicate found in public.users (or RLS hid them silently)');
  }

  // 2. Try signUp
  console.log('\n2. Attempting Supabase Auth signUp...');
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: 'password123',
    options: {
      data: { full_name: fullName, role, phone },
    },
  });

  if (authError) {
    console.log('AUTH ERROR:', authError.message, '(Status:', authError.status, ')');
    
    // Simulate fallback behavior
    const isRateLimit = authError.status === 429 || authError.message.toLowerCase().includes('rate limit');
    if (isRateLimit || authError) {
      console.log('\n3. RATE LIMIT HIT! Executing local fallback bypass...');
      const fallbackId = crypto.randomUUID();
      console.log(`Attempting to insert into public.users with ID: ${fallbackId}...`);
      
      const { error: insertError } = await supabase
        .from('users')
        .insert({ id: fallbackId, email, full_name: fullName, role })
        .select();
        
      if (insertError) {
        console.log('FALLBACK INSERT FAILED! Reason:', insertError.message);
        console.log('CONCLUSION: The fallback is failing because anon users cannot insert into public.users without RLS permission!');
      } else {
        console.log('FALLBACK INSERT SUCCESS! User added to database.');
      }
    }
  } else {
    console.log('AUTH SUCCESS! User created in Supabase Auth:', authData.user?.id);
    
    // Try to insert into public.users as anon (before email confirmation)
    console.log('\n3. Attempting to insert into public.users (as anon)...');
    const { error: insertError } = await supabase
      .from('users')
      .insert({ id: authData.user.id, email, full_name: fullName, role })
      .select();
      
    if (insertError) {
      console.log('INSERT FAILED! Reason:', insertError.message);
      console.log('CONCLUSION: The user is stuck in Auth but not in public.users due to RLS!');
    } else {
      console.log('INSERT SUCCESS! User added to public.users.');
    }
  }
}

testRegistration();
