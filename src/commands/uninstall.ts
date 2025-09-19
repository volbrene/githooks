import { fail } from '../utils/errors.js';
import { removeHooksDirAndUnset } from '../utils/git.js';
import { log } from '../utils/log.js';

/**
 * Handles the 'uninstall' command.
 */
export function handleUninstall(): void {
  log.link('Uninstalling hooks...');

  try {
    removeHooksDirAndUnset();

    log.ok('hooks uninstalled successfully');
  } catch (e) {
    fail(e, 'Failed to uninstall hooks');
  }
}
