import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { fileExists, sh } from './_utils/utils';

const NODE = process.execPath;
const CLI = path.resolve('dist/cli.js');

function setupGitRepo(): { cwd: string; hooksDir: string } {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'pcm-'));

  sh('git init -q', cwd);
  sh('git config user.name "Test"', cwd);
  sh('git config user.email "test@example.com"', cwd);
  fs.writeFileSync(path.join(cwd, 'README.md'), 'init');
  sh('git add README.md', cwd);
  sh('git commit -qm "chore: init"', cwd);

  const hooksDir = sh('git rev-parse --git-path hooks', cwd);

  return { cwd, hooksDir };
}

function runCLI(args: string[], cwd: string): string {
  try {
    return execSync(`${NODE} ${JSON.stringify(CLI)} ${args.join(' ')}`, {
      cwd,
      stdio: 'pipe',
    }).toString();
  } catch (e: any) {
    return (e?.stdout?.toString?.() || '') + (e?.stderr?.toString?.() || '');
  }
}

describe('volbrene-git-hooks CLI', () => {
  test('init writes prepare script into package.json (no install)', () => {
    const { cwd } = setupGitRepo();

    // create minimal package.json
    const pkgPath = path.join(cwd, 'package.json');
    fs.writeFileSync(
      pkgPath,
      JSON.stringify({ name: 'tmp', version: '1.0.0', scripts: {} }, null, 2)
    );

    const out = runCLI(['init'], cwd);
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    expect(pkg.scripts.prepare).toBe('volbrene-git-hooks');
    expect(out).toMatch(/Git Hooks Setup/);
  });

  test('init hooks', () => {
    const { cwd, hooksDir } = setupGitRepo();

    const out = runCLI([], cwd);
    // expect(fileExists(path.join(hooksDir, 'prepare-commit-msg'))).toBe(true);

    expect(out).toContain('🔧 Git Hooks Setup');
  });

  test('install installs (idempotent)', () => {
    const { cwd, hooksDir } = setupGitRepo();

    // first install
    const out = runCLI(['install'], cwd);
    // expect(fileExists(path.join(hooksDir, 'prepare-commit-msg'))).toBe(true);
    expect(out).toContain('🔧 Git Hooks Setup');

    // seccound install
    const out2 = runCLI(['install'], cwd);
    // expect(fileExists(path.join(hooksDir, 'prepare-commit-msg'))).toBe(true);
    expect(out2).toMatch(/up-to-date|already exists/i);
  });

  test('reset-hooks sets core.hooksPath back to .git/hooks', () => {
    const { cwd } = setupGitRepo();

    // first set hooksPath to something else
    sh('git config core.hooksPath "temp"', cwd);

    // then reset via CLI
    const out = runCLI(['reset-hooks'], cwd);

    const effective = sh('git rev-parse --git-path hooks', cwd);
    expect(effective).toMatch(/.git\/hooks/i);
    expect(out).toMatch(/Resetting core.hooksPath/i);
  });

  test('uninstall removes hooks and unsets hooksPath', () => {
    const { cwd } = setupGitRepo();

    runCLI(['install'], cwd);

    // get absoliute hooks dir (in case core.hooksPath is set to absolute path)
    const hooksDirRaw = sh('git rev-parse --git-path hooks', cwd);
    const hooksDir = path.isAbsolute(hooksDirRaw) ? hooksDirRaw : path.resolve(cwd, hooksDirRaw);

    expect(fileExists(path.join(hooksDir, 'prepare-commit-msg'))).toBe(true);

    const out = runCLI(['uninstall'], cwd);

    // get hooks dir again (in case uninstall changed it)
    const hooksDirAfterRaw = sh('git rev-parse --git-path hooks', cwd);
    const hooksDirAfter = path.isAbsolute(hooksDirAfterRaw)
      ? hooksDirAfterRaw
      : path.resolve(cwd, hooksDirAfterRaw);

    expect(fileExists(path.join(hooksDirAfter, 'prepare-commit-msg'))).toBe(false);
    expect(out).toMatch(/uninstalled/i);
  });

  test('help prints usage', () => {
    const { cwd } = setupGitRepo();
    const out = runCLI(['help'], cwd);
    expect(out).toMatch(/Usage: volbrene-git-hooks/i);
  });
});
