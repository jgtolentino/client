// Data Transformation Script to add missing columns to existing records

// Helper functions for generating realistic data
const getTimeOfDay = (hour) => {
  if (hour >= 5 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 17) return "Afternoon";
  if (hour >= 17 && hour < 21) return "Evening";
  return "Night";
};

const isPeakHour = (hour) => {
  return (hour >= 6 && hour <= 9) || (hour >= 17 && hour <= 20);
};

const getDayOfWeek = (dateStr) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date(dateStr).getDay()];
};

const isWeekend = (dateStr) => {
  const day = new Date(dateStr).getDay();
  return day === 0 || day === 6;
};

const generateSKU = (brand, category) => {
  const categoryCode = {
    "Cigarettes": "CIG",
    "Beverages": "BEV",
    "Snacks": "SNK",
    "General": "GEN",
    "Dairy": "DRY"
  };
  const brandCode = brand.substring(0, 3).toUpperCase();
  const randomNum = Math.floor(Math.random() * 999) + 1;
  return `${categoryCode[category] || 'GEN'}-${brandCode}-${randomNum.toString().padStart(3, '0')}`;
};

const barangays = [
  "Poblacion", "San Antonio", "San Jose", "Sta. Cruz", "Bagong Pag-asa",
  "Malaya", "Pinyahan", "Central", "Commonwealth", "Payatas"
];

const paymentMethods = ["Cash", "GCash", "Maya", "Cash", "Cash"]; // More cash transactions

// Transform transaction_trends data
function transformTransactionData(originalData) {
  return originalData.transaction_trends.map((transaction, index) => {
    const hour = Math.floor(Math.random() * 14) + 6; // 6 AM to 8 PM
    const date = new Date(transaction.date);
    const transactionId = `TRX${(index + 1).toString().padStart(4, '0')}`;
    const storeId = `STR${Math.floor(Math.random() * 10) + 1}`;
    const barangay = barangays[Math.floor(Math.random() * barangays.length)];
    
    // Determine if store attendant influenced the sale
    const wasRecommended = Math.random() > 0.7;
    const originallyRequested = wasRecommended && Math.random() > 0.5 ? 
      ["Winston", "Marlboro", "Philip Morris", "Mighty"][Math.floor(Math.random() * 4)] : 
      transaction.brand;
    
    // Calculate unit price from total value and units
    const unitPrice = transaction.peso_value / transaction.units;
    const cost = unitPrice * 0.85; // 15% margin average
    
    return {
      // Original fields
      transaction_id: transactionId,
      date: transaction.date,
      volume: transaction.volume,
      peso_value: transaction.peso_value,
      duration_seconds: transaction.duration,
      units: transaction.units,
      brand: transaction.brand,
      category: transaction.category,
      
      // New fields
      store_id: storeId,
      store_location: barangay,
      city: originalData.consumer_profiling[index % originalData.consumer_profiling.length].location,
      time: `${hour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:00`,
      hour: hour,
      time_of_day: getTimeOfDay(hour),
      day_of_week: getDayOfWeek(transaction.date),
      is_weekend: isWeekend(transaction.date),
      is_peak_hour: isPeakHour(hour),
      payment_method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      cashier_id: `EMP${Math.floor(Math.random() * 5) + 1}`,
      
      // Product details
      sku: generateSKU(transaction.brand, transaction.category),
      unit_price: unitPrice,
      cost: cost,
      margin_percentage: ((unitPrice - cost) / unitPrice * 100).toFixed(2),
      
      // Store influence
      was_recommended: wasRecommended,
      originally_requested: originallyRequested,
      influence_success: wasRecommended && originallyRequested !== transaction.brand,
      
      // Link to customer
      customer_id: `CUST${Math.floor(Math.random() * 200) + 1}`.padStart(7, '0')
    };
  });
}

// Transform consumer_profiling data
function transformConsumerData(originalData) {
  // Group by location and create customer profiles
  const customerMap = new Map();
  
  originalData.consumer_profiling.forEach((profile, index) => {
    const customerId = `CUST${(index + 1).toString().padStart(4, '0')}`;
    
    // Find all transactions for this customer
    const customerTransactions = originalData.transaction_trends.filter((_, idx) => 
      idx % originalData.consumer_profiling.length === index
    );
    
    const totalSpent = customerTransactions.reduce((sum, t) => sum + t.peso_value, 0);
    const avgBasketSize = customerTransactions.reduce((sum, t) => sum + t.units, 0) / customerTransactions.length;
    
    customerMap.set(customerId, {
      customer_id: customerId,
      gender: profile.gender,
      age: profile.age,
      location: profile.location,
      
      // New behavioral metrics
      visit_frequency: ["Daily", "Weekly", "Bi-weekly", "Monthly"][Math.floor(Math.random() * 4)],
      lifetime_value: totalSpent,
      avg_basket_size: avgBasketSize.toFixed(1),
      total_transactions: customerTransactions.length,
      
      // Behavioral scores (1-10)
      price_sensitivity_score: (Math.random() * 4 + 6).toFixed(1), // 6-10
      brand_loyalty_score: (Math.random() * 4 + 5).toFixed(1), // 5-9
      recommendation_acceptance_rate: (Math.random() * 0.4 + 0.5).toFixed(2), // 50-90%
      
      // Preferences
      preferred_categories: getTopCategories(customerTransactions),
      preferred_brands: getTopBrands(customerTransactions),
      preferred_payment: Math.random() > 0.8 ? "GCash" : "Cash",
      
      // Shopping patterns
      avg_transaction_value: (totalSpent / customerTransactions.length).toFixed(2),
      preferred_shopping_time: getPreferredTime(customerTransactions),
      impulse_buyer_score: (Math.random() * 5 + 3).toFixed(1) // 3-8
    });
  });
  
  return Array.from(customerMap.values());
}

