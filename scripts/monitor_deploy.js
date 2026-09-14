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
  const runs = await githubRequest(`/repos/${owner}/${repo}/actions/workflows/deploy.yml/runs`);
  if (!runs.workflow_runs || runs.workflow_runs.length === 0) {
    console.error('No runs found for deploy.yml');
    return;
  }
  const latestRun = runs.workflow_runs[0];
  const runId = latestRun.id;
  console.log(`Monitoring Deploy to Preprod (Run ID: ${runId}, URL: ${latestRun.html_url})...`);

  for (let i = 0; i < 90; i++) {
    const run = await githubRequest(`/repos/${owner}/${repo}/actions/runs/${runId}`);
    const status = run.status;
    const conclusion = run.conclusion;
    const time = new Date().toLocaleTimeString();

    console.log(`[${time}] Status: ${status} | Conclusion: ${conclusion || 'in_progress'}`);

    if (status === 'completed') {
      console.log(`\n🎉 Workflow finished with conclusion: ${conclusion}`);
      
      const jobs = await githubRequest(`/repos/${owner}/${repo}/actions/runs/${runId}/jobs`);
      if (jobs.jobs) {
        jobs.jobs.forEach(job => {
          console.log(`Job: ${job.name} -> ${job.conclusion}`);
          job.steps?.forEach(step => {
            console.log(`  - ${step.name} (${step.conclusion})`);
          });
        });

        const jobId = jobs.jobs[0].id;
        const logRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/jobs/${jobId}/logs`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-Agent': 'EclipseLend-Monitor'
          }
        });
        const logText = await logRes.text();

        if (conclusion === 'success') {
          console.log('\n📜 DEPLOYMENT LOG OUTPUT:');
          const lines = logText.split('\n');
          const relevant = lines.filter(l => l.includes('CONTRACT') || l.includes('Explorer') || l.includes('SUCCESS') || l.includes('Address') || l.includes('https://'));
          console.log(relevant.join('\n'));

          const contractMatch = logText.match(/CONTRACT_ADDRESS=(.*)/) || logText.match(/Contract Address: (.*)/);
          if (contractMatch) {
            console.log('\n======================================================');
            console.log('📜 DEPLOYED CONTRACT ADDRESS:', contractMatch[1]);
            console.log('🔗 MIDNIGHT EXPLORER URL:', `https://explorer.preprod.midnight.network/contract/${contractMatch[1]}`);
            console.log('======================================================');
          }
        } else {
          console.log('\n❌ FAILED LOG OUTPUT:');
          const lines = logText.split('\n');
          console.log(lines.slice(-60).join('\n'));
        }
      }
      return;
    }

    await new Promise(r => setTimeout(r, 20000));
  }
}

monitor().catch(console.error);
