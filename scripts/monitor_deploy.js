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

async function githubRequest(endpoint) {
  const headers = {
    'Accept': 'application/vnd.github+json',
    'Authorization': `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'EclipseLend-Monitor'
  };
  const res = await fetch(`https://api.github.com${endpoint}`, { headers });
  return await res.json();
}

async function monitor() {
  const runId = '34834268823';
  console.log(`Monitoring GitHub Actions Run: ${runId}...`);

  for (let i = 0; i < 60; i++) {
    const run = await githubRequest(`/repos/${owner}/${repo}/actions/runs/${runId}`);
    const status = run.status;
    const conclusion = run.conclusion;
    const time = new Date().toLocaleTimeString();

    console.log(`[${time}] Run Status: ${status} | Conclusion: ${conclusion || 'pending'}`);

    if (status === 'completed') {
      console.log(`\n🎉 Workflow completed with conclusion: ${conclusion}`);
      
      const jobs = await githubRequest(`/repos/${owner}/${repo}/actions/runs/${runId}/jobs`);
      if (jobs.jobs) {
        jobs.jobs.forEach(job => {
          console.log(`Job: ${job.name} -> ${job.conclusion}`);
          job.steps?.forEach(step => {
            console.log(`  - Step: ${step.name} (${step.conclusion})`);
          });
        });
      }
      return;
    }

    await new Promise(r => setTimeout(r, 20000));
  }
}

monitor().catch(console.error);
