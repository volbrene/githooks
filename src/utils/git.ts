import fs from 'node:fs';
import { sh, shGetOutput } from './exec.js';
import { fail } from './errors.js';
import path from 'node:path';

/** Ensure we are inside a git repository (cheap sanity check). */
export function assertGitRepo(): void {
  try {
    shGetOutput('git rev-parse --is-inside-work-tree');
  } catch (e) {
    fail(e, 'Not a git repository');
  }
}

/**
 * Resolve repository root (prefers Git, falls back to INIT_CWD heuristic).
 */
export function resolveRepoRoot(): string {
  try {
    const top = shGetOutput('git rev-parse --show-toplevel');
    if (top) return top;
  } catch {
    // ignore
  }

  const initCwd = process.env.INIT_CWD || process.cwd();
  if (
    !fs.existsSync(path.join(initCwd, '.git')) &&
    fs.existsSync(path.join(initCwd, '..', '.git'))
  ) {
    return path.resolve(initCwd, '..');
  }
  return initCwd;
}

/** Get the effective hooks path (respects core.hooksPath). */
export function getHooksPath(): string {
  return shGetOutput('git rev-parse --git-path hooks');
}

/** Reset core.hooksPath to .git/hooks */
export function resetHooksPath(): void {
  // Unset core.hooksPath if present (ignore failures)
  try {
    sh('git config --unset core.hooksPath');
  } catch {}
  // Set local hooks path back to .git/hooks
  sh('git config --local core.hooksPath .git/hooks');
}

/** Remove hooks dir and unset core.hooksPath (ignore unset errors). */
export function removeHooksDirAndUnset(): void {
  const hooksPath = getHooksPath();
  fs.rmSync(hooksPath, { recursive: true, force: true });
  try {
    sh('git config --unset core.hooksPath');
  } catch {}
}
