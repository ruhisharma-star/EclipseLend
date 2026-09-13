const { execSync } = require('child_process');

function run(cmd) {
  try {
    console.log(`> ${cmd}`);
    return execSync(cmd, { stdio: 'inherit' });
  } catch (err) {
    console.error(`Command failed: ${cmd}`);
    process.exit(1);
  }
}

console.log('🚀 Staging and committing EclipseLend repository...');
run('git add .');
run('git commit -m "feat: complete EclipseLend Level-3 Private Underwriting dApp on Midnight Preprod"');
console.log('✅ Commit complete. Push with: git push origin main');
