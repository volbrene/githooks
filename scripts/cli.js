#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const command = args[0] || '';

function sh(cmd, opts = {}) {
  return execSync(cmd, { stdio: 'inherit', ...opts });
}

switch (command) {
  case 'reset-hooks':
    console.log('🔧 Resetting core.hooksPath to .git/hooks...');
    try {
      try {
        sh('git config --unset core.hooksPath');
      } catch {}
      sh('git config --local core.hooksPath .git/hooks');
      const output = execSync('git rev-parse --git-path hooks').toString().trim();
      console.log(`✅ core.hooksPath is now: ${output}`);
    } catch (e) {
      console.error(`❌ Failed to reset hooks: ${e.message}`);
      process.exit(1);
    }
    break;

  case 'install':
    console.log('🔗 Installing hooks via init-hooks.js...');
    try {
      const initPath = path.resolve(__dirname, 'init-hooks.js');
      sh(`node ${JSON.stringify(initPath)}`);
      console.log('✅ init-hooks.js executed successfully');
    } catch (e) {
      console.error(`❌ Failed to execute init-hooks.js: ${e.message}`);
      process.exit(1);
    }
    break;

  default:
    console.log(`ℹ️ Unknown command: ${command}`);
    console.log('Usage: volbrene-git-hooks [reset-hooks|install]');
    process.exit(1);
}
