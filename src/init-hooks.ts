#!/usr/bin/env node
/* eslint-disable no-console */
// Write hooks path to .git/hooks and install hooks with nice logs.

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as os from 'os';
import * as path from 'path';

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔧  Setting up Git Hooks');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const major = Number(process.versions.node.split('.')[0]);
if (major < 16) {
  console.error(`❌ Node.js >= 16 required. Detected: ${process.version}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  process.exit(1);
}

function sh(cmd: string, opts: { cwd?: string } = {}): string {
  return execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'], ...opts })
    .toString()
    .trim();
}
function safeSh(cmd: string, opts: { cwd?: string } = {}): string {
  try {
    return sh(cmd, opts);
  } catch {
    return '';
  }
}
function ensureDirSync(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

console.log('📍 Resolving repository root...');
const repoRoot = safeSh('git rev-parse --show-toplevel') || process.env.INIT_CWD || process.cwd();

if (!repoRoot || !fs.existsSync(path.join(repoRoot, '.git'))) {
  console.warn('⚠️  Not inside a Git repository. Skipping hook setup.');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  process.exit(0);
}

// Force hooks path to default .git/hooks (local scope only)
safeSh('git config --unset core.hooksPath', { cwd: repoRoot });
safeSh('git config --local core.hooksPath .git/hooks', { cwd: repoRoot });

let hooksDir =
  safeSh('git rev-parse --git-path hooks', { cwd: repoRoot }) ||
  path.join(repoRoot, '.git', 'hooks');
console.log(`📂 Using hooks directory: ${hooksDir}`);
ensureDirSync(hooksDir);

async function addGitHook(hookName: string, sourceDir: string, targetDir: string) {
  const src = path.join(sourceDir, hookName);
  if (!fs.existsSync(src)) {
    console.warn(`⚠️  Hook source not found: ${src}`);
    return;
  }

  const dest = path.join(targetDir, hookName);
  try {
    const data = await fsp.readFile(src);
    await fsp.writeFile(dest, data, { mode: 0o755 });
    if (os.platform() === 'linux' || os.platform() === 'darwin') {
      safeSh(`chmod +x "${dest}"`);
    }
    console.log(`✅ Hook "${hookName}" installed to ${dest}`);
  } catch (err: any) {
    console.error(`❌ Failed to install hook "${hookName}": ${err?.message || err}`);
  }
}

(async () => {
  console.log('🔗 Installing hooks...');
  // Adjust if your hooks folder is elsewhere:
  const localHooksFolder = path.join(process.cwd(), 'hooks');

  await addGitHook('prepare-commit-msg', localHooksFolder, hooksDir);
  // Optionally:
  // await addGitHook('commit-msg', localHooksFolder, hooksDir);

  console.log('✅ Git hooks setup completed.');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
})().catch((err) => {
  console.error(`❌ Unhandled error during hooks setup: ${err?.message || err}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  process.exit(1);
});
