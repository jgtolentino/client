# CI/CD Prevention Guide

This guide helps prevent common CI/CD mistakes that can break builds and deployments. Follow these practices to maintain a stable, reliable pipeline.

---

## 1. **Lock Down Dependency Versions**
- Always use `npm ci` in CI/CD, not `npm install`, to enforce exact versions from lockfiles.
- Avoid manually overriding dependency versions in CI. Update your `package.json` and `package-lock.json` together, and commit those changes.
- Use tools like [Renovate](https://github.com/renovatebot/renovate) or [Dependabot](https://github.com/dependabot) to automate dependency checks and PRs for updates—with peer dependency checks.

## 2. **Automated Checks and CI**
- Set up required checks on your main branch: builds must pass before merging.
- Enable branch protection rules (Settings > Branches > Main > Require status checks to pass before merging).
- Use a PR workflow for all changes, even your own—never commit directly to main.
- Consider adding a CI job that runs `npm ls` or `npm audit` to catch dependency problems early.

## 3. **Workflow Linting and Templates**
- Use a linter for your workflow YAML (e.g., [action-validator](https://github.com/github/action-validator)) to catch syntax and logical errors.
- Store working workflow templates in a `.github/workflow-templates/` directory for easy reuse.

## 4. **Document Known Issues and Fixes**
- Keep a `CONTRIBUTING.md` or a `docs/build-troubleshooting.md` file that lists common errors and how to resolve them.
- Add comments in your workflow YAML explaining why certain steps exist (e.g., why `persist-credentials: false` is needed).

## 5. **Pinned Node.js Version**
- Explicitly pin your Node.js version in both your workflow and your `engines` field in `package.json` to avoid environment drift.

## 6. **Local Reproducibility**
- Regularly clean and rebuild locally using `rm -rf node_modules && npm ci && npm run build` to catch issues before pushing.
- Use tools like [volta](https://volta.sh/) to pin Node and npm versions per project.

## 7. **Monitoring and Alerts**
- Set up CI/CD notifications in Slack, Teams, or email so you know immediately when something breaks.

## 8. **Code Reviews and Pairing**
- Use code reviews to help catch workflow and dependency mistakes—more eyes spot more issues.
- Pair up on tricky dependency or workflow changes.

---

## Summary Table

| Practice                       | Prevents                   | How?                             |
|--------------------------------|----------------------------|----------------------------------|
| npm ci + lockfile enforcement  | Dependency drift/conflicts | Enforces exact versions          |
| Branch protection + PRs        | Bad commits to main        | Forces CI pass before merging    |
| Automated dependency bots      | Outdated/insecure deps     | PRs with tested updates          |
| Workflow linting               | YAML/config errors         | Catches errors pre-merge         |
| Document errors/fixes          | Repeating mistakes         | Quick reference for all devs     |
| Pinned Node.js version         | Env mismatches             | Consistent local/CI builds       |
| CI notifications               | Slow fix cycles            | Rapid feedback & awareness       |

---

## Quick Checklist Before Pushing

Before pushing any changes that affect dependencies or build configuration:

1. [ ] Run `rm -rf node_modules && npm ci && npm run build` locally
2. [ ] Verify `package.json` and `package-lock.json` are in sync
3. [ ] Check that all peer dependency warnings are resolved
4. [ ] Ensure build scripts use `npx` for CLI tools
5. [ ] Test the production build with `npm run build`
6. [ ] Review CI workflow changes with another developer

---

## Common Pitfalls to Avoid

1. **Never use `--force` or `--legacy-peer-deps` in CI** - Fix the root cause instead
2. **Don't install global packages in CI** - Use `npx` or add to devDependencies
3. **Don't ignore build warnings** - They often become errors in CI
4. **Don't skip lockfile updates** - Always commit both package.json and package-lock.json
5. **Don't merge without CI passing** - Even for "simple" changes

---

_Last updated: 2025-05-26_