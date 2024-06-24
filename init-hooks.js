const fs = require("fs"),
  path = require("path"),
  os = require("os"),
  exec = require("child_process").exec;

console.log(`************************** Git Hooks **************************`);
console.log(`Check git hooks status`);

////////////////////// Check node Version ///////////////////
let ver = process.versions.node;
ver = ver.split(".")[0];
if (ver < 6) {
  console.log(
    "\x1b[41m\x1b[30mDie Node Version muss 6 oder aktueller sein",
    "\x1b[0m"
  );
  return;
}

////////////////////// FUNCTIONS ///////////////////

// add git hooks
let addGitHook = (hookName, sourcePath, targetPath) => {
  const data = fs.readFileSync(path.join(sourcePath, hookName));

  try {
    fs.mkdirSync(targetPath);
  } catch (e) {
    //console.warn('Folder exists');
  }

  // sync file
  if (!fs.existsSync(path.join(targetPath, hookName))) {
    fs.writeFileSync(path.join(targetPath, hookName), data);

    // Make pre commit hook executable on linux and mac
    if (os.platform() === "linux" || os.platform() === "darwin") {
      exec(
        "chmod +x " + hookName,
        {
          cwd: path.join(targetPath),
        },
        function (err, stdout, stderr) {
          if (err) {
            console.error(err.stack);
          }

          console.warn(stdout);
        }
      );
    }

    console.warn("Hook " + hookName + " added to " + targetPath);
  }
};

////////////////////// INIT ///////////////////
let gitPath = process.env.INIT_CWD;

// Check if git is inside app folder
if (
  !fs.existsSync(`${process.env.INIT_CWD}/.git`) &&
  fs.existsSync(`${process.env.INIT_CWD}/../.git`)
) {
  gitPath = `${process.env.INIT_CWD}/../`;
}

// remove old hooks folder
try {
  fs.rmSync(path.join(gitPath, ".git", "hooks"), {
    recursive: true,
    force: true,
  });

  console.log(`Remove old hooks folder`);
} catch (e) {
  //console.warn('Folder exists');
}

// Copy pre commit hooks
try {
  addGitHook(
    "prepare-commit-msg",
    path.join("./", "hooks"),
    path.join(gitPath, ".git", "hooks")
  );
} catch (e) {
  //console.warn('Folder exists');
}

console.log(
  `************************** End Git Hooks **************************`
);