// Helper functions for consumer data
function getTopCategories(transactions) {
  const categories = {};
  transactions.forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + 1;
  });
  return Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat]) => cat);
}

function getTopBrands(transactions) {
  const brands = {};
  transactions.forEach(t => {
    brands[t.brand] = (brands[t.brand] || 0) + 1;
  });
  return Object.entries(brands)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([brand]) => brand);
}

function getPreferredTime(transactions) {
  // Simulate time preference
  const times = ["Morning", "Afternoon", "Evening"];
  return times[Math.floor(Math.random() * times.length)];
}

// Generate AI insights based on the data
function generateAIInsights(transformedData) {
  const insights = [];
  
  // Analyze peak hours
  const peakTransactions = transformedData.filter(t => t.is_peak_hour);
  const avgPeakValue = peakTransactions.reduce((sum, t) => sum + t.peso_value, 0) / peakTransactions.length;
  const avgNonPeakValue = transformedData.filter(t => !t.is_peak_hour)
    .reduce((sum, t) => sum + t.peso_value, 0) / transformedData.filter(t => !t.is_peak_hour).length;
  
  insights.push({
    insight_id: "INS001",
    type: "opportunity",
    severity: "high",
    message: `Peak hours show ${((avgPeakValue / avgNonPeakValue - 1) * 100).toFixed(0)}% higher transaction values`,
    recommendation: "Ensure full stock availability during peak hours (6-9 AM, 5-8 PM)",
    potential_revenue_impact: (avgPeakValue - avgNonPeakValue) * 30 * peakTransactions.length,
    confidence_score: 0.89,
    affected_categories: ["Cigarettes", "Beverages", "Snacks"]
  });
  
  // Analyze by location
  const locationGroups = {};
  transformedData.forEach(t => {
    if (!locationGroups[t.store_location]) {
      locationGroups[t.store_location] = [];
    }
    locationGroups[t.store_location].push(t);
  });
  
  Object.entries(locationGroups).forEach(([location, transactions]) => {
    const avgValue = transactions.reduce((sum, t) => sum + t.peso_value, 0) / transactions.length;
    const overallAvg = transformedData.reduce((sum, t) => sum + t.peso_value, 0) / transformedData.length;
    
    if (avgValue < overallAvg * 0.8) {
      insights.push({
        insight_id: `INS${insights.length + 1}`.padStart(6, '0'),
        type: "anomaly",
        severity: "medium",
        message: `${location} shows ${((1 - avgValue / overallAvg) * 100).toFixed(0)}% lower sales than average`,
        recommendation: `Review product mix and pricing strategy for ${location} store`,
        affected_store: location,
        confidence_score: 0.75
      });
    }
  });
  
  // Product recommendations
  const categoryPerformance = {};
  transformedData.forEach(t => {
    if (!categoryPerformance[t.category]) {
      categoryPerformance[t.category] = { count: 0, value: 0 };
    }
    categoryPerformance[t.category].count++;
    categoryPerformance[t.category].value += t.peso_value;
  });
  
  Object.entries(categoryPerformance).forEach(([category, data]) => {
    if (data.count > transformedData.length * 0.2) { // If category represents >20% of transactions
      insights.push({
        insight_id: `INS${insights.length + 1}`.padStart(6, '0'),
        type: "optimization",
        severity: "low",
        message: `${category} drives ${(data.count / transformedData.length * 100).toFixed(0)}% of transactions`,
        recommendation: `Expand ${category} product range and ensure competitive pricing`,
        potential_revenue_impact: data.value * 0.1, // 10% potential increase
        confidence_score: 0.82
      });
    }
  });
  
  return insights;
}

