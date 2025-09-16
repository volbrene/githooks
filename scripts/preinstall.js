#!/usr/bin/env node
/* Postinstall helper:
 * - If dist/init-hooks.js is missing, build the project
 * - Then run dist/init-hooks.js to set up git hooks
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const distEntry = path.join(root, 'dist', 'init-hooks.js');

function run(cmd) {
  execSync(cmd, { stdio: 'inherit', cwd: root });
}

try {
  if (!fs.existsSync(distEntry)) {
    // Build only when needed (fresh checkout or Git dependency)
    run('npm run -s build');
  }
  run(`node ${JSON.stringify(distEntry)}`);
} catch (err) {
  // Keep error visible and fail the lifecycle so you notice problems
  console.error('postinstall failed:', err && err.message ? err.message : err);
  process.exit(1);
}
