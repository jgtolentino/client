# Parquet File Setup for TBWA Dashboard

## Status: ❌ NOT YET CREATED

We have prepared the infrastructure for Parquet files but haven't created them yet because:
1. Parquet creation requires the `parquetjs` or `duckdb` npm package
2. We wanted to keep the deployment dependency-free

## Available Data (JSON Format)
- `/client/public/data/dashboard_data_optimized.json` - 500 TBWA transactions
- `/client/public/data/brands_data.json` - TBWA brand information

## To Create Parquet Files:

### Option 1: Using DuckDB (Recommended)
```bash
# Install DuckDB
npm install duckdb

# Run this Node.js script
node -e "
const duckdb = require('duckdb');
const fs = require('fs');
const path = require('path');

const db = new duckdb.Database(':memory:');
const conn = db.connect();

// Read JSON data
const data = JSON.parse(fs.readFileSync('./client/public/data/dashboard_data_optimized.json'));

// Create table from JSON
conn.run('CREATE TABLE transactions AS SELECT * FROM read_json_auto(?)', 
  [JSON.stringify(data.transactions)]);

// Export to Parquet
conn.run('COPY transactions TO \"transactions.parquet\" (FORMAT PARQUET)');

console.log('✅ Created transactions.parquet');
"
```

### Option 2: Using Python (If you have Python)
```python
import pandas as pd
import json

# Read JSON data
with open('./client/public/data/dashboard_data_optimized.json') as f:
    data = json.load(f)

# Convert to DataFrame
df = pd.DataFrame(data['transactions'])

# Save as Parquet
df.to_parquet('transactions.parquet', engine='pyarrow')
print('✅ Created transactions.parquet')
```

### Option 3: Use Online Converter
1. Go to https://json-csv.com/
2. Upload `dashboard_data_optimized.json`
3. Convert to CSV
4. Use https://parquet-viewer.com/ to convert CSV to Parquet

## Parquet Benefits for TBWA Dashboard:
- **60-80% smaller** file size vs JSON
- **5-10x faster** query performance
- **Columnar storage** - read only needed columns
- **Better compression** for repeated values (brands, locations)
- **Azure Synapse compatible** for future analytics

## Current Architecture Supports:
- ✅ ParquetConnector with DuckDB engine
- ✅ Azure Blob Storage integration
- ✅ SQL queries on Parquet files
- ✅ Multiple file patterns (*.parquet)
- ❌ Actual Parquet files (not created yet)

## When Ready to Create:
1. Install dependencies: `npm install duckdb`
2. Run `node scripts/create-parquet-data.js`
3. Uncomment ParquetConnector in DataSourceManager
4. Upload to Azure Blob Storage
5. Configure connection in Query Builder UI