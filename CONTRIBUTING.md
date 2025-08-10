# Contributing to octoreport

Thank you for your interest in contributing to the octoreport libraries! We welcome all contributions, including bug reports, enhancements, documentation improvements, and new features. To ensure a smooth collaboration and maintain repository quality, please follow this guide.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setting Up Secret Scanning](#setting-up-secret-scanning)
3. [Branching and Workflow](#branching-and-workflow)
4. [Code Style and Quality](#code-style-and-quality)
5. [Committing Changes](#committing-changes)
6. [Pull Request Process](#pull-request-process)
7. [Reporting Issues](#reporting-issues)
8. [Code of Conduct](#code-of-conduct)

---

## Prerequisites

Before contributing, please ensure you have:

- A GitHub account.
- A local clone of the repository.
- Node.js and npm installed (for development and testing).
- [`detect-secrets`](https://github.com/Yelp/detect-secrets) installed to prevent accidental inclusion of sensitive tokens.

---

## Setting Up Secret Scanning

To protect the repository from inadvertently committing secrets (API tokens, private keys, etc.), we require all contributors to use `detect-secrets`.

1. **Install `detect-secrets`:**

   ```bash
   # Recommended via pipx (safe and isolated)
   brew install pipx
   pipx ensurepath
   pipx install detect-secrets
   ```

2. **Make sure the baseline file exists (already committed to the repo):**

   ```bash
   ls .secrets.baseline
   ```

   Husky pre-commit hook will automatically block commits containing new secrets that are not in the baseline.

3. **If you need to update the baseline after removing or allowlisting false positives:**

   ```bash
   detect-secrets scan \
     --exclude-files 'node_modules/.*' \
     --exclude-files '.*package-lock\.json' \
     --exclude-files '.*yarn\.lock' \
     > .secrets.baseline

   git add .secrets.baseline
   git commit -m "chore(security): update detect-secrets baseline"
   ```

4. **False positives can be ignored inline:**

   ```typescript
   // pragma: allowlist secret
   const DEMO_KEY = 'not-a-real-secret';
   ```

Any attempt to commit a file containing secrets will be blocked locally, and CI will re-check during pull requests and pushes to main.

---

## Branching and Workflow

1. **Create a branch** for each feature or bugfix:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Rebase regularly** against the `main` branch to minimize conflicts:

   ```bash
   git fetch origin
   git rebase origin/main
   ```

3. **Push** your branch to the remote:

   ```bash
   git push origin feature/your-feature-name
   ```

---

## Code Style and Quality

- Follow the existing code style: TypeScript, consistent indentation, and naming conventions.
- Run ESLint and Prettier before committing:

  ```bash
  npm run lint
  npm run format
  ```

- Ensure that any new code includes relevant tests and documentation.

---

## Committing Changes

- Write clear, concise commit messages in the [Conventional Commits](https://www.conventionalcommits.org/) format.
- Include a short description in the first line (max 50 characters) and, if necessary, a more detailed body.

Example:

```text
feat(parser): support new syntax for octoreport config

- Added parsing logic for `--new-flag`
- Updated documentation in README
```

---

## Pull Request Process

1. **Open a Pull Request (PR)** against the `main` branch.
2. **Describe** your changes and link any related issues.
3. **Wait for CI checks** to pass (lint, tests, and detect-secrets scan).
4. Engage in the **review** process: address feedback, make requested changes.
5. Once approved, a maintainer will **merge** your PR.

---

## Reporting Issues

If you discover a bug or have a suggestion, please open an [issue](https://github.com/octoreport/core/issues). Provide clear steps to reproduce the issue and any relevant logs or screenshots.

---

Thank you for contributing to octoreport! Your efforts help improve the library for everyone.
