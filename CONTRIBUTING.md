# 🤝 Contributing to Hacktoberfest Copilot

Thank you for your interest in contributing to Hacktoberfest Copilot! This guide will help you get started.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branch Naming Convention](#branch-naming-convention)
- [Commit Message Format](#commit-message-format)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/HacktoberFest-Team-GrandCoders.git
   cd HacktoberFest-Team-GrandCoders
   ```
3. **Add the upstream remote:**
   ```bash
   git remote add upstream https://github.com/AsmitAnand/HacktoberFest-Team-GrandCoders.git
   ```
4. **Set up the development environment** (see [README.md](README.md#-getting-started))

## Development Workflow

1. **Sync with upstream:**
   ```bash
   git checkout main
   git pull upstream main
   ```
2. **Create a feature branch:**
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. **Make your changes** with small, focused commits
4. **Push your branch:**
   ```bash
   git push origin feat/your-feature-name
   ```
5. **Open a Pull Request** against `main`

## Branch Naming Convention

Use the following prefixes for your branches:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feat/` | New feature | `feat/repo-analyzer` |
| `fix/` | Bug fix | `fix/api-rate-limit` |
| `docs/` | Documentation only | `docs/setup-instructions` |
| `chore/` | Build, CI, tooling | `chore/eslint-config` |
| `refactor/` | Code restructuring | `refactor/api-client` |
| `test/` | Adding tests | `test/issue-explainer` |

## Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>: <short description> (#<issue-number>)

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, semicolons, etc.) |
| `refactor` | Code restructuring without changing behavior |
| `test` | Adding or updating tests |
| `chore` | Build process, CI, or tooling changes |

### Examples

```bash
feat: add repo analyzer endpoint (#8)
fix: handle GitHub API rate limiting (#19)
docs: update setup instructions in README (#22)
chore: add ESLint configuration (#20)
test: add unit tests for AI service (#11)
```

### Rules

- Use **lowercase** for the description
- **No period** at the end
- Keep the first line under **72 characters**
- Reference the **issue number** when applicable

## Pull Request Process

### Before Submitting

- [ ] Your code follows the project's code style
- [ ] You've tested your changes locally
- [ ] You've added/updated tests if applicable
- [ ] You've updated documentation if applicable
- [ ] Your branch is up to date with `main`

### PR Description Template

```markdown
## What does this PR do?

Brief description of the changes.

## Related Issue

Closes #<issue-number>

## Changes Made

- Change 1
- Change 2
- Change 3

## How to Test

1. Step 1
2. Step 2
3. Expected result

## Screenshots (if applicable)

## Checklist

- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] PR title follows commit convention
```

### Review Process

1. Open a **Draft PR** early (even before code is complete)
2. Mark as **Ready for Review** when done
3. A teammate must review and approve before merging
4. Address all review comments
5. **Squash merge** into `main`

## Code Style

### Python (Backend)

- Follow [PEP 8](https://pep8.org/)
- Use type hints for function parameters and returns
- Use docstrings for all public functions
- Maximum line length: 100 characters
- Use `ruff` for linting

### JavaScript (Frontend)

- Use ES6+ features
- Use functional components with hooks
- Use `const` by default, `let` when reassignment is needed
- Use template literals for string interpolation
- Use `ESLint` for linting

## Reporting Bugs

Use the [GitHub Issues](https://github.com/AsmitAnand/HacktoberFest-Team-GrandCoders/issues) page. Include:

1. **Description:** What happened?
2. **Steps to Reproduce:** How can we recreate the bug?
3. **Expected Behavior:** What should have happened?
4. **Actual Behavior:** What actually happened?
5. **Environment:** OS, browser, Node/Python version
6. **Screenshots:** If applicable

## Suggesting Features

Open a GitHub Issue with:

1. **Feature description:** What do you want?
2. **Use case:** Why is this useful?
3. **Proposed solution:** How should it work?
4. **Alternatives considered:** Other approaches you thought about

---

Thank you for contributing! 🎉
