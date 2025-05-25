#!/usr/bin/env python3
"""
Read Parquet files from Azure Blob Storage
Example script showing how to query Parquet data efficiently
"""

import os
import pandas as pd
import pyarrow.parquet as pq
from azure.storage.blob import BlobServiceClient
from azure.identity import DefaultAzureCredential
import io
from datetime import datetime

# Configuration
AZURE_STORAGE_ACCOUNT = os.environ.get('AZURE_STORAGE_ACCOUNT', 'your-storage-account')
CONTAINER_NAME = os.environ.get('AZURE_CONTAINER_NAME', 'dashboard-data')
CONNECTION_STRING = os.environ.get('AZURE_STORAGE_CONNECTION_STRING')

def get_blob_service_client():
    """Get Azure Blob Service Client"""
    if CONNECTION_STRING:
        return BlobServiceClient.from_connection_string(CONNECTION_STRING)
    else:
        account_url = f"https://{AZURE_STORAGE_ACCOUNT}.blob.core.windows.net"
        credential = DefaultAzureCredential()
        return BlobServiceClient(account_url, credential=credential)

def read_parquet_from_blob(blob_name):
    """Read a Parquet file from Azure Blob Storage"""
    try:
        blob_service_client = get_blob_service_client()
        container_client = blob_service_client.get_container_client(CONTAINER_NAME)
        blob_client = container_client.get_blob_client(blob_name)
        
        # Download blob to memory
        blob_data = blob_client.download_blob().readall()
        
        # Read Parquet from bytes
        df = pd.read_parquet(io.BytesIO(blob_data))
        
        return df
        
    except Exception as e:
        print(f"Error reading {blob_name}: {str(e)}")
        return None

def query_transactions_example():
    """Example: Query transaction data with filters"""
    print("📊 Reading transaction trends from Azure...")
    
    df = read_parquet_from_blob("parquet/transaction_trends.parquet")
    
    if df is not None:
        print(f"✓ Loaded {len(df)} transaction records")
        
        # Example queries
        print("\n1. Top 5 transactions by value:")
        top_transactions = df.nlargest(5, 'peso_value')[['date', 'brand', 'peso_value', 'store_location']]
        print(top_transactions.to_string(index=False))
        
        print("\n2. Transactions by time of day:")
        if 'time_of_day' in df.columns:
            time_summary = df.groupby('time_of_day').agg({
                'peso_value': ['count', 'sum', 'mean']
            }).round(2)
            print(time_summary)
        
        print("\n3. Weekend vs Weekday performance:")
        if 'is_weekend' in df.columns:
            weekend_summary = df.groupby('is_weekend').agg({
                'peso_value': ['count', 'sum', 'mean'],
                'units': 'sum'
            }).round(2)
            print(weekend_summary)

def query_brands_example():
    """Example: Analyze brand performance"""
    print("\n📊 Reading brand trends from Azure...")
    
    df = read_parquet_from_blob("parquet/brand_trends.parquet")
    
    if df is not None:
        print(f"✓ Loaded {len(df)} brand records")
        
        print("\n1. Top 10 brands by value:")
        top_brands = df.nlargest(10, 'value')[['brand', 'category', 'value', 'pct_change']]
        print(top_brands.to_string(index=False))
        
        print("\n2. Category summary:")
        category_summary = df.groupby('category').agg({
            'value': ['sum', 'mean'],
            'pct_change': 'mean'
        }).round(2)
        print(category_summary)

def query_time_patterns_example():
    """Example: Analyze hourly patterns"""
    print("\n📊 Reading hourly patterns from Azure...")
    
    df = read_parquet_from_blob("parquet/hourly_patterns.parquet")
    
    if df is not None:
        print(f"✓ Loaded {len(df)} hourly pattern records")
        
        print("\nPeak hours analysis:")
        if 'is_peak' in df.columns:
            peak_hours = df[df['is_peak'] == True][['hour', 'time_label', 'avg_transactions', 'total_revenue']]
            print(peak_hours.to_string(index=False))

def list_available_files():
    """List all Parquet files in the container"""
    try:
        blob_service_client = get_blob_service_client()
        container_client = blob_service_client.get_container_client(CONTAINER_NAME)
        
        print("📁 Available Parquet files in Azure:")
        blobs = container_client.list_blobs(name_starts_with="parquet/")
        
        for blob in blobs:
            print(f"  - {blob.name} ({blob.size / 1024:.2f} KB)")
            
    except Exception as e:
        print(f"Error listing files: {str(e)}")

def create_api_response_example():
    """Example: Create API response from Parquet data"""
    print("\n🔧 Creating API response from Parquet data...")
    
    # Read multiple datasets
    transactions = read_parquet_from_blob("parquet/transaction_trends.parquet")
    brands = read_parquet_from_blob("parquet/brand_trends.parquet")
    
    # Create response similar to original JSON structure
    response = {
        "transaction_trends": transactions.head(10).to_dict('records') if transactions is not None else [],
        "brand_trends": brands.head(10).to_dict('records') if brands is not None else [],
        "metadata": {
            "source": "azure-blob-storage",
            "format": "parquet",
            "timestamp": datetime.now().isoformat(),
            "total_records": {
                "transactions": len(transactions) if transactions is not None else 0,
                "brands": len(brands) if brands is not None else 0
            }
        }
    }
    
    print(f"✓ Created API response with {len(response['transaction_trends'])} transactions and {len(response['brand_trends'])} brands")
    return response

if __name__ == "__main__":
    print(f"Azure Storage Account: {AZURE_STORAGE_ACCOUNT}")
    print(f"Container: {CONTAINER_NAME}\n")
    
    # List available files
    list_available_files()
    
    # Run example queries
    print("\n" + "="*50 + "\n")
    query_transactions_example()
    query_brands_example()
    query_time_patterns_example()
    
    # Create API response
    print("\n" + "="*50 + "\n")
    api_response = create_api_response_example()
    
    print("\n✅ Successfully queried Parquet data from Azure!")
    print("\nBenefits of Parquet format:")
    print("- Columnar storage: Read only needed columns")
    print("- Compression: ~5-10x smaller than JSON")
    print("- Fast queries: Optimized for analytics")
    print("- Schema preservation: Maintains data types")