#!/usr/bin/env node

/**
 * Data Transformation Script - Generate Comprehensive Mock Data
 * Creates realistic dashboard data with full Philippine market simulation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Philippine cities and regions
const LOCATIONS = [
  { city: 'Manila', region: 'NCR', lat: 14.5995, lng: 120.9842, population: 1780000 },
  { city: 'Quezon City', region: 'NCR', lat: 14.6760, lng: 121.0437, population: 2936000 },
  { city: 'Makati', region: 'NCR', lat: 14.5547, lng: 121.0244, population: 582000 },
  { city: 'Taguig', region: 'NCR', lat: 14.5176, lng: 121.0509, population: 804000 },
  { city: 'Cebu City', region: 'Central Visayas', lat: 10.3157, lng: 123.8854, population: 922000 },
  { city: 'Davao City', region: 'Davao', lat: 7.1907, lng: 125.4553, population: 1632000 },
  { city: 'Iloilo City', region: 'Western Visayas', lat: 10.7202, lng: 122.5621, population: 447000 },
  { city: 'Cagayan de Oro', region: 'Northern Mindanao', lat: 8.4822, lng: 124.6472, population: 675000 },
  { city: 'Bacolod', region: 'Western Visayas', lat: 10.6407, lng: 122.9688, population: 600000 },
  { city: 'General Santos', region: 'SOCCSKSARGEN', lat: 6.1164, lng: 125.1716, population: 594000 }
];

// TBWA Client Brands (Your actual clients)
const TBWA_BRANDS = [
  // Alaska Milk Corporation
  { name: 'Alaska Evaporated Milk', category: 'Food & Beverage', subcategory: 'Dairy' },
  { name: 'Alaska Condensed Milk', category: 'Food & Beverage', subcategory: 'Dairy' },
  { name: 'Alaska Powdered Milk', category: 'Food & Beverage', subcategory: 'Dairy' },
  { name: 'Krem-Top', category: 'Food & Beverage', subcategory: 'Coffee Creamer' },
  { name: 'Alpine', category: 'Food & Beverage', subcategory: 'Dairy' },
  { name: 'Cow Bell', category: 'Food & Beverage', subcategory: 'Dairy' },
  
  // Oishi (Liwayway Marketing Corporation)
  { name: 'Oishi Prawn Crackers', category: 'Food & Beverage', subcategory: 'Snacks' },
  { name: 'Oishi Pillows', category: 'Food & Beverage', subcategory: 'Snacks' },
  { name: 'Oishi Ridges', category: 'Food & Beverage', subcategory: 'Snacks' },
  { name: 'Smart C+', category: 'Food & Beverage', subcategory: 'Vitamin Drinks' },
  { name: 'Crispy Patata', category: 'Food & Beverage', subcategory: 'Snacks' },
  { name: 'Hi-Ho', category: 'Food & Beverage', subcategory: 'Snacks' },
  
  // Peerless Products Manufacturing Corporation
  { name: 'Champion Detergent', category: 'Personal Care', subcategory: 'Laundry' },
  { name: 'Calla', category: 'Personal Care', subcategory: 'Personal Care' },
  { name: 'Pride Dishwashing Liquid', category: 'Personal Care', subcategory: 'Cleaning' },
  { name: 'Care Plus', category: 'Personal Care', subcategory: 'Sanitizer' },
  
  // Del Monte Philippines
  { name: 'Del Monte Pineapple Juice', category: 'Food & Beverage', subcategory: 'Juice' },
  { name: 'Del Monte Tomato Sauce', category: 'Food & Beverage', subcategory: 'Condiments' },
  { name: 'Del Monte Fruit Cocktail', category: 'Food & Beverage', subcategory: 'Canned Fruits' },
  { name: 'Fit n Right', category: 'Food & Beverage', subcategory: 'Juice Drinks' },
  
  // Japan Tobacco International (JTI)
  { name: 'Winston', category: 'Tobacco', subcategory: 'Cigarettes' },
  { name: 'Camel', category: 'Tobacco', subcategory: 'Cigarettes' },
  { name: 'Mevius', category: 'Tobacco', subcategory: 'Cigarettes' }
];

// Competitor Brands
const COMPETITOR_BRANDS = [
  { name: 'McDonalds', category: 'Food & Beverage', subcategory: 'Fast Food' },
  { name: 'Red Horse Beer', category: 'Beverages', subcategory: 'Alcoholic' },
  { name: 'Smart Communications', category: 'Telecommunications', subcategory: 'Mobile' },
  { name: 'Uniqlo', category: 'Fashion & Apparel', subcategory: 'Clothing' },
  { name: 'Philippine Airlines', category: 'Travel & Tourism', subcategory: 'Airlines' },
  { name: 'Robinsons', category: 'Retail', subcategory: 'Shopping Centers' },
  { name: 'Nissin Cup Noodles', category: 'Food & Beverage', subcategory: 'Instant Noodles' },
  { name: 'H&M', category: 'Fashion & Apparel', subcategory: 'Fashion' },
  { name: 'Watsons', category: 'Healthcare', subcategory: 'Pharmacy' },
  { name: 'BPI', category: 'Financial Services', subcategory: 'Banking' }
];

// All brands combined
const ALL_BRANDS = [...TBWA_BRANDS, ...COMPETITOR_BRANDS];

// Consumer profiles
const AGE_GROUPS = ['18-24', '25-34', '35-44', '45-54', '55+'];
const GENDERS = ['Male', 'Female'];
const INCOME_LEVELS = ['Low', 'Middle', 'High'];

// Time patterns
const PEAK_HOURS = [11, 12, 13, 17, 18, 19, 20]; // Lunch and dinner times
const WEEKENDS = [0, 6]; // Sunday, Saturday

// Generate date range for the last 6 months
function generateDateRange() {
  const dates = [];
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }
  return dates;
}

// Generate transactions
function generateTransactions(numTransactions = 500) {
  const transactions = [];
  const dates = generateDateRange();
  
  for (let i = 0; i < numTransactions; i++) {
    const date = dates[Math.floor(Math.random() * dates.length)];
    const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const brand = ALL_BRANDS[Math.floor(Math.random() * ALL_BRANDS.length)];
    const hour = Math.floor(Math.random() * 24);
    const isPeakHour = PEAK_HOURS.includes(hour);
    const isWeekend = WEEKENDS.includes(date.getDay());
    
    // Realistic peso values based on category
    let baseValue = 100;
    switch (brand.category) {
      case 'Food & Beverage':
        baseValue = Math.random() * 500 + 100; // 100-600 PHP
        break;
      case 'Fashion & Apparel':
        baseValue = Math.random() * 3000 + 500; // 500-3500 PHP
        break;
      case 'Telecommunications':
        baseValue = Math.random() * 2000 + 300; // 300-2300 PHP
        break;
      case 'Travel & Tourism':
        baseValue = Math.random() * 15000 + 2000; // 2000-17000 PHP
        break;
      case 'Financial Services':
        baseValue = Math.random() * 50000 + 1000; // 1000-51000 PHP
        break;
      case 'Healthcare':
        baseValue = Math.random() * 2000 + 200; // 200-2200 PHP
        break;
      case 'Retail':
        baseValue = Math.random() * 5000 + 500; // 500-5500 PHP
        break;
      default:
        baseValue = Math.random() * 1000 + 100; // 100-1100 PHP
    }
    
    // Apply peak hour and weekend multipliers
    if (isPeakHour) baseValue *= 1.2;
    if (isWeekend) baseValue *= 1.15;
    
    const transaction = {
      transaction_id: `TRX${String(i + 1).padStart(6, '0')}`,
      date: date.toISOString().split('T')[0],
      time: `${String(hour).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
      hour: hour,
      day_of_week: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()],
      is_weekend: isWeekend,
      is_peak_hour: isPeakHour,
      time_of_day: hour < 6 ? 'Early Morning' : hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : hour < 21 ? 'Evening' : 'Night',
      
      // Location data
      store_id: `STR${Math.floor(Math.random() * 100) + 1}`,
      store_location: location.region,
      city: location.city,
      latitude: location.lat,
      longitude: location.lng,
      
      // Product data
      brand: brand.name,
      category: brand.category,
      subcategory: brand.subcategory,
      is_tbwa_client: TBWA_BRANDS.some(b => b.name === brand.name),
      
      // Transaction metrics
      units: Math.floor(Math.random() * 5) + 1,
      peso_value: Math.round(baseValue * 100) / 100,
      discount_percentage: Math.random() > 0.7 ? Math.floor(Math.random() * 30) : 0,
      
      // Consumer data
      consumer_id: `CONS${Math.floor(Math.random() * 10000) + 1}`,
      age_group: AGE_GROUPS[Math.floor(Math.random() * AGE_GROUPS.length)],
      gender: GENDERS[Math.floor(Math.random() * GENDERS.length)],
      income_level: INCOME_LEVELS[Math.floor(Math.random() * INCOME_LEVELS.length)],
      is_repeat_customer: Math.random() > 0.4,
      
      // Performance metrics
      customer_satisfaction: Math.floor(Math.random() * 3) + 3, // 3-5 rating
      duration_seconds: Math.floor(Math.random() * 300) + 60, // 1-6 minutes
    };
    
    // Calculate final price after discount
    transaction.final_price = transaction.peso_value * (1 - transaction.discount_percentage / 100);
    
    transactions.push(transaction);
  }
  
  return transactions;
}

// Aggregate data for dashboard
function createDashboardData(transactions) {
  // Sort transactions by date
  transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Calculate KPI metrics
  const totalTransactions = transactions.length;
  const totalRevenue = transactions.reduce((sum, t) => sum + t.final_price, 0);
  const avgTransactionValue = totalRevenue / totalTransactions;
  const uniqueConsumers = new Set(transactions.map(t => t.consumer_id)).size;
  
  // Brand performance
  const brandMetrics = {};
  ALL_BRANDS.forEach(brand => {
    const brandTrans = transactions.filter(t => t.brand === brand.name);
    brandMetrics[brand.name] = {
      brand: brand.name,
      category: brand.category,
      is_tbwa_client: TBWA_BRANDS.some(b => b.name === brand.name),
      total_transactions: brandTrans.length,
      total_revenue: brandTrans.reduce((sum, t) => sum + t.final_price, 0),
      avg_transaction_value: brandTrans.length > 0 ? brandTrans.reduce((sum, t) => sum + t.final_price, 0) / brandTrans.length : 0,
      market_share: (brandTrans.length / totalTransactions) * 100,
      unique_customers: new Set(brandTrans.map(t => t.consumer_id)).size
    };
  });
  
  // Location performance
  const locationMetrics = {};
  LOCATIONS.forEach(loc => {
    const locTrans = transactions.filter(t => t.city === loc.city);
    locationMetrics[loc.city] = {
      location: loc.city,
      region: loc.region,
      coordinates: [loc.lng, loc.lat],
      transactions: locTrans.length,
      revenue: locTrans.reduce((sum, t) => sum + t.final_price, 0),
      avg_transaction_value: locTrans.length > 0 ? locTrans.reduce((sum, t) => sum + t.final_price, 0) / locTrans.length : 0,
      unique_customers: new Set(locTrans.map(t => t.consumer_id)).size
    };
  });
  
  // Time patterns
  const hourlyPatterns = Array.from({ length: 24 }, (_, hour) => {
    const hourTrans = transactions.filter(t => t.hour === hour);
    return {
      hour: hour,
      time_label: `${String(hour).padStart(2, '0')}:00`,
      transactions: hourTrans.length,
      revenue: hourTrans.reduce((sum, t) => sum + t.final_price, 0),
      is_peak: PEAK_HOURS.includes(hour)
    };
  });
  
  // Consumer insights
  const ageGroupMetrics = {};
  AGE_GROUPS.forEach(age => {
    const ageTrans = transactions.filter(t => t.age_group === age);
    ageGroupMetrics[age] = {
      age_group: age,
      transactions: ageTrans.length,
      revenue: ageTrans.reduce((sum, t) => sum + t.final_price, 0),
      avg_transaction_value: ageTrans.length > 0 ? ageTrans.reduce((sum, t) => sum + t.final_price, 0) / ageTrans.length : 0
    };
  });
  
  // Create final dashboard structure
  const dashboardData = {
    metadata: {
      generated_at: new Date().toISOString(),
      total_records: totalTransactions,
      date_range: {
        start: transactions[0].date,
        end: transactions[transactions.length - 1].date
      }
    },
    
    kpi_metrics: {
      total_transactions: totalTransactions,
      total_revenue: Math.round(totalRevenue),
      avg_transaction_value: Math.round(avgTransactionValue * 100) / 100,
      unique_consumers: uniqueConsumers,
      tbwa_client_share: (transactions.filter(t => t.is_tbwa_client).length / totalTransactions) * 100
    },
    
    // Include subset of transactions for trends
    transaction_trends: transactions.slice(-1000).map(t => ({
      ...t,
      volume: t.units // For compatibility
    })),
    
    brand_performance: Object.values(brandMetrics).map(brand => ({
      brand: brand.brand,
      category: brand.category,
      total_transactions: brand.total_transactions,
      total_revenue: brand.total_revenue,
      avg_transaction_value: brand.avg_transaction_value,
      market_share: brand.market_share,
      unique_customers: brand.unique_customers
      // Removed is_tbwa_client flag - hidden from dashboard
    })).sort((a, b) => b.total_revenue - a.total_revenue),
    
    location_data: Object.values(locationMetrics).sort((a, b) => b.revenue - a.revenue),
    
    category_breakdown: Object.entries(
      transactions.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.final_price;
        return acc;
      }, {})
    ).map(([category, value]) => ({
      category,
      value: Math.round(value),
      percentage: (value / totalRevenue) * 100
    })),
    
    time_patterns: {
      hourly_patterns: hourlyPatterns,
      peak_hours: PEAK_HOURS,
      weekend_lift: transactions.filter(t => t.is_weekend).length / transactions.filter(t => !t.is_weekend).length
    },
    
    consumer_insights: {
      age_distribution: ageGroupMetrics,
      gender_split: {
        male: transactions.filter(t => t.gender === 'Male').length,
        female: transactions.filter(t => t.gender === 'Female').length
      },
      repeat_customer_rate: (transactions.filter(t => t.is_repeat_customer).length / totalTransactions) * 100
    },
    
    ai_insights: generateAIInsights(brandMetrics, locationMetrics)
  };
  
  return dashboardData;
}

// Generate AI insights based on data
function generateAIInsights(brandMetrics, locationMetrics) {
  const insights = [];
  
  // Top performing TBWA brand
  const topTBWABrand = Object.values(brandMetrics)
    .filter(b => b.is_tbwa_client)
    .sort((a, b) => b.total_revenue - a.total_revenue)[0];
    
  if (topTBWABrand) {
    insights.push({
      id: '1',
      type: 'success',
      title: `${topTBWABrand.brand} Leading Performance`,
      description: `${topTBWABrand.brand} generates ₱${Math.round(topTBWABrand.total_revenue).toLocaleString()} in revenue with ${topTBWABrand.market_share.toFixed(1)}% market share`,
      impact: 'high',
      timestamp: new Date().toISOString()
    });
  }
  
  // Underperforming location
  const weakLocation = Object.values(locationMetrics)
    .sort((a, b) => a.revenue - b.revenue)[0];
    
  if (weakLocation) {
    insights.push({
      id: '2',
      type: 'warning',
      title: `Low Performance in ${weakLocation.location}`,
      description: `${weakLocation.location} shows below-average transaction volume with only ${weakLocation.transactions} transactions`,
      impact: 'medium',
      timestamp: new Date().toISOString()
    });
  }
  
  // Category opportunity
  const categories = Object.values(brandMetrics).reduce((acc, brand) => {
    if (!acc[brand.category]) acc[brand.category] = { revenue: 0, brands: 0 };
    acc[brand.category].revenue += brand.total_revenue;
    acc[brand.category].brands++;
    return acc;
  }, {});
  
  const topCategory = Object.entries(categories)
    .sort(([,a], [,b]) => b.revenue - a.revenue)[0];
    
  if (topCategory) {
    insights.push({
      id: '3',
      type: 'info',
      title: `${topCategory[0]} Category Dominance`,
      description: `${topCategory[0]} category leads with ₱${Math.round(topCategory[1].revenue).toLocaleString()} total revenue across ${topCategory[1].brands} brands`,
      impact: 'medium',
      timestamp: new Date().toISOString()
    });
  }
  
  return insights;
}

// Main execution
function main() {
  console.log('🚀 Generating comprehensive dashboard data...');
  
  // Generate transactions
  const transactions = generateTransactions(500);
  console.log(`✅ Generated ${transactions.length} transactions`);
  
  // Create dashboard data
  const dashboardData = createDashboardData(transactions);
  console.log('✅ Aggregated dashboard metrics');
  
  // Save to file
  const outputPath = path.join(__dirname, '..', 'client', 'public', 'data', 'dashboard_data.json');
  fs.writeFileSync(outputPath, JSON.stringify(dashboardData, null, 2));
  console.log(`✅ Saved dashboard data to ${outputPath}`);
  
  // Also save to dist if it exists
  const distPath = path.join(__dirname, '..', 'dist', 'public', 'data', 'dashboard_data.json');
  if (fs.existsSync(path.dirname(distPath))) {
    fs.writeFileSync(distPath, JSON.stringify(dashboardData, null, 2));
    console.log(`✅ Also saved to dist folder`);
  }
  
  // Print summary
  console.log('\n📊 Dashboard Data Summary:');
  console.log(`- Total Transactions: ${dashboardData.kpi_metrics.total_transactions.toLocaleString()}`);
  console.log(`- Total Revenue: ₱${dashboardData.kpi_metrics.total_revenue.toLocaleString()}`);
  console.log(`- Unique Consumers: ${dashboardData.kpi_metrics.unique_consumers.toLocaleString()}`);
  console.log(`- TBWA Client Market Share: ${dashboardData.kpi_metrics.tbwa_client_share.toFixed(1)}%`);
  console.log(`- Number of Brands: ${dashboardData.brand_performance.length}`);
  console.log(`- Number of Locations: ${dashboardData.location_data.length}`);
}

// Run the script
main();