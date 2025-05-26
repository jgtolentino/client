#!/bin/bash
set -e

echo "🚀 TBWA Dashboard - Azure App Service Deployment"
echo "=================================================="

# Configuration
RESOURCE_GROUP="tbwa-dashboard-rg"
APP_NAME="tbwa-dashboard-app"
PLAN_NAME="tbwa-dashboard-plan"
LOCATION="Southeast Asia"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Clean and build
echo -e "${BLUE}📦 Building application...${NC}"
npm run clean
npm run build

# Verify build output
if [ ! -d "dist/server" ] || [ ! -f "dist/server/index.js" ]; then
    echo -e "${RED}❌ Server build failed - dist/server/index.js not found${NC}"
    exit 1
fi

if [ ! -d "dist/public" ] || [ ! -f "dist/public/index.html" ]; then
    echo -e "${RED}❌ Client build failed - dist/public/index.html not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully${NC}"

# Step 2: Clean up problematic files
echo -e "${BLUE}🧹 Cleaning deployment files...${NC}"
find . -name "Icon*" -type f -delete 2>/dev/null || true
find . -name ".DS_Store" -type f -delete 2>/dev/null || true
find dist -name "*.map" -type f -delete 2>/dev/null || true

# Step 3: Create Azure resources if they don't exist
echo -e "${BLUE}☁️  Setting up Azure resources...${NC}"

# Check if logged in to Azure
if ! az account show >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Please login to Azure first:${NC}"
    echo "az login"
    exit 1
fi

# Create resource group if it doesn't exist
if ! az group show --name "$RESOURCE_GROUP" >/dev/null 2>&1; then
    echo -e "${BLUE}📁 Creating resource group: $RESOURCE_GROUP${NC}"
    az group create \
        --name "$RESOURCE_GROUP" \
        --location "$LOCATION"
else
    echo -e "${GREEN}✅ Resource group $RESOURCE_GROUP already exists${NC}"
fi

# Create app service plan if it doesn't exist
if ! az appservice plan show --name "$PLAN_NAME" --resource-group "$RESOURCE_GROUP" >/dev/null 2>&1; then
    echo -e "${BLUE}📋 Creating App Service plan: $PLAN_NAME${NC}"
    az appservice plan create \
        --name "$PLAN_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --sku B1 \
        --is-linux
else
    echo -e "${GREEN}✅ App Service plan $PLAN_NAME already exists${NC}"
fi

# Create web app if it doesn't exist
if ! az webapp show --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" >/dev/null 2>&1; then
    echo -e "${BLUE}🌐 Creating Web App: $APP_NAME${NC}"
    az webapp create \
        --resource-group "$RESOURCE_GROUP" \
        --plan "$PLAN_NAME" \
        --name "$APP_NAME" \
        --runtime "NODE:18-lts" \
        --startup-file "npx tsx server/index.ts"
else
    echo -e "${GREEN}✅ Web App $APP_NAME already exists${NC}"
fi

# Step 4: Configure app settings
echo -e "${BLUE}⚙️  Configuring application settings...${NC}"
az webapp config appsettings set \
    --resource-group "$RESOURCE_GROUP" \
    --name "$APP_NAME" \
    --settings \
        NODE_ENV="production" \
        WEBSITES_PORT="8080" \
        SCM_DO_BUILD_DURING_DEPLOYMENT="false" \
        USE_MOCK_DATA="true" \
        DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Step 5: Create deployment package
echo -e "${BLUE}📦 Creating deployment package...${NC}"

# Create web.config for proper routing
cat > web.config << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="server/index.ts" verb="*" modules="iisnode"/>
    </handlers>
    <rewrite>
      <rules>
        <rule name="StaticContent">
          <conditions>
            <add input="{REQUEST_URI}" pattern="^/(assets|data)/.*" />
          </conditions>
          <action type="Rewrite" url="dist/public{REQUEST_URI}"/>
        </rule>
        <rule name="APIRoutes">
          <conditions>
            <add input="{REQUEST_URI}" pattern="^/api/.*" />
          </conditions>
          <action type="Rewrite" url="server/index.ts"/>
        </rule>
        <rule name="ClientSideRouting">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True"/>
            <add input="{REQUEST_URI}" pattern="^/api/" negate="True"/>
          </conditions>
          <action type="Rewrite" url="dist/public/index.html"/>
        </rule>
      </rules>
    </rewrite>
    <httpErrors existingResponse="PassThrough" />
    <iisnode node_env="production" nodeProcessCommandLine="node" />
  </system.webServer>
</configuration>
EOF

# Create package.json for deployment
cat > deploy-package.json << EOF
{
  "name": "tbwa-dashboard",
  "version": "1.0.0",
  "type": "module",
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "start": "npx tsx server/index.ts"
  }
}
EOF

# Create deployment zip
zip -r deploy.zip . \
    -x "node_modules/*" \
    -x ".git/*" \
    -x "client/node_modules/*" \
    -x "*.log" \
    -x ".env*" \
    -x "*.md" \
    -x "attached_assets/*" \
    -x "docs/*" \
    -x "scripts/*" \
    -x "uploads/*" \
    -x "*.py" \
    -x "*.sh" \
    -x "test-*" \
    -x "debug-*" \
    -x "deploy-*"

echo -e "${GREEN}✅ Deployment package created: deploy.zip${NC}"

# Step 6: Deploy to Azure
echo -e "${BLUE}🚀 Deploying to Azure App Service...${NC}"
az webapp deployment source config-zip \
    --resource-group "$RESOURCE_GROUP" \
    --name "$APP_NAME" \
    --src deploy.zip

# Step 7: Restart the app
echo -e "${BLUE}🔄 Restarting application...${NC}"
az webapp restart \
    --resource-group "$RESOURCE_GROUP" \
    --name "$APP_NAME"

# Step 8: Get the app URL
APP_URL=$(az webapp show \
    --resource-group "$RESOURCE_GROUP" \
    --name "$APP_NAME" \
    --query defaultHostName \
    --output tsv)

echo ""
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Your dashboard is available at: https://$APP_URL${NC}"
echo ""
echo -e "${BLUE}📋 Useful commands:${NC}"
echo -e "${YELLOW}View logs:${NC} az webapp log tail --resource-group $RESOURCE_GROUP --name $APP_NAME"
echo -e "${YELLOW}Check status:${NC} az webapp show --resource-group $RESOURCE_GROUP --name $APP_NAME --query state"
echo -e "${YELLOW}Browse app:${NC} az webapp browse --resource-group $RESOURCE_GROUP --name $APP_NAME"
echo ""

# Clean up deployment files
rm -f web.config deploy-package.json deploy.zip

echo -e "${GREEN}🎉 TBWA Dashboard deployment complete!${NC}"