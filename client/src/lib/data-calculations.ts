import { formatPeso, formatPercentage } from './format-utils';

// Calculate real metrics from transaction data
export const calculateMetrics = (transactions: any[]) => {
  if (!transactions || transactions.length === 0) return null;

  // Store influence metrics
  const influencedTransactions = transactions.filter(t => t.was_recommended);
  const successfulInfluence = influencedTransactions.filter(t => t.influence_success);
  
  const storeInfluence = {
    totalInfluenced: influencedTransactions.length,
    successfulInfluenced: successfulInfluence.length,
    influenceRate: (influencedTransactions.length / transactions.length) * 100,
    successRate: influencedTransactions.length > 0 
      ? (successfulInfluence.length / influencedTransactions.length) * 100 
      : 0
  };

  // Peak hour analysis
  const hourlyVolumes = transactions.reduce((acc, t) => {
    const hour = t.hour || parseInt(t.time?.split(':')[0] || '0');
    if (!acc[hour]) acc[hour] = { count: 0, value: 0 };
    acc[hour].count++;
    acc[hour].value += t.peso_value || 0;
    return acc;
  }, {} as Record<number, {count: number, value: number}>);

  const peakHours = Object.entries(hourlyVolumes)
    .map(([hour, data]) => ({
      hour: parseInt(hour),
      ...data,
      isPeak: (parseInt(hour) >= 6 && parseInt(hour) <= 9) || 
              (parseInt(hour) >= 17 && parseInt(hour) <= 20)
    }))
    .sort((a, b) => b.count - a.count);

  // Substitution analysis
  const substitutionTransactions = transactions.filter(t => 
    t.originally_requested && t.originally_requested !== t.brand
  );
  
  const substitutionRate = (substitutionTransactions.length / transactions.length) * 100;
  
  const substitutionPatterns = substitutionTransactions.reduce((acc, t) => {
    const key = `${t.originally_requested} → ${t.brand}`;
    if (!acc[key]) acc[key] = 0;
    acc[key]++;
    return acc;
  }, {} as Record<string, number>);

  const topSubstitutions = Object.entries(substitutionPatterns)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([pattern, count]) => {
      const [from, to] = pattern.split(' → ');
      return { from, to, count };
    });

  // Duration and units analysis
  const avgDuration = transactions.reduce((sum, t) => sum + (t.duration_seconds || 0), 0) / transactions.length;
  const avgUnits = transactions.reduce((sum, t) => sum + (t.units || 0), 0) / transactions.length;
  
  const durationDistribution = {
    quick: transactions.filter(t => t.duration_seconds < 60).length,
    normal: transactions.filter(t => t.duration_seconds >= 60 && t.duration_seconds < 180).length,
    long: transactions.filter(t => t.duration_seconds >= 180).length
  };

  // Weekend vs Weekday
  const weekendTransactions = transactions.filter(t => t.is_weekend);
  const weekdayTransactions = transactions.filter(t => !t.is_weekend);
  
  const weekendVsWeekday = {
    weekend: {
      count: weekendTransactions.length,
      avgValue: weekendTransactions.reduce((sum, t) => sum + t.peso_value, 0) / weekendTransactions.length || 0,
      percentage: (weekendTransactions.length / transactions.length) * 100
    },
    weekday: {
      count: weekdayTransactions.length,
      avgValue: weekdayTransactions.reduce((sum, t) => sum + t.peso_value, 0) / weekdayTransactions.length || 0,
      percentage: (weekdayTransactions.length / transactions.length) * 100
    }
  };

  // Category-wise metrics
  const categoryMetrics = transactions.reduce((acc, t) => {
    if (!acc[t.category]) {
      acc[t.category] = {
        count: 0,
        totalValue: 0,
        units: 0,
        avgMargin: 0,
        margins: []
      };
    }
    acc[t.category].count++;
    acc[t.category].totalValue += t.peso_value || 0;
    acc[t.category].units += t.units || 0;
    if (t.margin_percentage) {
      acc[t.category].margins.push(parseFloat(t.margin_percentage));
    }
    return acc;
  }, {} as Record<string, any>);

  // Calculate average margins
  Object.values(categoryMetrics).forEach((cat: any) => {
    if (cat.margins.length > 0) {
      cat.avgMargin = cat.margins.reduce((sum: number, m: number) => sum + m, 0) / cat.margins.length;
    }
    delete cat.margins; // Clean up
  });

  return {
    storeInfluence,
    peakHours,
    substitutionRate,
    topSubstitutions,
    avgDuration,
    avgUnits,
    durationDistribution,
    weekendVsWeekday,
    categoryMetrics
  };
};

