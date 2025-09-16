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

Make sure you have [Node.js](https://nodejs.org/) and `npm` installed, then run:

```sh
npm install --save-dev volbrene-git-hooks
```

The preinstall script in this package will automatically place the hooks into .git/hooks/.

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
- Makes the hook executable on Linux/macOS
- Can be run manually or in your `package.json` (`prepare` or `postinstall` script)

## `volbrene-git-hooks reset-hooks`

Resets Git’s `core.hooksPath` back to the default `.git/hooks` folder.

- Unsets any custom `core.hooksPath` (e.g. from Husky or other tools)
- Sets the local repository back to `.git/hooks`
- Prints the effective hook directory for verification
