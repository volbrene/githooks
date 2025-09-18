import { assertGitRepo, removeHooksDirAndUnset } from '../git.js';
import { log } from '../utils/log.js';
import { fail } from '../utils/errors.js';

/**
 * Handles the 'uninstall' command.
 */
export function handleUninstall(): void {
  assertGitRepo();

  log.link('Uninstalling hooks...');

  try {
    removeHooksDirAndUnset();

    log.ok('hooks uninstalled successfully');
  } catch (e) {
    fail(e, 'Failed to uninstall hooks');
  }
}
