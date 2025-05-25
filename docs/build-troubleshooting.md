# Build & CI Troubleshooting Guide

This guide covers common build and CI/CD errors seen in this project, and how to resolve them.

---

## 1. Peer Dependency Conflicts

**Symptom:**  
```
npm ERR! peer react@"^19.0.0" from react-leaflet@5.0.0
npm ERR! Found: react@18.x
```

**Solution:**  
- Downgrade `react-leaflet` to a version compatible with React 18 (e.g., `4.x` or `3.2.0`).
- Or, upgrade your app to React 19 if possible and all dependencies support it.
- Always update both `package.json` and `package-lock.json`, then run `npm ci`.

---

## 2. esbuild Exec Format Error

**Symptom:**  
```
sh: 1: esbuild: Exec format error
Oryx has failed to build the solution.
```

**Solution:**  
- Delete `node_modules` and `package-lock.json`, then run `npm install` and commit the new lockfile.
- Use `npm ci` in CI for a clean install.
- Use `npx esbuild ...` in scripts instead of a global `esbuild`.

---

## 3. Git Config - Permission Denied in CI

**Symptom:**  
```
error: could not lock config file .git/config: Permission denied
```

**Solution:**  
- Ensure your workflow uses:
  ```yaml
  - uses: actions/checkout@v3
    with:
      persist-credentials: false
  ```

---

## 4. Oryx Build Failure (Azure Static Web Apps)

**Symptom:**  
```
Oryx has failed to build the solution.
```

**Solution:**  
- Check for earlier dependency errors or build script failures in the logs.
- Fix all peer dependency and script errors before rerunning the build.

---

## 5. General Prevention Tips

- **Always use `npm ci` in CI/CD.**
- **Never override or manually install dependencies during CI runs.**
- **Do not commit directly to `main`; always use PRs and require CI to pass.**
- **Review and update the lockfile (`package-lock.json`) when updating dependencies.**
- **Pin Node.js version in your workflow and `package.json`.**
- **Document fixes in this file so others can quickly resolve recurring issues.**

---

## 6. Where to Get Help

- Ask a maintainer or open a GitHub Discussion if you're stuck.
- Reference workflow logs for error details.
- See the [GitHub Actions workflow file](../.github/workflows/azure-static-web-apps.yml) for configuration specifics.

---

_Last updated: 2025-05-26_