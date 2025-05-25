#!/usr/bin/env python3
"""
Upload Parquet files to existing Azure Blob Storage container
"""

import os
from pathlib import Path
from azure.storage.blob import BlobServiceClient
from azure.identity import DefaultAzureCredential
import json
from datetime import datetime

# Configuration - Update these with your Azure details
AZURE_STORAGE_ACCOUNT = os.environ.get('AZURE_STORAGE_ACCOUNT', 'your-storage-account')
CONTAINER_NAME = os.environ.get('AZURE_CONTAINER_NAME', 'dashboard-data')
CONNECTION_STRING = os.environ.get('AZURE_STORAGE_CONNECTION_STRING')

# Local paths
PARQUET_DIR = Path(__file__).parent.parent / "parquet_output"

def get_blob_service_client():
    """Get Azure Blob Service Client"""
    if CONNECTION_STRING:
        # Use connection string if provided
        return BlobServiceClient.from_connection_string(CONNECTION_STRING)
    else:
        # Use DefaultAzureCredential (works with Azure CLI, Managed Identity, etc.)
        account_url = f"https://{AZURE_STORAGE_ACCOUNT}.blob.core.windows.net"
        credential = DefaultAzureCredential()
        return BlobServiceClient(account_url, credential=credential)

def upload_file_to_blob(blob_service_client, local_file_path, blob_name):
    """Upload a single file to blob storage"""
    try:
        # Get container client
        container_client = blob_service_client.get_container_client(CONTAINER_NAME)
        
        # Upload the file
        with open(local_file_path, "rb") as data:
            blob_client = container_client.upload_blob(
                name=blob_name, 
                data=data, 
                overwrite=True
            )
        
        # Get blob properties
        properties = blob_client.get_blob_properties()
        
        print(f"✓ Uploaded {blob_name}")
        print(f"  Size: {properties.size / 1024:.2f} KB")
        print(f"  URL: {blob_client.url}")
        
        return True, blob_client.url
        
    except Exception as e:
        print(f"❌ Failed to upload {blob_name}: {str(e)}")
        return False, None

def upload_all_parquet_files():
    """Upload all Parquet files to Azure Blob Storage"""
    print(f"Connecting to Azure Storage Account: {AZURE_STORAGE_ACCOUNT}")
    print(f"Container: {CONTAINER_NAME}\n")
    
    # Get blob service client
    try:
        blob_service_client = get_blob_service_client()
        
        # Check if container exists
        container_client = blob_service_client.get_container_client(CONTAINER_NAME)
        if not container_client.exists():
            print(f"Creating container: {CONTAINER_NAME}")
            container_client.create_container()
    except Exception as e:
        print(f"❌ Failed to connect to Azure: {str(e)}")
        print("\nMake sure you have:")
        print("1. Set AZURE_STORAGE_CONNECTION_STRING environment variable")
        print("2. Or logged in with: az login")
        return
    
    # Upload all parquet files
    parquet_files = list(PARQUET_DIR.glob("*.parquet"))
    
    if not parquet_files:
        print("❌ No Parquet files found. Run convert-to-parquet.py first.")
        return
    
    print(f"Found {len(parquet_files)} Parquet files to upload\n")
    
    uploaded_files = []
    for file_path in parquet_files:
        # Create blob name with folder structure
        blob_name = f"parquet/{file_path.name}"
        success, url = upload_file_to_blob(blob_service_client, file_path, blob_name)
        
        if success:
            uploaded_files.append({
                "file": file_path.name,
                "blob_name": blob_name,
                "url": url,
                "size_kb": file_path.stat().st_size / 1024
            })
    
    # Also upload metadata
    metadata_file = PARQUET_DIR / "conversion_metadata.json"
    if metadata_file.exists():
        blob_name = "parquet/metadata.json"
        upload_file_to_blob(blob_service_client, metadata_file, blob_name)
    
    # Create upload summary
    summary = {
        "upload_date": datetime.now().isoformat(),
        "storage_account": AZURE_STORAGE_ACCOUNT,
        "container": CONTAINER_NAME,
        "files_uploaded": len(uploaded_files),
        "total_size_mb": sum(f["size_kb"] for f in uploaded_files) / 1024,
        "files": uploaded_files
    }
    
    # Save summary
    summary_path = PARQUET_DIR / "upload_summary.json"
    with open(summary_path, 'w') as f:
        json.dump(summary, f, indent=2)
    
    print(f"\n✅ Upload complete!")
    print(f"  Files uploaded: {len(uploaded_files)}")
    print(f"  Total size: {summary['total_size_mb']:.2f} MB")
    print(f"  Summary saved to: {summary_path}")

def create_env_template():
    """Create template for environment variables"""
    template = """# Azure Blob Storage Configuration
AZURE_STORAGE_ACCOUNT=your-storage-account-name
AZURE_CONTAINER_NAME=dashboard-data

# Option 1: Use connection string
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=xxx;AccountKey=xxx;EndpointSuffix=core.windows.net"

# Option 2: Use Azure CLI authentication
# Run: az login
# Then the script will use your Azure credentials
"""
    
    env_file = Path(__file__).parent.parent / ".env.azure"
    if not env_file.exists():
        with open(env_file, 'w') as f:
            f.write(template)
        print(f"Created template: {env_file}")
        print("Please update it with your Azure credentials")

if __name__ == "__main__":
    # Create env template if needed
    if not CONNECTION_STRING and AZURE_STORAGE_ACCOUNT == 'your-storage-account':
        create_env_template()
        print("\n❌ Please configure Azure credentials first")
        print("See .env.azure for template")
        exit(1)
    
    upload_all_parquet_files()