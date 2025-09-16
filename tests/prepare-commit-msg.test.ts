import { execSync, spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

const HOOK_PATH = process.env.HOOK_PATH || path.resolve(process.cwd(), 'hooks/prepare-commit-msg');
const BASH = process.env.BASH || 'bash';

function run(cmd: string, cwd: string) {
  return execSync(cmd, { cwd, stdio: 'pipe' }).toString();
}

function setupRepo(): { workdir: string; msgFile: string } {
  const workdir = fs.mkdtempSync(path.join(os.tmpdir(), 'pcm-'));
  fs.copyFileSync(HOOK_PATH, path.join(workdir, 'prepare-commit-msg'));
  fs.chmodSync(path.join(workdir, 'prepare-commit-msg'), 0o755);

  run('git init -q', workdir);
  run('git config user.name "Test"', workdir);
  run('git config user.email "test@example.com"', workdir);
  fs.writeFileSync(path.join(workdir, 'README.md'), 'init');
  run('git add README.md', workdir);
  run('git commit -qm "chore: init"', workdir);

  const msgFile = path.join(workdir, 'COMMIT_MSG.txt');
  return { workdir, msgFile };
}

/**
 * Run the prepare-commit-msg hook like Git would.
 * @param workdir repo path
 * @param msgFile path to temp commit message file
 * @param branch branch to checkout/create
 * @param raw initial commit message body
 * @param source optional SOURCE arg passed by Git (e.g. "merge", "squash", "template"...)
 */
function runHook(
  workdir: string,
  msgFile: string,
  branch: string,
  raw: string,
  source?: string
): string {
  // Create (or switch to) the branch
  try {
    run(`git checkout -qb "${branch}"`, workdir);
  } catch {
    run(`git checkout "${branch}"`, workdir);
  }
  // Write the raw commit message to the temp file
  fs.writeFileSync(msgFile, raw, 'utf8');
  // Execute the hook (like Git would)
  const args = [path.join(workdir, 'prepare-commit-msg'), msgFile];
  if (source) args.push(source);
  spawnSync(BASH, args, { cwd: workdir });
  // Return the (possibly rewritten) commit message
  return fs.readFileSync(msgFile, 'utf8').trim();
}

describe('prepare-commit-msg', () => {
  test('feat', () => {
    const { workdir, msgFile } = setupRepo();
    expect(runHook(workdir, msgFile, 'feature/IT-1_test-1234', 'Add feature')).toBe(
      'feat(IT-1): Add feature'
    );
    expect(runHook(workdir, msgFile, 'feature/IT-1', 'Add feature')).toBe(
      'feat(IT-1): Add feature'
    );
  });

  test('unlimited digits in ticket id', () => {
    const { workdir, msgFile } = setupRepo();
    expect(
      runHook(workdir, msgFile, 'feature/IT-000000000000_add_bla_blub', 'COmmit nachricht')
    ).toBe('feat(IT-000000000000): COmmit nachricht');
  });

  test('fix', () => {
    const { workdir, msgFile } = setupRepo();
    expect(runHook(workdir, msgFile, 'fix/IT-2', 'Fix bug')).toBe('fix(IT-2): Fix bug');
    expect(runHook(workdir, msgFile, 'bug/IT-2', 'Fix bug')).toBe('fix(IT-2): Fix bug');
  });

  test('docs', () => {
    const { workdir, msgFile } = setupRepo();
    expect(runHook(workdir, msgFile, 'docs/IT-3', 'Update docs')).toBe('docs(IT-3): Update docs');
  });

  test('style', () => {
    const { workdir, msgFile } = setupRepo();
    expect(runHook(workdir, msgFile, 'style/IT-4', 'Format code')).toBe('style(IT-4): Format code');
  });

  test('refactor', () => {
    const { workdir, msgFile } = setupRepo();
    expect(runHook(workdir, msgFile, 'refactor/IT-5', 'Refactor module')).toBe(
      'refactor(IT-5): Refactor module'
    );
  });

  test('perf', () => {
    const { workdir, msgFile } = setupRepo();
    expect(runHook(workdir, msgFile, 'perf/IT-6', 'Improve performance')).toBe(
      'perf(IT-6): Improve performance'
    );
  });

  test('test', () => {
    const { workdir, msgFile } = setupRepo();
    expect(runHook(workdir, msgFile, 'test/IT-7', 'Add tests')).toBe('test(IT-7): Add tests');
  });

  test('build', () => {
    const { workdir, msgFile } = setupRepo();
    expect(runHook(workdir, msgFile, 'build/IT-8', 'Update deps')).toBe('build(IT-8): Update deps');
  });

  test('ci', () => {
    const { workdir, msgFile } = setupRepo();
    expect(runHook(workdir, msgFile, 'ci/IT-9', 'Adjust CI config')).toBe(
      'ci(IT-9): Adjust CI config'
    );
  });

  test('chore', () => {
    const { workdir, msgFile } = setupRepo();
    expect(runHook(workdir, msgFile, 'chore/IT-10', 'Housekeeping')).toBe(
      'chore(IT-10): Housekeeping'
    );
  });

  test('revert', () => {
    const { workdir, msgFile } = setupRepo();
    expect(runHook(workdir, msgFile, 'revert/IT-11', 'Rollback change')).toBe(
      'revert(IT-11): Rollback change'
    );
  });

  test('unknown → chore', () => {
    const { workdir, msgFile } = setupRepo();
    expect(runHook(workdir, msgFile, 'maintenance/IT-12', 'Misc')).toBe('chore(IT-12): Misc');
    expect(runHook(workdir, msgFile, 'task/IT-12', 'Misc')).toBe('chore(IT-12): Misc');
  });

  test('no ticket ID → type without parentheses', () => {
    const { workdir, msgFile } = setupRepo();

    // feature → feat:
    expect(runHook(workdir, msgFile, 'feature/no-ticket', 'No ticket')).toBe('feat: No ticket');

    // fix synonyms → fix:
    expect(runHook(workdir, msgFile, 'bug/no-ticket', 'Fix something')).toBe('fix: Fix something');
    expect(runHook(workdir, msgFile, 'hotfix/no-ticket', 'Quick patch')).toBe('fix: Quick patch');

    // unknown → chore:
    expect(runHook(workdir, msgFile, 'maintenance/no-ticket', 'Misc work')).toBe(
      'chore: Misc work'
    );
  });

  // ─────────────────────────────────────────────────────────────
  // New cases: early exits / Git-generated messages
  // ─────────────────────────────────────────────────────────────

  test('merge commit (SOURCE=merge) stays unchanged', () => {
    const { workdir, msgFile } = setupRepo();
    const raw = "Merge branch 'main' of github.com:acme/repo";
    expect(runHook(workdir, msgFile, 'feature/IT-1_x', raw, 'merge')).toBe(raw);
  });

  test('squash commit (SOURCE=squash) stays unchanged', () => {
    const { workdir, msgFile } = setupRepo();
    const raw = 'Squash commit message produced by Git';
    expect(runHook(workdir, msgFile, 'feature/IT-1_x', raw, 'squash')).toBe(raw);
  });

  test('git-generated Merge header (no SOURCE) stays unchanged', () => {
    const { workdir, msgFile } = setupRepo();
    const raw = "Merge branch 'release' into main";
    expect(runHook(workdir, msgFile, 'feature/IT-1_x', raw)).toBe(raw);
  });

  test('git-generated Revert header stays unchanged', () => {
    const { workdir, msgFile } = setupRepo();
    const raw = 'Revert "feat(IT-1): add X"';
    expect(runHook(workdir, msgFile, 'feature/IT-1_x', raw)).toBe(raw);
  });

  test('fixup! message is respected (no rewrite)', () => {
    const { workdir, msgFile } = setupRepo();
    const raw = 'fixup! feat(IT-1): add login';
    expect(runHook(workdir, msgFile, 'feature/IT-1_x', raw)).toBe(raw);
  });

  test('existing valid conventional header is respected (no rewrite)', () => {
    const { workdir, msgFile } = setupRepo();
    const raw = 'feat(IT-99): already good';
    expect(runHook(workdir, msgFile, 'feature/IT-1_x', raw)).toBe(raw);
  });
});
