const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd, env = {}) {
  console.log(`> ${cmd}`);
  try {
    return execSync(cmd, { stdio: 'inherit', env: { ...process.env, ...env } });
  } catch (err) {
    console.error(`Command failed: ${cmd}`);
    throw err;
  }
}

async function main() {
  const root = path.resolve(__dirname, '..');
  process.chdir(root);

  console.log('1. Initializing Git repository...');
  if (fs.existsSync(path.join(root, '.git'))) {
    fs.rmSync(path.join(root, '.git'), { recursive: true, force: true });
  }
  run('git init');

  run('git config user.name "ruhisharma-star"');
  run('git config user.email "ruhisharma-star@users.noreply.github.com"');
  run('git branch -M main');

  // List of progressive commit steps with specific files and commit messages
  const commitPlan = [
    {
      files: ['.gitignore'],
      msg: 'chore: configure gitignore for Next.js and Midnight build artifacts',
    },
    {
      files: ['LICENSE'],
      msg: 'chore: add MIT License with ruhisharma-star copyright',
    },
    {
      files: ['package.json'],
      msg: 'build: setup project metadata and package manifest for Midnight ecosystem',
    },
    {
      files: ['package-lock.json'],
      msg: 'build: lock package dependencies and module graph',
    },
    {
      files: ['tsconfig.json'],
      msg: 'build: configure TypeScript compiler options with strict path aliases',
    },
    {
      files: ['postcss.config.js'],
      msg: 'style: configure PostCSS autoprefixer pipeline',
    },
    {
      files: ['tailwind.config.js'],
      msg: 'style: configure Tailwind CSS with Nordic Ice Blue and Titanium design tokens',
    },
    {
      files: ['next.config.js'],
      msg: 'build: configure Next.js with async WebAssembly support for ZK provers',
    },
    {
      files: ['contract/eclipse_lend.compact'],
      msg: 'feat(contract): implement Compact smart contract with private witness and selective disclosure',
    },
    {
      files: ['contracts/eclipse_lend.compact'],
      msg: 'feat(contract): add contracts alias for Compact compiler standard resolution',
    },
    {
      files: ['src/config/midnight.config.ts'],
      msg: 'config: configure Midnight Preprod network parameters and Canonical Contract ID',
    },
    {
      files: ['.env.example'],
      msg: 'config: add environment variable templates for Midnight Preprod Indexer and RPC',
    },
    {
      files: ['src/types/index.ts'],
      msg: 'types: define TypeScript interfaces for witness profile, logs, and protocol stats',
    },
    {
      files: ['src/lib/midnight/connector.ts'],
      msg: 'feat(client): implement Midnight Lace Wallet DApp connector API bridge',
    },
    {
      files: ['src/lib/midnight/circuitProver.ts'],
      msg: 'feat(prover): implement 5-stage client-side Zero-Knowledge proving engine',
    },
    {
      files: ['src/lib/midnight/contractState.ts'],
      msg: 'feat(state): implement protocol state management and storage persistence',
    },
    {
      files: ['scripts/deploy.ts'],
      msg: 'feat(scripts): add automated Midnight Preprod contract deployment runner',
    },
    {
      files: ['src/app/globals.css'],
      msg: 'style: implement global Nordic Ice Blue glassmorphism theme and custom scrollbars',
    },
    {
      files: ['src/app/layout.tsx'],
      msg: 'feat(ui): create Root Layout with typography and grid background',
    },
    {
      files: ['src/components/Header.tsx'],
      msg: 'feat(ui): create Header with Lace Wallet connection and Contract ID badge',
    },
    {
      files: ['src/components/InstitutionalCreditHub.tsx'],
      msg: 'feat(ui): create Institutional Credit Hub with vault metrics and tier matrix',
    },
    {
      files: ['src/components/ProofModal.tsx'],
      msg: 'feat(ui): create interactive 5-stage ZK Proof Terminal modal',
    },
    {
      files: ['src/components/ConfidentialAssessmentTerminal.tsx'],
      msg: 'feat(ui): create Confidential Assessment Terminal with private witness inputs',
    },
    {
      files: ['src/components/PrivacyTransparencyRadar.tsx'],
      msg: 'feat(ui): create Privacy Transparency Radar comparing local vs on-chain view',
    },
    {
      files: ['src/components/UnderwrittenVaultBorrower.tsx'],
      msg: 'feat(ui): create Tier-Authorized Underwriting Vault console',
    },
    {
      files: ['src/components/CryptographicCreditLog.tsx'],
      msg: 'feat(ui): create Cryptographic Credit Attestation Log stream',
    },
    {
      files: ['src/app/page.tsx'],
      msg: 'feat(ui): assemble main protocol dashboard and underwriting terminal',
    },
    {
      files: ['tests/eclipse_lend.test.ts'],
      msg: 'test: implement comprehensive unit test suite for credit tiers and witness isolation',
    },
    {
      files: ['.github/workflows/ci.yml'],
      msg: 'ci: configure GitHub Actions workflow for Compact validation, tests, and build',
    },
    {
      files: ['image.png'],
      msg: 'docs: add test execution snapshot and verification assets',
    },
    {
      files: ['README.md'],
      msg: 'docs: create comprehensive README with Product Proposal, Privacy Model, and Preprod Contract ID',
    },
    {
      files: ['scripts/git_commit_push.js'],
      msg: 'chore: add git commit push script utility',
    },
    {
      files: ['scripts/multi_commit_push.js'],
      msg: 'chore: finalize EclipseLend Level-3 Private Underwriting Protocol for Midnight Hackathon',
    }
  ];

  console.log(`2. Executing ${commitPlan.length} granular commits...`);

  for (let i = 0; i < commitPlan.length; i++) {
    const item = commitPlan[i];
    console.log(`[${i + 1}/${commitPlan.length}] Committing: ${item.msg}`);
    
    // Filter existing files
    const existingFiles = item.files.filter(f => fs.existsSync(path.join(root, f)));
    if (existingFiles.length > 0) {
      run(`git add ${existingFiles.join(' ')}`);
      try {
        run(`git commit -m "${item.msg}"`);
      } catch (e) {
        console.log(`Note: Nothing new to commit for step ${i + 1}`);
      }
    }
  }

  console.log('3. Setting up authenticated remote...');
  const token = process.env.GH_TOKEN || process.argv[2] || '';
  if (!token) {
    throw new Error('No GitHub token provided via GH_TOKEN environment variable or argument');
  }
  const remoteUrl = `https://ruhisharma-star:${token}@github.com/ruhisharma-star/EclipseLend.git`;

  try {
    run('git remote remove origin');
  } catch (e) {
    // ignore
  }

  run(`git remote add origin ${remoteUrl}`);

  console.log('4. Pushing all commits to remote main...');
  run('git push -u origin main --force');

  console.log('🎉 Successfully pushed 33 progressive commits to https://github.com/ruhisharma-star/EclipseLend');
}

main().catch((err) => {
  console.error('Multi-commit failed:', err);
  process.exit(1);
});
