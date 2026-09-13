const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd) {
  try {
    console.log(`> ${cmd}`);
    return execSync(cmd, { stdio: 'inherit' });
  } catch (err) {
    console.error(`Command failed: ${cmd}`);
    process.exit(1);
  }
}

// Load token from .env.local if available
let token = process.env.GITHUB_TOKEN;
const envLocalPath = path.resolve(__dirname, '..', '.env.local');
if (!token && fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf8');
  const match = content.match(/GITHUB_TOKEN=(.*)/);
  if (match) token = match[1].trim();
}

console.log('🚀 Staging and committing EclipseLend repository...');
run('git add .');
try {
  run('git commit -m "docs: update repository details and documentation"');
} catch (e) {
  console.log('No new changes to commit.');
}

if (token) {
  console.log('Pushing to remote origin main...');
  const remoteUrl = `https://ruhisharma-star:${token}@github.com/ruhisharma-star/EclipseLend.git`;
  try {
    run('git remote remove origin');
  } catch (e) {}
  run(`git remote add origin ${remoteUrl}`);
  run('git push origin main');
  console.log('✅ Changes successfully pushed to GitHub!');
} else {
  console.log('Token not found in environment or .env.local. Run: git push origin main');
}
