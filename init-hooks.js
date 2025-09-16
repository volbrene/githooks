const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec, execSync } = require('child_process');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔧  Git Hooks Setup');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

////////////////////// Check node Version ///////////////////
let ver = process.versions.node;
ver = ver.split('.')[0];
if (ver < 6) {
  console.error(`❌ Node.js >= 6 required. Detected: ${process.version}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  process.exit(1);
}

////////////////////// FUNCTIONS ///////////////////

// add git hooks
let addGitHook = (hookName, sourcePath, targetPath) => {
  const data = fs.readFileSync(path.join(sourcePath, hookName));

  try {
    fs.mkdirSync(targetPath);
  } catch {
    // folder already exists → ignore
  }

  if (!fs.existsSync(path.join(targetPath, hookName))) {
    fs.writeFileSync(path.join(targetPath, hookName), data);

    // Make pre-commit hook executable on linux and mac
    if (os.platform() === 'linux' || os.platform() === 'darwin') {
      exec('chmod +x ' + hookName, { cwd: path.join(targetPath) }, function (err, stdout) {
        if (err) console.error(`❌ chmod failed: ${err.message}`);
        if (stdout.trim()) console.log(`ℹ️ chmod output: ${stdout.trim()}`);
      });
    }

    console.log(`✅ Hook "${hookName}" added to ${targetPath}`);
  } else {
    console.log(`ℹ️ Hook "${hookName}" already exists in ${targetPath}`);
  }
};

////////////////////// INIT ///////////////////
let gitPath = process.env.INIT_CWD;

console.log('📍 Resolving repository root...');
if (
  !fs.existsSync(`${process.env.INIT_CWD}/.git`) &&
  fs.existsSync(`${process.env.INIT_CWD}/../.git`)
) {
  gitPath = `${process.env.INIT_CWD}/../`;
}

// ensure we are in a git repo
if (!fs.existsSync(path.join(gitPath, '.git'))) {
  console.log('⚠️  No git repository found. Skipping hook setup.');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  process.exit(0);
}

console.log('🧹 Removing old hooks folder if it exists...');
try {
  fs.rmSync(path.join(gitPath, '.git', 'hooks'), { recursive: true, force: true });
  console.log('✅ Old hooks folder removed');
} catch {
  console.log('ℹ️ No old hooks folder found');
}

console.log('🔗 Installing prepare-commit-msg hook...');
try {
  addGitHook('prepare-commit-msg', path.join('./', 'hooks'), path.join(gitPath, '.git', 'hooks'));
} catch (e) {
  console.error(`❌ Failed to add hook: ${e.message}`);
}

console.log('✅ Git Hooks setup completed');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
