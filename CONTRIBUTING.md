# Contributing to Client Dashboard

Thank you for considering contributing to the Client Dashboard project! To ensure a smooth development experience for everyone, please read and follow these guidelines.

## Getting Started

1. **Clone the repository:**
   ```
   git clone https://github.com/jgtolentino/client.git
   cd client
   ```

2. **Install dependencies:**
   - Use Node.js version specified in `package.json` (`engines.node`) or the version used in CI (see workflow).
   - Always use:
     ```
     npm ci
     ```
     _This ensures your dependencies exactly match the lockfile._

3. **Run the app locally:**
   ```
   npm start
   ```

4. **Build the app:**
   ```
   npm run build
   ```

## Workflow Guidelines

- **Branching:**  
  - Create a feature branch from `main` with a descriptive name.
  - Example: `git checkout -b fix/map-zoom-bug`

- **Pull Requests:**  
  - All changes must go through a PR.
  - Do **not** commit directly to `main`.
  - Ensure your branch is up to date with `main` before opening a PR.

- **Commit Messages:**  
  - Use clear, descriptive messages (e.g., `fix: correct peer-dependency for react-leaflet`).

- **Required Checks:**  
  - All PRs must pass CI/CD before merging.
  - Code review from at least one maintainer is required.

## Common Build & Dependency Issues

See [`docs/build-troubleshooting.md`](docs/build-troubleshooting.md) for solutions to frequent problems.

For preventing CI/CD issues, see [`docs/ci-cd-prevention-guide.md`](docs/ci-cd-prevention-guide.md).

- **Never override dependency versions in CI.**  
  If you need to update a dependency, update `package.json` and `package-lock.json` together, then commit both.

- **Use `npx` for CLI tools in scripts.**  
  Avoid global installs unless absolutely necessary.

- **Do not change workflow files without review.**  
  Any GitHub Actions or workflow changes must be reviewed for security and stability.

## Reporting Issues

- Use the GitHub issue tracker to report bugs or request features.
- When reporting a build or CI issue, please include:
  - Steps to reproduce
  - Error messages and log output
  - What you tried to resolve it

## Code Style

- Follow the existing code conventions.
- Use Prettier and ESLint (if set up) before committing.

## Documentation

- Update documentation for any changes in behavior or configuration.
- Major changes should be reflected in `README.md` or relevant docs.

---

Thank you for helping make this project better!