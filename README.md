# 🔧 Volbrene – Git Hooks

[![npm version](https://img.shields.io/npm/v/volbrene-git-hooks.svg)](https://www.npmjs.com/package/volbrene-git-hooks)
[![CI](https://github.com/volbrene/githooks/actions/workflows/ci.yml/badge.svg)](https://github.com/volbrene/githooks/actions)

> **Volbrene – Git Hooks** helps you keep your commit messages consistent and enforce [Conventional Commits](https://www.conventionalcommits.org/) automatically.

---

## ✨ Features

- ✅ **Automatic ticket reference** – parses branch names like `feature/IT-1234` and prefixes commit messages.
- ✅ **Conventional Commits support** – supports `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- ✅ **Fallback handling** – unknown branch prefixes default to `chore(...)`.
- ✅ **Easy setup** – installs hooks automatically via `npm install`.

---

## 📦 Installation

Make sure you have [Node.js](https://nodejs.org/) (>=16) and `npm` installed, then run:

```sh
npm install --save-dev volbrene-git-hooks
```

After that, initialize the hooks with:

```sh
npx volbrene-git-hooks init
```

This will add a `prepare` script to your `package.json`:

```jsonc
"scripts": {
  "prepare": "volbrene-git-hooks"
}
```

With this in place, the hooks will be automatically reinstalled whenever you (or your team) run `npm install`.

## 🔗 Available Hooks

The following Git hooks are installed in the hooks directory when the package is installed:

### 📝 prepare-commit-msg

This hook automatically rewrites commit messages based on your current branch name.

- If you are on `feature/IT-1234`, and run:

```bash
git commit -m "add new button"
```

It will rewrite the commit message to:

```
feat(IT-1234): add new button
```

Supported branch prefixes:

| Branch Prefix                            | Resulting Commit Type |
| ---------------------------------------- | --------------------- |
| `feature/*`, `feat/*`                    | `feat(...)`           |
| `bug/*`, `bugfix/*`, `fix/*`, `hotfix/*` | `fix(...)`            |
| `docs/*`                                 | `docs(...)`           |
| `style/*`                                | `style(...)`          |
| `refactor/*`                             | `refactor(...)`       |
| `perf/*`, `performance/*`                | `perf(...)`           |
| `test/*`, `tests/*`                      | `test(...)`           |
| `build/*`                                | `build(...)`          |
| `ci/*`                                   | `ci(...)`             |
| `revert/*`                               | `revert(...)`         |
| `task/*` or unknown                      | `chore(...)`          |

# CLI Commands

## `volbrene-git-hooks install`

Installs or re-installs the Git hooks for the current repository.

- Ensures `.git/hooks` exists
- Copies the `prepare-commit-msg` hook from this package into `.git/hooks`

## `volbrene-git-hooks reset-hooks`

Resets Git’s `core.hooksPath` back to the default `.git/hooks` folder.

- Unsets any custom `core.hooksPath` (e.g. from Husky or other tools)
- Sets the local repository back to `.git/hooks`
- Prints the effective hook directory for verification

## `volbrene-git-hooks uninstall`

Removes all installed Git hooks and unsets `core.hooksPath`.

- Deletes the `.git/hooks` folder (or the directory configured in `core.hooksPath`)
- Attempts to unset `core.hooksPath` (ignored if not set)
- Useful for clean-up or before switching to another hook manager

## `volbrene-git-hooks init`

Sets up automatic hook installation on `npm install`.

- Adds `"prepare": "volbrene-git-hooks"` to your `package.json` scripts
- Ensures hooks will be installed for every developer after `npm install`
- Recommended for teams to keep hooks consistent
- Copies the `prepare-commit-msg` hook from this package into `.git/hooks`

## `volbrene-git-hooks help`

Shows usage information and a list of available commands.
