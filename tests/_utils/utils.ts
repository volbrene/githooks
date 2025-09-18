import { execSync } from 'node:child_process';
import path from 'node:path';
import * as fs from 'node:fs';

export function sh(cmd: string, cwd: string): string {
  return execSync(cmd, { cwd, stdio: 'pipe' }).toString().trim();
}

export function fileExists(p: string): boolean {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export const getHooksDir = (cwd: string) => {
  const raw = sh('git rev-parse --git-path hooks', cwd).trim();
  return path.isAbsolute(raw) ? raw : path.resolve(cwd, raw);
};
