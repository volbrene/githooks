import { execSync, ExecSyncOptions } from 'node:child_process';

/** Run a command and stream stdio to current process (no output returned). */
export function sh(cmd: string, opts: ExecSyncOptions = {}): void {
  execSync(cmd, { stdio: 'inherit', ...opts });
}

/** Run a command and capture its stdout (no live output). */
export function shGetOutput(cmd: string, opts: ExecSyncOptions = {}): string {
  return execSync(cmd, { stdio: 'pipe', ...opts })
    .toString()
    .trim();
}