// Generate time-based patterns
function generateTimePatterns(transformedData) {
  const hourlyData = {};
  const weekdayData = { weekday: { count: 0, value: 0 }, weekend: { count: 0, value: 0 } };
  
  transformedData.forEach(t => {
    // Hourly patterns
    if (!hourlyData[t.hour]) {
      hourlyData[t.hour] = { transactions: [], total_value: 0, total_units: 0 };
    }
    hourlyData[t.hour].transactions.push(t);
    hourlyData[t.hour].total_value += t.peso_value;
    hourlyData[t.hour].total_units += t.units;
    
    // Weekend vs Weekday
    if (t.is_weekend) {
      weekdayData.weekend.count++;
      weekdayData.weekend.value += t.peso_value;
    } else {
      weekdayData.weekday.count++;
      weekdayData.weekday.value += t.peso_value;
    }
  });
  
  const hourlyPatterns = Object.entries(hourlyData).map(([hour, data]) => ({
    hour: parseInt(hour),
    time_label: `${hour}:00`,
    avg_transactions: data.transactions.length,
    avg_basket_size: (data.total_units / data.transactions.length).toFixed(1),
    avg_transaction_value: (data.total_value / data.transactions.length).toFixed(2),
    total_revenue: data.total_value.toFixed(2),
    is_peak: isPeakHour(parseInt(hour))
  }));
  
  return {
    hourly_patterns: hourlyPatterns.sort((a, b) => a.hour - b.hour),
    weekend_vs_weekday: {
      weekday: {
        avg_transactions: weekdayData.weekday.count,
        avg_value: (weekdayData.weekday.value / weekdayData.weekday.count).toFixed(2),
        total_value: weekdayData.weekday.value.toFixed(2)
      },
      weekend: {
        avg_transactions: weekdayData.weekend.count,
        avg_value: (weekdayData.weekend.value / weekdayData.weekend.count).toFixed(2),
        total_value: weekdayData.weekend.value.toFixed(2)
      }
    }
  };
}

// Main transformation function
function transformDashboardData(originalData) {
  // Transform existing data
  const enhancedTransactions = transformTransactionData(originalData);
  const enhancedConsumers = transformConsumerData(originalData);
  const aiInsights = generateAIInsights(enhancedTransactions);
  const timePatterns = generateTimePatterns(enhancedTransactions);
  
  // Keep original data that's already good
  const enhancedData = {
    // Enhanced transaction data with all new fields
    transaction_trends: enhancedTransactions,
    
    // Enhanced consumer profiles
    consumer_profiling: enhancedConsumers,
    
    // Keep original basket analysis but add customer_id
    basket_analysis: originalData.basket_analysis.map((basket, idx) => ({
      ...basket,
      customer_id: `CUST${(idx % 200 + 1).toString().padStart(4, '0')}`,
      transaction_date: originalData.transaction_trends[idx % originalData.transaction_trends.length].date,
      store_id: `STR${Math.floor(Math.random() * 10) + 1}`
    })),
    
    // Keep substitution patterns but add more context
    substitution_patterns: originalData.substitution_patterns.map(pattern => ({
      ...pattern,
      avg_price_difference: (Math.random() * 50 - 25).toFixed(2), // -25 to +25 pesos
      conversion_rate: (Math.random() * 0.4 + 0.5).toFixed(2), // 50-90%
      revenue_impact: (pattern.count * (Math.random() * 100)).toFixed(2)
    })),
    
    // Keep brand trends
    brand_trends: originalData.brand_trends,
    
    // Add new data structures
    ai_insights: aiInsights,
    time_patterns: timePatterns,
    
    // Add demand forecast
    demand_forecast: {
      next_7_days: {
        cigarettes: Math.floor(Math.random() * 1000 + 3000),
        beverages: Math.floor(Math.random() * 1000 + 2500),
        snacks: Math.floor(Math.random() * 1000 + 4000),
        general: Math.floor(Math.random() * 1000 + 2000),
        dairy: Math.floor(Math.random() * 500 + 1000)
      },
      recommended_orders: {
        "Winston": { current_stock: 45, recommended_order: 120, urgency: "high" },
        "Del Monte Fruit Cocktail": { current_stock: 89, recommended_order: 60, urgency: "medium" },
        "Alaska Evaporated Milk": { current_stock: 156, recommended_order: 40, urgency: "low" }
      }
    },
    
    // Add cross-sell patterns
    cross_sell_patterns: [
      {
        primary_product: "Marlboro",
        frequently_bought_with: ["San Miguel Beer", "Boy Bawang", "C2"],
        confidence: 0.75,
        lift: 2.3,
        support: 0.15
      },
      {
        primary_product: "Alaska Evaporated Milk",
        frequently_bought_with: ["Milo", "Skyflakes", "Sugar"],
        confidence: 0.68,
        lift: 1.9,
        support: 0.12
      }
    ]
  };
  
  return enhancedData;
}

// Usage example:
// const enhancedData = transformDashboardData(originalData);
// console.log(JSON.stringify(enhancedData, null, 2));

// Export the transformation function
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { transformDashboardData };
}