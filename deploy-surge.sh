#!/bin/bash

# Simple Surge deployment script
echo "Deploying to Surge.sh..."

# Ensure we have a clean build
npm run build

# Deploy to surge
cd dist/public

# Check if index.html exists
if [ ! -f "index.html" ]; then
    echo "Error: index.html not found in dist/public/"
    exit 1
fi

echo "Files to deploy:"
ls -la

echo ""
echo "To complete deployment:"
echo "1. Run: npx surge"
echo "2. Enter any email (like: demo@example.com)"
echo "3. Enter any password"
echo "4. Choose domain (like: tbwa-dashboard.surge.sh)"
echo ""
echo "Or use this command with your choices:"
echo "npx surge . --domain your-chosen-name.surge.sh"