#!/bin/bash

# Azure Resource Discovery Script for Retail Analytics Project
# This script helps find existing Azure resources that might be part of the project

echo "🔍 Azure Resource Discovery for Retail Analytics Dashboard"
echo "========================================================"

# Check if logged in
if ! az account show &>/dev/null; then
    echo "❌ Not logged into Azure. Running 'az login'..."
    az login
fi

# Get current subscription
SUBSCRIPTION=$(az account show --query name -o tsv)
echo "📋 Current subscription: $SUBSCRIPTION"
echo ""

# Search for resource groups
echo "🔍 Searching for relevant resource groups..."
az group list --query "[?contains(name, 'retail') || contains(name, 'analytics') || contains(name, 'dashboard') || contains(name, 'rg-')]" \
    --output table

echo ""
echo "🔍 Searching for SQL Servers and Databases..."
# List all SQL servers
SQL_SERVERS=$(az sql server list --query "[].name" -o tsv)
for server in $SQL_SERVERS; do
    echo "  SQL Server: $server"
    # List databases on this server
    az sql db list --server $server --query "[?name!='master'].{Database:name, Size:currentSizeBytes, Status:status}" --output table 2>/dev/null
done

echo ""
echo "🔍 Searching for Storage Accounts..."
az storage account list --query "[?contains(name, 'retail') || contains(name, 'analytics') || contains(name, 'data')]" \
    --output table

echo ""
echo "🔍 Searching for Function Apps..."
az functionapp list --query "[?contains(name, 'retail') || contains(name, 'api') || contains(name, 'func')]" \
    --output table

echo ""
echo "🔍 Searching for Static Web Apps..."
az staticwebapp list --output table

echo ""
echo "🔍 Searching for App Insights..."
az monitor app-insights component list \
    --query "[?contains(name, 'retail') || contains(name, 'analytics')]" \
    --output table

echo ""
echo "🔍 Searching for Databricks Workspaces..."
az databricks workspace list --output table 2>/dev/null || echo "  No Databricks CLI configured"

echo ""
echo "🔍 Searching for Redis Cache..."
az redis list --output table

echo ""
echo "📊 Summary of All Resources"
echo "=========================="
az resource list --query "[?contains(name, 'retail') || contains(name, 'analytics') || contains(type, 'Microsoft.Sql') || contains(type, 'Microsoft.Web')]" \
    --output table

echo ""
echo "💡 Next Steps:"
echo "1. Note any relevant resource names above"
echo "2. Check each resource for connection strings:"
echo "   az sql server show --name <server-name>"
echo "   az storage account show-connection-string --name <storage-name>"
echo "   az functionapp config appsettings list --name <function-name>"
echo ""
echo "3. Look for existing data:"
echo "   - Check SQL databases for tables"
echo "   - Check storage accounts for containers"
echo "   - Check function apps for deployed code"