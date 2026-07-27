const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf8');
const envs = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) envs[parts[0]] = parts.slice(1).join('=').trim();
});

const supabase = createClient(envs.VITE_SUPABASE_URL, envs.VITE_SUPABASE_PUBLISHABLE_KEY);

async function checkSchema() {
  // Query to get columns for applications
  const { data: appData, error: appError } = await supabase
    .from('applications')
    .select('*')
    .limit(1);
    
  console.log("Applications columns:");
  if (appError) {
    console.error(appError);
  } else if (appData) {
    console.log(appData.length === 0 ? "Table empty, but exists. Using an invalid select to trigger error and get columns." : Object.keys(appData[0]));
  }

  // Intentionally select a fake column to see the available columns in the error hint
  const { error: hackError } = await supabase.from('applications').select('fake_col').limit(1);
  if (hackError) {
    console.log("Applications Hint:", hackError.hint || hackError.message);
  }
  
  const { error: jobsHackError } = await supabase.from('jobs').select('fake_col').limit(1);
  if (jobsHackError) {
    console.log("Jobs Hint:", jobsHackError.hint || jobsHackError.message);
  }

}

checkSchema();
