#!/usr/bin/env node
import { handleInit } from './commands/init.js';
import { handleInstall } from './commands/install.js';
import { handleResetHooks } from './commands/resetHooks.js';
import { handleUninstall } from './commands/uninstall.js';
import { Command } from './types.js';
import { isGitRepository } from './utils/git.js';
import { log } from './utils/log.js';

function printUsage(): void {
  log.info('Usage: volbrene-git-hooks <command>\n');
  log.info('Commands:');
  log.info('  init          Add prepare script and install hooks');
  log.info('  reset-hooks   Reset core.hooksPath to .git/hooks');
  log.info('  install       Install hooks');
  log.info('  uninstall     Remove hooks folder and unset core.hooksPath');
}

(function main() {
  const [, , ...argv] = process.argv;
  const command = (argv[0] || 'install') as Command;

  if (!isGitRepository()) {
    log.info('Not a git repository, skipping...');

    process.exit(0);
  }

  switch (command) {
    case 'init':
      handleInit();
      break;
    case 'reset-hooks':
      handleResetHooks();
      break;
    case 'install':
      handleInstall();
      break;
    case 'uninstall':
      handleUninstall();
      break;
    case 'help':
    case '':
    default:
      if (command && command !== 'help') {
        log.info(`ℹ️ Unknown command: ${command}`);
      }
      printUsage();
      process.exit(command ? 1 : 0);
  }
})();
