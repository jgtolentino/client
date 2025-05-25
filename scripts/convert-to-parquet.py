#!/usr/bin/env python3
"""
Convert dashboard JSON data to Parquet format for Azure Blob Storage
Parquet provides columnar storage with excellent compression
"""

import json
import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq
from datetime import datetime
import os
from pathlib import Path

# Configuration
DATA_DIR = Path(__file__).parent.parent / "client" / "public" / "data"
OUTPUT_DIR = Path(__file__).parent.parent / "parquet_output"
OUTPUT_DIR.mkdir(exist_ok=True)

def load_json_data(filepath):
    """Load JSON data from file"""
    with open(filepath, 'r') as f:
        return json.load(f)

def convert_transactions_to_parquet(data):
    """Convert transaction trends to Parquet"""
    transactions = data.get('transaction_trends', [])
    
    if transactions:
        df = pd.DataFrame(transactions)
        
        # Convert date strings to datetime
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'])
        
        # Ensure numeric columns are properly typed
        numeric_columns = ['peso_value', 'units', 'unit_price', 'cost', 'margin_percentage']
        for col in numeric_columns:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
        
        # Save to Parquet
        output_path = OUTPUT_DIR / "transaction_trends.parquet"
        df.to_parquet(output_path, engine='pyarrow', compression='snappy')
        
        print(f"✓ Converted {len(df)} transaction records")
        print(f"  Original size: {get_json_size(transactions)} KB")
        print(f"  Parquet size: {output_path.stat().st_size / 1024:.2f} KB")
        print(f"  Compression ratio: {get_compression_ratio(transactions, output_path):.1f}x")
        
        return df

def convert_brands_to_parquet(data):
    """Convert brand trends to Parquet"""
    brands = data.get('brand_trends', [])
    
    if brands:
        df = pd.DataFrame(brands)
        
        # Ensure numeric columns
        numeric_columns = ['value', 'pct_change']
        for col in numeric_columns:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
        
        output_path = OUTPUT_DIR / "brand_trends.parquet"
        df.to_parquet(output_path, engine='pyarrow', compression='snappy')
        
        print(f"✓ Converted {len(df)} brand records")
        print(f"  Compression ratio: {get_compression_ratio(brands, output_path):.1f}x")
        
        return df

def convert_consumer_profiles_to_parquet(data):
    """Convert consumer profiles to Parquet"""
    profiles = data.get('consumer_profiles', [])
    
    if profiles:
        df = pd.DataFrame(profiles)
        
        # Convert date columns
        date_columns = ['last_purchase', 'first_purchase']
        for col in date_columns:
            if col in df.columns:
                df[col] = pd.to_datetime(df[col])
        
        output_path = OUTPUT_DIR / "consumer_profiles.parquet"
        df.to_parquet(output_path, engine='pyarrow', compression='snappy')
        
        print(f"✓ Converted {len(df)} consumer profiles")
        print(f"  Compression ratio: {get_compression_ratio(profiles, output_path):.1f}x")
        
        return df

def convert_time_patterns_to_parquet(data):
    """Convert time patterns to Parquet"""
    time_patterns = data.get('time_patterns', {})
    
    # Hourly patterns
    hourly = time_patterns.get('hourly_patterns', [])
    if hourly:
        df = pd.DataFrame(hourly)
        output_path = OUTPUT_DIR / "hourly_patterns.parquet"
        df.to_parquet(output_path, engine='pyarrow', compression='snappy')
        print(f"✓ Converted {len(df)} hourly pattern records")
    
    # Demand forecast
    forecast = time_patterns.get('demand_forecast', [])
    if forecast:
        df = pd.DataFrame(forecast)
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'])
        output_path = OUTPUT_DIR / "demand_forecast.parquet"
        df.to_parquet(output_path, engine='pyarrow', compression='snappy')
        print(f"✓ Converted {len(df)} forecast records")

def convert_all_to_parquet(json_filepath):
    """Convert all data sections to Parquet format"""
    print(f"Loading data from {json_filepath}...")
    data = load_json_data(json_filepath)
    
    print("\nConverting to Parquet format...")
    
    # Convert each data section
    convert_transactions_to_parquet(data)
    convert_brands_to_parquet(data)
    convert_consumer_profiles_to_parquet(data)
    convert_time_patterns_to_parquet(data)
    
    # Convert other sections if they exist
    other_sections = ['product_mix', 'basket_analysis', 'ai_insights', 
                     'substitution_patterns', 'location_data', 'sku_data']
    
    for section in other_sections:
        if section in data and data[section]:
            df = pd.DataFrame(data[section])
            output_path = OUTPUT_DIR / f"{section}.parquet"
            df.to_parquet(output_path, engine='pyarrow', compression='snappy')
            print(f"✓ Converted {len(df)} {section} records")

def get_json_size(data):
    """Get size of JSON data in KB"""
    return len(json.dumps(data).encode('utf-8')) / 1024

def get_compression_ratio(json_data, parquet_path):
    """Calculate compression ratio"""
    json_size = len(json.dumps(json_data).encode('utf-8'))
    parquet_size = parquet_path.stat().st_size
    return json_size / parquet_size if parquet_size > 0 else 0

def create_metadata_file():
    """Create metadata file with conversion info"""
    metadata = {
        "conversion_date": datetime.now().isoformat(),
        "parquet_files": [],
        "total_compression_ratio": 0,
        "original_json_size_mb": 0,
        "total_parquet_size_mb": 0
    }
    
    # List all parquet files
    parquet_files = list(OUTPUT_DIR.glob("*.parquet"))
    total_parquet_size = 0
    
    for pf in parquet_files:
        file_info = {
            "filename": pf.name,
            "size_kb": pf.stat().st_size / 1024,
            "records": pq.read_metadata(pf).num_rows
        }
        metadata["parquet_files"].append(file_info)
        total_parquet_size += pf.stat().st_size
    
    # Calculate total sizes
    original_size = (DATA_DIR / "dashboard_data_backup.json").stat().st_size
    metadata["original_json_size_mb"] = original_size / 1024 / 1024
    metadata["total_parquet_size_mb"] = total_parquet_size / 1024 / 1024
    metadata["total_compression_ratio"] = original_size / total_parquet_size if total_parquet_size > 0 else 0
    
    # Save metadata
    with open(OUTPUT_DIR / "conversion_metadata.json", 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"\n📊 Overall Statistics:")
    print(f"  Original JSON: {metadata['original_json_size_mb']:.2f} MB")
    print(f"  Total Parquet: {metadata['total_parquet_size_mb']:.2f} MB")
    print(f"  Compression ratio: {metadata['total_compression_ratio']:.1f}x")

if __name__ == "__main__":
    # Use the backup file with full data
    json_file = DATA_DIR / "dashboard_data_backup.json"
    
    if not json_file.exists():
        print(f"❌ Error: {json_file} not found")
        print("Please run the migration script first to create the backup file")
        exit(1)
    
    convert_all_to_parquet(json_file)
    create_metadata_file()
    
    print(f"\n✅ Conversion complete! Parquet files saved to: {OUTPUT_DIR}")
    print("\nNext steps:")
    print("1. Upload parquet files to Azure Blob Storage")
    print("2. Update API to read from Parquet instead of JSON")