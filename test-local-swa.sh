#!/bin/bash
# Local Azure Static Web Apps Testing Script

set -e

echo "🏠 Local SWA Testing Environment"
echo "================================"
echo ""

# Check if SWA CLI is installed
if ! command -v swa &> /dev/null; then
    echo "📦 Installing Azure Static Web Apps CLI..."
    npm install -g @azure/static-web-apps-cli
fi

# Check if Azure Functions Core Tools is installed
if ! command -v func &> /dev/null; then
    echo "⚠️  Azure Functions Core Tools not installed."
    echo "Install with: npm install -g azure-functions-core-tools@4"
fi

# Build the project
echo "🔨 Building project..."
npm run build

# Start SWA emulator
echo ""
echo "🚀 Starting SWA emulator..."
echo "Frontend: http://localhost:4280"
echo "API: http://localhost:4280/api"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start with appropriate directories based on vite.config.ts
swa start dist/public --api-location api --run "npm run dev" --port 4280