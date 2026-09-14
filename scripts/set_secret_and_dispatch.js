const sodium = require('tweetsodium');
const fs = require('fs');
const path = require('path');

const SEED_PHRASE = 'please enjoy bread milk lady devote female ancient hollow split quit east rich cable job grass bounce enter rule tip grocery pear visa chimney';

let token = process.env.GITHUB_TOKEN;
const envLocalPath = path.resolve(__dirname, '..', '.env.local');
if (!token && fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf8');
  const match = content.match(/GITHUB_TOKEN=(.*)/);
  if (match) token = match[1].trim();
}

if (!token) {
  console.error('Error: GITHUB_TOKEN not found in environment or .env.local');
  process.exit(1);
}

const owner = 'ruhisharma-star';
const repo = 'EclipseLend';

async function githubRequest(endpoint, method = 'GET', body = null) {
  const headers = {
    'Accept': 'application/vnd.github+json',
    'Authorization': `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'EclipseLend-Deployer'
  };

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`https://api.github.com${endpoint}`, options);
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch (e) {}

  if (!res.ok) {
    throw new Error(`GitHub API error ${res.status} on ${endpoint}: ${text}`);
  }

  return json;
}

async function main() {
  console.log('1. Fetching repository public key for GitHub Secrets...');
  const keyData = await githubRequest(`/repos/${owner}/${repo}/actions/secrets/public-key`);
  console.log(`Public Key ID: ${keyData.key_id}`);

  console.log('2. Encrypting WALLET_SEED secret...');
  const messageBytes = Buffer.from(SEED_PHRASE);
  const keyBytes = Buffer.from(keyData.key, 'base64');
  const encryptedBytes = sodium.seal(messageBytes, keyBytes);
  const encryptedValue = Buffer.from(encryptedBytes).toString('base64');

  console.log('3. Uploading WALLET_SEED to GitHub Actions Secrets...');
  await githubRequest(`/repos/${owner}/${repo}/actions/secrets/WALLET_SEED`, 'PUT', {
    encrypted_value: encryptedValue,
    key_id: keyData.key_id,
  });
  console.log('✅ WALLET_SEED secret set successfully in repository!');

  console.log('4. Triggering "Deploy to Preprod" workflow dispatch...');
  await githubRequest(`/repos/${owner}/${repo}/actions/workflows/deploy.yml/dispatches`, 'POST', {
    ref: 'main',
  });
  console.log('🚀 Workflow dispatched on main branch!');

  console.log('5. Waiting 5s for workflow run to register...');
  await new Promise(r => setTimeout(r, 5000));

  const runs = await githubRequest(`/repos/${owner}/${repo}/actions/runs?event=workflow_dispatch`);
  if (runs.workflow_runs && runs.workflow_runs.length > 0) {
    const latestRun = runs.workflow_runs[0];
    console.log(`📡 Active Workflow Run: ${latestRun.html_url}`);
    console.log(`Status: ${latestRun.status}, Conclusion: ${latestRun.conclusion}`);
  }
}

main().catch(err => {
  console.error('Execution error:', err);
  process.exit(1);
});
