import fs from 'node:fs';
import { handleInstall } from './install.js';
import { resetHooksPath } from '../git.js';

/**
 * Adds "prepare": "volbrene-git-hooks install" to package.json and runs install.
 */
export function handleInit(): void {
  const packageFile = 'package.json';
  const raw = fs.readFileSync(packageFile, 'utf8');
  const pkg = JSON.parse(raw) as Record<string, any>;

  // Ensure scripts.prepare is set to our install command
  (pkg.scripts ||= {}).prepare = 'volbrene-git-hooks';

  // Preserve formatting (tab vs spaces)
  const indent = /\t/.test(raw) ? '\t' : 2;
  fs.writeFileSync(packageFile, JSON.stringify(pkg, null, indent) + '\n');

  // set correct hooks path before installing
  resetHooksPath();

  // Immediately install hooks
  handleInstall();
}
