# Volbrene - Git Hooks

This npm package enables easy configuration and management of Git Hooks for your project.#

## Installation

Make sure you have Node.js and npm installed. Install the package with the following command:

```sh
npm install --save-dev volbrene-git-hooks
```

## Available Hooks

The following Git hooks are installed in the hooks directory when the package is installed:

### pre-commit-msg

This hook automatically parses the commit message based on the feature branch (e.g., feature/IT-1234) to include the ticket number in the commit message.

Example: [IT-1234] test commit
