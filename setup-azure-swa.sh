#!/bin/bash
# Azure Static Web Apps Setup Script
# Following the production-ready pattern from initial guidance

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Azure Static Web Apps Setup${NC}"
echo -e "${BLUE}===========================${NC}"

# Configuration matching initial guidance
APP_NAME="client-app-$(date +%Y%m%d%H%M%S)"
RESOURCE_GROUP="rg-client-app"
LOCATION="eastus2"
GITHUB_REPO="jgtolentino/client"

# Check Azure CLI
if ! command -v az &> /dev/null; then
    echo -e "${RED}Error: Azure CLI not installed${NC}"
    echo "Install: https://docs.microsoft.com/cli/azure/install-azure-cli"
    exit 1
fi

# Check GitHub CLI
if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error: GitHub CLI not installed${NC}"
    echo "Install: https://cli.github.com"
    exit 1
fi

# Login checks
echo "Checking Azure login..."
az account show &> /dev/null || az login

echo "Checking GitHub login..."
gh auth status &> /dev/null || gh auth login

# Create resource group
echo "Creating resource group..."
az group create --name "$RESOURCE_GROUP" --location "$LOCATION" --output none 2>/dev/null || true

# Create Static Web App
echo "Creating Static Web App: $APP_NAME"
az staticwebapp create \
    --name "$APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --location "$LOCATION" \
    --sku Standard

# Get deployment token
echo "Getting deployment token..."
DEPLOYMENT_TOKEN=$(az staticwebapp secrets list \
    --name "$APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --query "properties.apiKey" -o tsv)

# Add to GitHub secrets
echo "Adding token to GitHub secrets..."
gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN \
    --body "$DEPLOYMENT_TOKEN" \
    --repo "$GITHUB_REPO"

# Get hostname
HOSTNAME=$(az staticwebapp show \
    --name "$APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --query "defaultHostname" -o tsv)

echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "App Name: $APP_NAME"
echo "URL: https://$HOSTNAME"
echo ""
echo "Next steps:"
echo "1. git push origin main"
echo "2. Monitor: https://github.com/$GITHUB_REPO/actions"
echo "3. Visit: https://$HOSTNAME"