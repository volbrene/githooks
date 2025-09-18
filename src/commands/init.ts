import fs from 'node:fs';
import { handleInstall } from './install.js';
import { resetHooksPath } from '../utils/git.js';
import { log } from '../utils/log.js';

/**
 * Handles the 'init' command.
 */
export function handleInit(): void {
  const packageFile = 'package.json';
  const raw = fs.readFileSync(packageFile, 'utf8');
  const pkg = JSON.parse(raw) as Record<string, any>;

  // Ensure scripts object exists
  pkg.scripts = pkg.scripts || {};

  const prepareScript = pkg.scripts.prepare;
  const cliCommand = 'volbrene-git-hooks';

  if (!prepareScript) {
    pkg.scripts.prepare = cliCommand;
    log.ok(`Added "prepare": "${cliCommand}" to package.json`);
  } else if (!prepareScript.includes(cliCommand)) {
    pkg.scripts.prepare = `${prepareScript} && ${cliCommand}`;
    log.step(`Updated existing "prepare" script to also run "${cliCommand}"`);
  }

  // Preserve formatting (tab vs spaces)
  const indent = /\t/.test(raw) ? '\t' : 2;
  fs.writeFileSync(packageFile, JSON.stringify(pkg, null, indent) + '\n');

  // set correct hooks path before installing
  resetHooksPath();

  // Immediately install hooks
  handleInstall();
}
