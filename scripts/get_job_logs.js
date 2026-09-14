const fs = require('fs');
const path = require('path');

let token = process.env.GITHUB_TOKEN;
const envLocalPath = path.resolve(__dirname, '..', '.env.local');
if (!token && fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf8');
  const match = content.match(/GITHUB_TOKEN=(.*)/);
  if (match) token = match[1].trim();
}

const owner = 'ruhisharma-star';
const repo = 'EclipseLend';

async function main() {
  const runId = '34834268823';
  const headers = {
    'Accept': 'application/vnd.github+json',
    'Authorization': `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'EclipseLend-Monitor'
  };

  const jobsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/runs/${runId}/jobs`, { headers });
  const jobsData = await jobsRes.json();
  const jobId = jobsData.jobs[0].id;
  console.log(`Job ID: ${jobId}`);

  const logRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/jobs/${jobId}/logs`, { headers });
  const logText = await logRes.text();
  
  // Print the last 100 lines of the log
  const lines = logText.split('\n');
  console.log(lines.slice(-60).join('\n'));
}

main().catch(console.error);
