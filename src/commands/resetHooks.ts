import { assertGitRepo, getHooksPath, resetHooksPath } from '../git.js';
import { log } from '../utils/log.js';
import { fail } from '../utils/errors.js';

export function handleResetHooks(): void {
  assertGitRepo();

  log.step('Resetting core.hooksPath to .git/hooks...');

  try {
    resetHooksPath();

    const output = getHooksPath();
    log.ok(`core.hooksPath is now: ${output}`);
  } catch (e) {
    fail(e, 'Failed to reset hooks');
  }
}
