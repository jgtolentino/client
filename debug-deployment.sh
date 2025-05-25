#!/bin/bash
# Azure Static Web Apps Deployment Debugging Script

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 Azure Static Web Apps Deployment Debugger${NC}"
echo -e "${BLUE}===========================================${NC}"
echo ""

# Load config if exists
if [ -f "azure-swa-config.json" ]; then
    APP_NAME=$(jq -r '.appName' azure-swa-config.json)
    RESOURCE_GROUP=$(jq -r '.resourceGroup' azure-swa-config.json)
    HOSTNAME=$(jq -r '.hostname' azure-swa-config.json)
    echo -e "${GREEN}✅ Loaded config from azure-swa-config.json${NC}"
else
    echo -e "${YELLOW}⚠️  No azure-swa-config.json found. Please provide details:${NC}"
    read -p "App Name: " APP_NAME
    read -p "Resource Group: " RESOURCE_GROUP
    read -p "Hostname (without https://): " HOSTNAME
fi

echo ""
echo -e "${BLUE}1. GitHub Actions Status${NC}"
echo "========================"
if command -v gh &> /dev/null; then
    echo "Recent workflow runs:"
    gh run list --repo jgtolentino/client --workflow "Azure Static Web Apps CI/CD" --limit 5
    echo ""
    echo -e "${YELLOW}To view detailed logs: gh run view <run-id> --log${NC}"
else
    echo -e "${YELLOW}GitHub CLI not installed. Check manually at:${NC}"
    echo "https://github.com/jgtolentino/client/actions"
fi

echo ""
echo -e "${BLUE}2. Azure Resource Status${NC}"
echo "========================"
if command -v az &> /dev/null; then
    echo "Checking Static Web App status..."
    STATUS=$(az staticwebapp show \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --query provisioningState -o tsv 2>/dev/null || echo "Not Found")
    
    if [ "$STATUS" = "Succeeded" ]; then
        echo -e "${GREEN}✅ Static Web App is running${NC}"
    else
        echo -e "${RED}❌ Static Web App status: $STATUS${NC}"
    fi
else
    echo -e "${YELLOW}Azure CLI not installed. Cannot check resource status.${NC}"
fi

echo ""
echo -e "${BLUE}3. Health Check Tests${NC}"
echo "====================="
echo "Testing frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$HOSTNAME" || echo "000")
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Frontend responding (HTTP $FRONTEND_STATUS)${NC}"
else
    echo -e "${RED}❌ Frontend not responding (HTTP $FRONTEND_STATUS)${NC}"
fi

echo ""
echo "Testing API health endpoint..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$HOSTNAME/api/health" || echo "000")
if [ "$API_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ API health check passed (HTTP $API_STATUS)${NC}"
    echo "Response:"
    curl -s "https://$HOSTNAME/api/health" | jq . 2>/dev/null || curl -s "https://$HOSTNAME/api/health"
else
    echo -e "${RED}❌ API health check failed (HTTP $API_STATUS)${NC}"
fi

echo ""
echo -e "${BLUE}4. SPA Routing Test${NC}"
echo "==================="
TEST_ROUTES=("/dashboard" "/about" "/settings")
for route in "${TEST_ROUTES[@]}"; do
    ROUTE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$HOSTNAME$route" || echo "000")
    if [ "$ROUTE_STATUS" = "200" ]; then
        echo -e "${GREEN}✅ Route $route working (HTTP $ROUTE_STATUS)${NC}"
    else
        echo -e "${RED}❌ Route $route failed (HTTP $ROUTE_STATUS)${NC}"
    fi
done

echo ""
echo -e "${BLUE}5. GitHub Secrets Check${NC}"
echo "======================="
if command -v gh &> /dev/null; then
    echo "Repository secrets:"
    gh secret list --repo jgtolentino/client
else
    echo -e "${YELLOW}GitHub CLI not installed. Check manually in repo settings.${NC}"
fi

echo ""
echo -e "${BLUE}6. Local Testing Commands${NC}"
echo "========================="
echo "To test locally with SWA CLI:"
echo -e "${YELLOW}npm install -g @azure/static-web-apps-cli${NC}"
echo -e "${YELLOW}swa start dist/public --api-location api${NC}"
echo ""
echo "To test API functions locally:"
echo -e "${YELLOW}cd api && func start${NC}"
echo ""
echo "To stream live logs from Azure:"
echo -e "${YELLOW}az staticwebapp log tail --name $APP_NAME --resource-group $RESOURCE_GROUP${NC}"

echo ""
echo -e "${BLUE}7. Common Issues & Solutions${NC}"
echo "============================"
echo -e "${YELLOW}404 Errors:${NC} Check staticwebapp.config.json routing rules"
echo -e "${YELLOW}500 Errors:${NC} Check API logs, add console.error() debugging"
echo -e "${YELLOW}CORS Issues:${NC} Update staticwebapp.config.json globalHeaders"
echo -e "${YELLOW}Build Failures:${NC} Run 'npm run build' locally to test"
echo -e "${YELLOW}Token Issues:${NC} Regenerate token in Azure Portal and update GitHub secret"

echo ""
echo -e "${GREEN}Debug report complete!${NC}"
echo "For detailed help, see: https://docs.microsoft.com/azure/static-web-apps/"