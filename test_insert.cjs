const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf8');
const envs = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) envs[parts[0]] = parts.slice(1).join('=').trim();
});

const supabase = createClient(envs.VITE_SUPABASE_URL, envs.VITE_SUPABASE_PUBLISHABLE_KEY);

async function testInsert() {
  const email = `test_candidate_${Date.now()}@example.com`;
  const password = 'password123';
  
  let { data: authData, error: authError } = await supabase.auth.signUp({
    email, password
  });

  if (authError) {
    console.error("Auth failed:", authError);
    return;
  }

  const candidateId = authData.user.id;
  
  // Try inserting dummy job
  const fakeJobId = '00000000-0000-0000-0000-000000000001';
  const dummyJob = {
    id: fakeJobId,
    title: 'Featured Position',
    company_name: 'Company',
    job_type: 'full-time',
    location: 'Remote',
    salary: 'Varies',
    work_mode: 'Remote'
  };

  const { error: jobError } = await supabase.from('jobs').upsert(dummyJob, { onConflict: 'id' }).maybeSingle();
  console.log("Jobs upsert error (expected if RLS blocks):", jobError);

  const payload = {
    job_id: fakeJobId,
    candidate_id: candidateId,
    status: 'applied',
    cover_letter: 'Test cover letter',
    resume_url: ''
  };

  const { data, error } = await supabase.from('applications').insert(payload).select();
  
  if (error) {
    console.log("\n--- EXACT APPLICATION INSERT ERROR ---");
    console.log(error);
  } else {
    console.log("SUCCESS!", data);
  }
}

testInsert();
