// create-parquet-data.js
// Creates Parquet files from our mock JSON data

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import parquet from 'parquetjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createParquetFiles() {
  try {
    // Read the optimized data
    const dataPath = path.join(__dirname, '../client/public/data/dashboard_data_optimized.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Create output directory
    const outputDir = path.join(__dirname, '../client/public/data/parquet');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Define schema for transactions
    const transactionSchema = new parquet.ParquetSchema({
      id: { type: 'UTF8' },
      date: { type: 'UTF8' },
      location: { type: 'UTF8' },
      brand: { type: 'UTF8' },
      category: { type: 'UTF8' },
      subcategory: { type: 'UTF8' },
      consumer_id: { type: 'UTF8' },
      consumer_gender: { type: 'UTF8' },
      consumer_age: { type: 'INT32' },
      consumer_location: { type: 'UTF8' },
      volume: { type: 'INT32' },
      peso_value: { type: 'DOUBLE' },
      unit_price: { type: 'DOUBLE' },
      time_of_day: { type: 'UTF8' },
      day_of_week: { type: 'UTF8' },
      is_weekend: { type: 'BOOLEAN' }
    });

    // Write transactions to Parquet
    const transactionWriter = await parquet.ParquetWriter.openFile(
      transactionSchema,
      path.join(outputDir, 'transactions.parquet')
    );

    for (const transaction of data.transactions) {
      await transactionWriter.appendRow({
        id: transaction.id,
        date: transaction.date,
        location: transaction.location,
        brand: transaction.brand,
        category: transaction.category,
        subcategory: transaction.subcategory,
        consumer_id: transaction.consumerId,
        consumer_gender: transaction.consumer?.gender || 'Unknown',
        consumer_age: transaction.consumer?.age || 0,
        consumer_location: transaction.consumer?.location || 'Unknown',
        volume: transaction.volume,
        peso_value: parseFloat(transaction.pesoValue),
        unit_price: parseFloat(transaction.unitPrice),
        time_of_day: transaction.timeOfDay || 'Unknown',
        day_of_week: transaction.dayOfWeek || 'Unknown',
        is_weekend: transaction.isWeekend || false
      });
    }
    
    await transactionWriter.close();
    console.log('✅ Created transactions.parquet');

    // Define schema for brands
    const brandSchema = new parquet.ParquetSchema({
      brand: { type: 'UTF8' },
      category: { type: 'UTF8' },
      subcategory: { type: 'UTF8' },
      total_value: { type: 'DOUBLE' },
      transaction_count: { type: 'INT32' },
      avg_transaction_value: { type: 'DOUBLE' },
      market_share: { type: 'DOUBLE' }
    });

    // Aggregate brand data
    const brandMap = new Map();
    let totalValue = 0;

    data.transactions.forEach(t => {
      const key = t.brand;
      const value = parseFloat(t.pesoValue);
      totalValue += value;
      
      if (!brandMap.has(key)) {
        brandMap.set(key, {
          brand: t.brand,
          category: t.category,
          subcategory: t.subcategory,
          total_value: 0,
          transaction_count: 0
        });
      }
      
      const brand = brandMap.get(key);
      brand.total_value += value;
      brand.transaction_count += 1;
    });

    // Write brands to Parquet
    const brandWriter = await parquet.ParquetWriter.openFile(
      brandSchema,
      path.join(outputDir, 'brands.parquet')
    );

    for (const [key, brand] of brandMap) {
      await brandWriter.appendRow({
        ...brand,
        avg_transaction_value: brand.total_value / brand.transaction_count,
        market_share: (brand.total_value / totalValue) * 100
      });
    }
    
    await brandWriter.close();
    console.log('✅ Created brands.parquet');

    // Define schema for locations
    const locationSchema = new parquet.ParquetSchema({
      location: { type: 'UTF8' },
      region: { type: 'UTF8' },
      total_value: { type: 'DOUBLE' },
      transaction_count: { type: 'INT32' },
      unique_consumers: { type: 'INT32' }
    });

    // Aggregate location data
    const locationMap = new Map();
    
    data.transactions.forEach(t => {
      const key = t.location;
      
      if (!locationMap.has(key)) {
        locationMap.set(key, {
          location: t.location,
          region: getRegion(t.location),
          total_value: 0,
          transaction_count: 0,
          consumers: new Set()
        });
      }
      
      const loc = locationMap.get(key);
      loc.total_value += parseFloat(t.pesoValue);
      loc.transaction_count += 1;
      loc.consumers.add(t.consumerId);
    });

    // Write locations to Parquet
    const locationWriter = await parquet.ParquetWriter.openFile(
      locationSchema,
      path.join(outputDir, 'locations.parquet')
    );

    for (const [key, location] of locationMap) {
      await locationWriter.appendRow({
        location: location.location,
        region: location.region,
        total_value: location.total_value,
        transaction_count: location.transaction_count,
        unique_consumers: location.consumers.size
      });
    }
    
    await locationWriter.close();
    console.log('✅ Created locations.parquet');

    // Create metadata file
    const metadata = {
      created: new Date().toISOString(),
      files: [
        {
          name: 'transactions.parquet',
          rows: data.transactions.length,
          size: fs.statSync(path.join(outputDir, 'transactions.parquet')).size
        },
        {
          name: 'brands.parquet',
          rows: brandMap.size,
          size: fs.statSync(path.join(outputDir, 'brands.parquet')).size
        },
        {
          name: 'locations.parquet',
          rows: locationMap.size,
          size: fs.statSync(path.join(outputDir, 'locations.parquet')).size
        }
      ],
      schema_version: '1.0.0'
    };

    fs.writeFileSync(
      path.join(outputDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    console.log('\n📊 Parquet files created successfully!');
    console.log(`📁 Output directory: ${outputDir}`);
    console.log(`📈 Total transactions: ${data.transactions.length}`);
    console.log(`🏷️  Unique brands: ${brandMap.size}`);
    console.log(`📍 Unique locations: ${locationMap.size}`);

  } catch (error) {
    console.error('Error creating Parquet files:', error);
  }
}

function getRegion(location) {
  const regionMap = {
    'Manila': 'NCR',
    'Quezon City': 'NCR',
    'Makati': 'NCR',
    'Cebu': 'Visayas',
    'Davao': 'Mindanao',
    'Iloilo': 'Visayas',
    'Cagayan de Oro': 'Mindanao',
    'Bacolod': 'Visayas',
    'General Santos': 'Mindanao',
    'Zamboanga': 'Mindanao'
  };
  return regionMap[location] || 'Luzon';
}

// Run the script
createParquetFiles();