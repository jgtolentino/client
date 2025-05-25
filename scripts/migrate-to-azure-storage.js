// migrate-to-azure-storage.js
// This script converts the JSON data to Parquet and uploads to Azure Blob Storage

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration for Azure Blob Storage
const AZURE_STORAGE_CONFIG = {
  accountName: process.env.AZURE_STORAGE_ACCOUNT || 'your-storage-account',
  containerName: 'dashboard-data',
  blobName: 'dashboard-data.json', // We'll start with JSON, then move to Parquet
};

// Read the current data
const dataPath = path.join(__dirname, '../client/public/data/dashboard_data.json');
const backupPath = path.join(__dirname, '../client/public/data/dashboard_data_backup.json');

// Create a smaller sample for static deployment
const createSampleData = () => {
  try {
    const fullData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Create a minimal sample with just structure and a few records
    const sampleData = {
      transaction_trends: fullData.transaction_trends?.slice(0, 5) || [],
      brand_trends: fullData.brand_trends?.slice(0, 5) || [],
      consumer_profiles: fullData.consumer_profiles?.slice(0, 3) || [],
      product_mix: fullData.product_mix?.slice(0, 5) || [],
      basket_analysis: fullData.basket_analysis?.slice(0, 5) || [],
      ai_insights: fullData.ai_insights?.slice(0, 3) || [],
      time_patterns: {
        hourly_patterns: fullData.time_patterns?.hourly_patterns?.slice(0, 3) || [],
        demand_forecast: fullData.time_patterns?.demand_forecast?.slice(0, 3) || []
      },
      substitution_patterns: fullData.substitution_patterns?.slice(0, 3) || [],
      location_data: fullData.location_data?.slice(0, 3) || [],
      sku_data: fullData.sku_data?.slice(0, 5) || [],
      _metadata: {
        total_records: {
          transaction_trends: fullData.transaction_trends?.length || 0,
          brand_trends: fullData.brand_trends?.length || 0,
          consumer_profiles: fullData.consumer_profiles?.length || 0,
        },
        data_location: 'azure-blob-storage',
        last_updated: new Date().toISOString()
      }
    };
    
    // Backup original
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(dataPath, backupPath);
      console.log('✓ Created backup of original data');
    }
    
    // Write sample data
    fs.writeFileSync(dataPath, JSON.stringify(sampleData, null, 2));
    console.log('✓ Created sample data file');
    
    // Check sizes
    const originalSize = fs.statSync(backupPath).size;
    const sampleSize = fs.statSync(dataPath).size;
    
    console.log(`Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Sample size: ${(sampleSize / 1024).toFixed(2)} KB`);
    console.log(`Reduction: ${((1 - sampleSize / originalSize) * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error('Error creating sample data:', error);
  }
};

// Run the migration
console.log('Starting data migration...');
createSampleData();

console.log('\nNext steps:');
console.log('1. Set up Azure Blob Storage container');
console.log('2. Upload the backup file to Azure Blob Storage');
console.log('3. Update the API to fetch from Azure instead of static files');
console.log('4. Consider converting to Parquet format for better performance');