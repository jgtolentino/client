# Azure Static Web Apps Deployment Guide

This repository is configured for automatic deployment to Azure Static Web Apps.

## Prerequisites

1. An Azure account with an active subscription
2. An Azure Static Web App resource created in the Azure Portal
3. The deployment token from your Azure Static Web App

## Setup Instructions

### 1. Create Azure Static Web App

1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource" → Search for "Static Web App"
3. Configure:
   - **Resource Group**: Create new or use existing
   - **Name**: `your-app-name`
   - **Plan type**: Standard
   - **Region**: Choose closest to your users
   - **Source**: GitHub
   - **Organization**: Your GitHub username
   - **Repository**: `client`
   - **Branch**: `main`

4. Click "Review + create" → "Create"

### 2. Get Deployment Token

1. After creation, go to your Static Web App resource
2. Click "Manage deployment token" in the Overview section
3. Copy the token

### 3. Configure GitHub Secrets

1. Go to your GitHub repository settings
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add:
   - **Name**: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - **Value**: The deployment token you copied

### 4. Deploy

The application will automatically deploy when you:
- Push to the `main` branch
- Create a pull request
- Manually trigger the workflow from Actions tab

## Project Structure

```
client/
├── client/           # React frontend source
│   ├── src/         # React components
│   └── index.html   # Entry point
├── server/          # Express API source
├── api/             # Azure Functions (for SWA)
├── dist/            # Build output
│   ├── public/      # Built frontend files
│   └── index.js     # Built API
└── staticwebapp.config.json  # SWA configuration
```

## Build Process

The build command (`npm run build`) does two things:
1. Builds the React app with Vite → outputs to `dist/public`
2. Builds the Express server with esbuild → outputs to `dist/index.js`

## Deployment Workflow

The GitHub Actions workflow:
1. Checks out the code
2. Runs the build process
3. Deploys to Azure Static Web Apps
4. Creates preview environments for pull requests

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Type check
npm run check
```

## Troubleshooting

### Build Failures
- Check the Actions tab in GitHub for detailed logs
- Ensure all dependencies are in `package.json`
- Verify TypeScript has no errors: `npm run check`

### 404 Errors
- The `staticwebapp.config.json` handles SPA routing
- API routes are automatically proxied to `/api/*`

### API Not Working
- Ensure your Express routes are compatible with Azure Functions
- Check the `api/` directory structure
- Verify the health endpoint at `/api/health`

## Environment Variables

For frontend environment variables:
- Use `VITE_` prefix
- Set in GitHub Secrets for CI/CD
- Access via `import.meta.env.VITE_VARIABLE_NAME`

For API environment variables:
- Set in Azure Portal → Configuration → Application settings
- Access via `process.env.VARIABLE_NAME`

## Monitoring

Once deployed, you can:
- View logs in Azure Portal → Your Static Web App → Logs
- Set up Application Insights for detailed monitoring
- Use the Metrics tab to track usage

## Custom Domain

To add a custom domain:
1. Go to your Static Web App in Azure Portal
2. Click "Custom domains" → "Add"
3. Follow the DNS verification process

## Support

For issues:
1. Check the [Azure Static Web Apps documentation](https://docs.microsoft.com/azure/static-web-apps/)
2. Review the GitHub Actions logs
3. Open an issue in this repository