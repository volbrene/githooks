import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertGitRepo, getHooksPath, resolveRepoRoot } from '../utils/git.js';
import { log } from '../utils/log.js';
import { fail } from '../utils/errors.js';

/**
 *
 * @param hookName
 * @param sourceDir
 * @param targetDir
 */
function addGitHook(hookName: string, sourceDir: string, targetDir: string): void {
  const srcFile = path.join(sourceDir, hookName);
  const dstFile = path.join(targetDir, hookName);

  // Read as text to preserve shebang/newlines predictably
  const sourceContent = fs.readFileSync(srcFile, 'utf8');

  // Ensure hooks directory exists
  fs.mkdirSync(targetDir, { recursive: true });

  let shouldWrite = true;

  if (fs.existsSync(dstFile)) {
    try {
      const existingContent = fs.readFileSync(dstFile, 'utf8');
      if (existingContent === sourceContent) {
        log.info(`ℹ️ Hook "${hookName}" already exists and is up-to-date – skipping.`);
        shouldWrite = false;
      } else {
        log.info(`🔄 Hook "${hookName}" exists but differs – updating...`);
      }
    } catch (e) {
      log.info(`ℹ️ Could not read existing hook, will overwrite. Reason: ${(e as Error).message}`);
    }
  }

  if (shouldWrite) {
    fs.writeFileSync(dstFile, sourceContent, 'utf8');

    // Make hook executable on Linux/macOS
    if (os.platform() === 'linux' || os.platform() === 'darwin') {
      try {
        fs.chmodSync(dstFile, 0o755);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        log.info(`ℹ️ chmod failed (non-fatal): ${msg}`);
      }
    }

    log.ok(`Hook "${hookName}" written to ${targetDir}`);
  }
}

/**
 * Handles the 'install' command.
 *
 * @returns void
 */
export function handleInstall(): void {
  assertGitRepo();

  log.step('Git Hooks Setup');

  // Resolve repo root
  const repoRoot = resolveRepoRoot();

  if (!fs.existsSync(path.join(repoRoot, '.git'))) {
    log.info('⚠️  No git repository found. Skipping hook setup.');
    return;
  }

  // Determine hooks source dir relative to this module (ESM-safe)
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const hooksSourceDir = path.resolve(moduleDir, '../../hooks');
  log.info(`📂 Using hooks source dir: ${hooksSourceDir}`);

  // Copy hook
  try {
    const targetHooksDir = getHooksPath();
    addGitHook('prepare-commit-msg', hooksSourceDir, targetHooksDir);
  } catch (e) {
    fail(e, 'Failed to add hook');
  }
}
