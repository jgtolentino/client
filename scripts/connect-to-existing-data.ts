#!/usr/bin/env ts-node

/**
 * Script to help connect the dashboard to existing Azure data sources
 * Run after discovering resources with discover-azure-resources.sh
 */

import { config } from 'dotenv';
import sql from 'mssql';
import { BlobServiceClient } from '@azure/storage-blob';

config(); // Load .env file

interface DiscoveredResources {
  sqlServer?: string;
  sqlDatabase?: string;
  storageAccount?: string;
  containerName?: string;
}

async function testSqlConnection(server: string, database: string) {
  console.log(`\n🔍 Testing SQL connection to ${server}/${database}...`);
  
  const sqlConfig = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: database,
    server: server,
    options: {
      encrypt: true,
      trustServerCertificate: false
    }
  };

  try {
    await sql.connect(sqlConfig);
    console.log('✅ Connected successfully!');
    
    // List tables
    const result = await sql.query`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE'
    `;
    
    console.log('\n📋 Found tables:');
    result.recordset.forEach(row => console.log(`  - ${row.TABLE_NAME}`));
    
    // Check for retail-specific tables
    const retailTables = ['SalesInteractions', 'Brands', 'Products', 'Stores', 'TransactionItems'];
    const existingTables = result.recordset.map(r => r.TABLE_NAME);
    
    console.log('\n🎯 Retail Analytics tables:');
    retailTables.forEach(table => {
      const exists = existingTables.includes(table);
      console.log(`  ${exists ? '✅' : '❌'} ${table}`);
    });
    
    // Sample data from SalesInteractions if it exists
    if (existingTables.includes('SalesInteractions')) {
      const sample = await sql.query`
        SELECT TOP 5 * FROM SalesInteractions 
        ORDER BY TransactionDate DESC
      `;
      console.log('\n📊 Sample data from SalesInteractions:');
      console.log(sample.recordset);
    }
    
    await sql.close();
    return true;
    
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    return false;
  }
}

async function testBlobConnection(accountName: string, containerName: string) {
  console.log(`\n🔍 Testing Blob Storage connection to ${accountName}/${containerName}...`);
  
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING || 
      `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${process.env.STORAGE_KEY};EndpointSuffix=core.windows.net`
    );
    
    const containerClient = blobServiceClient.getContainerClient(containerName);
    
    if (await containerClient.exists()) {
      console.log('✅ Container exists!');
      
      // List blobs
      console.log('\n📋 Found blobs:');
      let count = 0;
      for await (const blob of containerClient.listBlobsFlat()) {
        console.log(`  - ${blob.name} (${(blob.properties.contentLength / 1024).toFixed(2)} KB)`);
        count++;
        if (count > 10) {
          console.log('  ... and more');
          break;
        }
      }
      
      return true;
    } else {
      console.log('❌ Container does not exist');
      return false;
    }
    
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    return false;
  }
}

async function generateConnectionCode(resources: DiscoveredResources) {
  console.log('\n📝 Generating connection code...\n');
  
  if (resources.sqlServer && resources.sqlDatabase) {
    console.log('// Add to server/db.ts:');
    console.log(`
import sql from 'mssql';

const config = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: '${resources.sqlServer}.database.windows.net',
  database: '${resources.sqlDatabase}',
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

export async function getConnection() {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (err) {
    console.error('SQL connection error:', err);
    throw err;
  }
}
`);
  }
  
  if (resources.storageAccount) {
    console.log('\n// Add to server/storage-azure.ts:');
    console.log(`
import { BlobServiceClient } from '@azure/storage-blob';

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

export async function getDataFromBlob(fileName: string) {
  const containerClient = blobServiceClient.getContainerClient('${resources.containerName || 'data'}');
  const blobClient = containerClient.getBlobClient(fileName);
  
  const downloadResponse = await blobClient.download();
  const data = await streamToBuffer(downloadResponse.readableStreamBody);
  
  return JSON.parse(data.toString());
}
`);
  }
  
  console.log('\n// Add to .env:');
  console.log(`
# Azure SQL Database
SQL_USER=your-username
SQL_PASSWORD=your-password
SQL_SERVER=${resources.sqlServer || 'your-server'}.database.windows.net
SQL_DATABASE=${resources.sqlDatabase || 'your-database'}

# Azure Storage
AZURE_STORAGE_CONNECTION_STRING="your-connection-string"
AZURE_STORAGE_ACCOUNT=${resources.storageAccount || 'your-storage-account'}
`);
}

// Main execution
async function main() {
  console.log('🚀 Azure Connection Helper\n');
  
  // These would be filled in based on discover-azure-resources.sh output
  const discovered: DiscoveredResources = {
    sqlServer: process.env.DISCOVERED_SQL_SERVER,
    sqlDatabase: process.env.DISCOVERED_SQL_DATABASE,
    storageAccount: process.env.DISCOVERED_STORAGE_ACCOUNT,
    containerName: process.env.DISCOVERED_CONTAINER_NAME || 'dashboard-data'
  };
  
  if (discovered.sqlServer && discovered.sqlDatabase) {
    await testSqlConnection(
      `${discovered.sqlServer}.database.windows.net`,
      discovered.sqlDatabase
    );
  } else {
    console.log('ℹ️ No SQL Server discovered. Set DISCOVERED_SQL_SERVER and DISCOVERED_SQL_DATABASE');
  }
  
  if (discovered.storageAccount) {
    await testBlobConnection(
      discovered.storageAccount,
      discovered.containerName
    );
  } else {
    console.log('ℹ️ No Storage Account discovered. Set DISCOVERED_STORAGE_ACCOUNT');
  }
  
  await generateConnectionCode(discovered);
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { testSqlConnection, testBlobConnection };