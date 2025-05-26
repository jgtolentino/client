# 🚀 Deployment Checklist

## Pre-Deployment Verification

### Local Build Check
- [ ] Run `npm run build` locally
- [ ] Verify `dist/public/index.html` exists
- [ ] Check no files > 100MB in dist/
- [ ] Ensure output_location in workflow = "dist/public"
- [ ] Test locally with `npx serve dist/public`

### File Structure Verification
```bash
# Run this to verify structure
npm run build && \
echo "Build output location:" && \
find . -name "index.html" -path "*/dist/*" | head -1
```

### Expected Structure
```
dist/
├── index.js          # Server file (not used in static deployment)
└── public/           # Static files (THIS is what deploys)
    ├── index.html    # Main entry point
    ├── assets/       # JS/CSS bundles
    ├── data/         # Static data files
    └── staticwebapp.config.json
```

## Troubleshooting

### If deployment fails with "content distribution" error:

1. **Check the workflow logs** - Look for the "Verify build output" step
2. **Verify index.html location** - Should be at `dist/public/index.html`
3. **Check output_location** - Must match where index.html is located
4. **Remove large files** - Azure has file size limits

### Common Issues:

| Issue | Solution |
|-------|----------|
| No index.html found | Check build script, ensure Vite outputs to correct location |
| Icon files causing issues | Workflow now auto-removes them |
| Large files (>100MB) | Workflow auto-removes, check dashboard_data_backup.json |
| Wrong output_location | Must be "dist/public" based on current setup |

## Post-Deployment Verification

- [ ] Check deployment URL works
- [ ] Verify all assets load (no 404s in console)
- [ ] Test responsive design on mobile
- [ ] Verify API endpoints (if any) are accessible

## Quick Commands

```bash
# Full deployment test
npm run build && \
ls -la dist/public/index.html && \
echo "✅ Ready to deploy"

# Clean and rebuild
rm -rf dist && \
npm run build

# Test locally before pushing
npx serve dist/public -p 3000
```

## Workflow Features

The current workflow includes:
- ✅ Automatic file cleanup (Icons, .DS_Store, etc.)
- ✅ Size verification and limits
- ✅ Detailed logging for troubleshooting
- ✅ Pre-deployment validation
- ✅ Config file management

## Emergency Fixes

If deployment keeps failing:
1. Check GitHub Actions logs
2. Look for the "Verify build output" step
3. The logs will tell you EXACTLY where files are
4. Update `output_location` to match

Remember: The `output_location` must point to the directory containing `index.html`!