// Calculate customer behavior patterns
export const calculateBehaviorPatterns = (transactions: any[], customers: any[]) => {
  // Request method analysis
  const requestMethods = transactions.reduce((acc, t) => {
    const method = t.request_method || 'Unknown';
    if (!acc[method]) acc[method] = { count: 0, percentage: 0 };
    acc[method].count++;
    return acc;
  }, {} as Record<string, any>);

  const totalRequests = Object.values(requestMethods).reduce((sum: number, m: any) => sum + m.count, 0);
  Object.values(requestMethods).forEach((method: any) => {
    method.percentage = (method.count / totalRequests) * 100;
  });

  // Customer demographics
  const demographics = {
    gender: customers.reduce((acc, c) => {
      acc[c.gender || 'Unknown'] = (acc[c.gender || 'Unknown'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    ageGroups: customers.reduce((acc, c) => {
      const age = c.age || 0;
      const group = age < 18 ? 'Under 18' :
                   age < 25 ? '18-24' :
                   age < 35 ? '25-34' :
                   age < 45 ? '35-44' :
                   age < 55 ? '45-54' : '55+';
      acc[group] = (acc[group] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    locations: customers.reduce((acc, c) => {
      acc[c.location || 'Unknown'] = (acc[c.location || 'Unknown'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  // Preference signals
  const preferences = [
    {
      signal: 'Brand Loyalty',
      strength: customers.reduce((sum, c) => sum + (c.brand_loyalty_score || 0), 0) / customers.length * 10,
      trend: '+2%'
    },
    {
      signal: 'Price Sensitivity',
      strength: customers.reduce((sum, c) => sum + (c.price_sensitivity_score || 0), 0) / customers.length * 10,
      trend: '-1%'
    },
    {
      signal: 'Quality Focus',
      strength: Math.random() * 30 + 60, // Placeholder as not in data
      trend: '+3%'
    },
    {
      signal: 'Convenience',
      strength: Math.random() * 20 + 40, // Placeholder as not in data
      trend: '0%'
    }
  ];

  return {
    requestMethods: Object.entries(requestMethods).map(([method, data]) => ({
      method,
      ...data
    })),
    demographics,
    preferences
  };
};

// Filter data based on dashboard filters
export const filterTransactionData = (
  transactions: any[],
  filters: {
    dateRange: string;
    location: string;
    brand: string;
    category: string;
  }
) => {
  let filtered = [...transactions];

  // Date range filter
  if (filters.dateRange !== 'All Time') {
    const now = new Date();
    let startDate = new Date();
    
    switch (filters.dateRange) {
      case 'Today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'Last 7 Days':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'Last 30 Days':
        startDate.setDate(now.getDate() - 30);
        break;
      case 'Last 90 Days':
        startDate.setDate(now.getDate() - 90);
        break;
    }
    
    filtered = filtered.filter(t => new Date(t.date) >= startDate);
  }

  // Location filter
  if (filters.location !== 'All Locations') {
    filtered = filtered.filter(t => t.city === filters.location || t.store_location === filters.location);
  }

  // Brand filter
  if (filters.brand !== 'All Brands') {
    if (filters.brand === 'Top 10 Brands') {
      const brandCounts = filtered.reduce((acc, t) => {
        acc[t.brand] = (acc[t.brand] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const top10Brands = Object.entries(brandCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([brand]) => brand);
      
      filtered = filtered.filter(t => top10Brands.includes(t.brand));
    } else {
      filtered = filtered.filter(t => t.brand === filters.brand);
    }
  }

  // Category filter
  if (filters.category !== 'All Categories') {
    filtered = filtered.filter(t => t.category === filters.category);
  }

  return filtered;
};