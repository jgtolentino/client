import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { KPIMetrics, LocationData, CategoryData, BrandData, TrendData, AIInsight } from "@shared/schema";

// Determine if we should use API or static data
const USE_API = process.env.NODE_ENV === 'production' && window.location.hostname !== 'localhost';

// API configuration
const API_URL = process.env.NODE_ENV === 'production' 
  ? process.env.VITE_API_URL || 'https://your-backend.railway.app/api'
  : 'http://localhost:5000/api';

// Mock data generators
const generateMockKPIMetrics = (): KPIMetrics => ({
  transactions: 8542,
  avgValue: 1834.56,
  substitutionRate: 0.0287,
  dataFreshness: 0.92,
  trendsData: [
    { label: "Jan", value: 6800, change: 8.5 },
    { label: "Feb", value: 7200, change: 5.9 },
    { label: "Mar", value: 7850, change: 9.0 },
    { label: "Apr", value: 8100, change: 3.2 },
    { label: "May", value: 8542, change: 5.5 }
  ]
});

const generateMockLocationData = (): LocationData[] => [
  { location: "Manila", transactions: 4567, revenue: 9876543, coordinates: [121.0244, 14.5906], change: 15.2 },
  { location: "Cebu", transactions: 3421, revenue: 7234567, coordinates: [123.8854, 10.3157], change: -3.1 },
  { location: "Davao", transactions: 2891, revenue: 5987654, coordinates: [125.6147, 7.0731], change: 8.7 },
  { location: "Iloilo", transactions: 1968, revenue: 4123456, coordinates: [122.5690, 10.7202], change: 12.4 }
];

const generateMockCategoryData = (): CategoryData[] => [
  { category: "Electronics", value: 45, percentage: 45, color: "#3b82f6" },
  { category: "Food & Beverage", value: 30, percentage: 30, color: "#10b981" },
  { category: "Personal Care", value: 15, percentage: 15, color: "#f59e0b" },
  { category: "Others", value: 10, percentage: 10, color: "#6b7280" }
];

const generateMockBrandData = (): BrandData[] => [
  { brand: "Nike", sales: 2400000, category: "Apparel", isTBWAClient: true, growth: 15.3 },
  { brand: "Apple", sales: 1800000, category: "Electronics", isTBWAClient: false, growth: -2.1 },
  { brand: "Coca-Cola", sales: 1600000, category: "Beverages", isTBWAClient: true, growth: 8.7 },
  { brand: "Samsung", sales: 1400000, category: "Electronics", isTBWAClient: false, growth: 5.2 }
];

const generateMockTrendData = (): TrendData[] => [
  { period: "2025-01", transactions: 8500, pesoValue: 18375000 },
  { period: "2025-02", transactions: 9200, pesoValue: 19844000 },
  { period: "2025-03", transactions: 10100, pesoValue: 21816000 },
  { period: "2025-04", transactions: 11300, pesoValue: 24407000 },
  { period: "2025-05", transactions: 12847, pesoValue: 27746000 }
];

const generateMockAIInsights = (): AIInsight[] => [
  {
    id: "1",
    type: "warning",
    title: "Sales Decline in Cebu",
    description: "3.1% decrease in transactions detected in Cebu region",
    impact: "medium",
    timestamp: new Date().toISOString()
  },
  {
    id: "2", 
    type: "info",
    title: "Strong Growth in Manila",
    description: "15.2% increase in revenue compared to last quarter",
    impact: "high",
    timestamp: new Date().toISOString()
  }
];

// Data fetchers
const fetchRealData = async (endpoint: string) => {
  // Use API endpoint when configured
  if (USE_API) {
    try {
      const response = await fetch(`${API_URL}/dashboard-data`);
      if (!response.ok) throw new Error(`API request failed: ${response.status}`);
      return response.json();
    } catch (error) {
      console.warn('API fetch failed, falling back to static data:', error);
      // Fallback to static data
    }
  }
  
  // Fallback to static JSON files
  const response = await fetch(`/data/${endpoint}.json`);
  if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return response.json();
};

// Fetch data from Parquet API
const fetchParquetData = async (sql: string) => {
  if (!USE_API) {
    throw new Error('API not available');
  }

  const response = await fetch(`${API_URL}/datasources/parquet/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql }),
  });

  if (!response.ok) {
    throw new Error(`Parquet query failed: ${response.status}`);
  }

  const result = await response.json();
  return result.rows;
};

export function useDashboardData() {
  const [useRealData, setUseRealData] = useState(true); // Default to real data

  // Fetch the full dashboard data
  const { 
    data: dashboardData, 
    isLoading: dataLoading 
  } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: () => fetchRealData("dashboard_data")
  });

  const { 
    data: kpiMetrics, 
    isLoading: kpiLoading 
  } = useQuery<KPIMetrics>({
    queryKey: ["kpi", dashboardData],
    queryFn: () => {
      if (!dashboardData) return generateMockKPIMetrics();
      
      const data = dashboardData;
      // Transform comprehensive real data to KPI format
      // Count the number of transaction records (not sum of units)
      const transactions = data.transaction_trends?.length || 0;
      const avgValue = data.transaction_trends?.reduce((sum: number, t: any) => sum + t.peso_value, 0) / transactions || 0;
      const substitutionRate = data.substitution_patterns?.length / transactions || 0.0312;
      
      // Calculate total brand mentions/detections
      const totalMentions = (data.transaction_trends?.length || 0) + 
                           (data.brand_trends?.length || 0) + 
                           (data.basket_analysis?.length || 0);
      
      // Use hourly patterns if available in enhanced data
      let trendsData;
      if (data.time_patterns && data.time_patterns.hourly_patterns) {
        trendsData = data.time_patterns.hourly_patterns.map((pattern: any) => ({
          label: pattern.time_label,
          value: Math.round(parseFloat(pattern.total_revenue)),
          change: pattern.is_peak ? 10 : -5,
          isPeak: pattern.is_peak
        }));
      } else {
        // Fallback to monthly trends
        const monthlyData = data.transaction_trends?.reduce((acc: any, t: any) => {
          const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short' });
          if (!acc[month]) acc[month] = { total: 0, count: 0 };
          acc[month].total += t.peso_value;
          acc[month].count += 1;
          return acc;
        }, {}) || {};
        
        trendsData = Object.entries(monthlyData).map(([month, data]: [string, any]) => ({
          label: month,
          value: Math.round(data.total / data.count),
          change: Math.random() * 20 - 10
        }));
      }

      return {
        transactions,
        avgValue,
        substitutionRate,
        dataFreshness: 0.98,
        totalMentions,
        trendsData
      };
    }
  });

  const { 
    data: locationData, 
    isLoading: locationLoading 
  } = useQuery<LocationData[]>({
    queryKey: ["locations"],
    queryFn: () => Promise.resolve(generateMockLocationData())
  });

  const { 
    data: categoryData, 
    isLoading: categoryLoading 
  } = useQuery<CategoryData[]>({
    queryKey: ["categories"],
    queryFn: () => fetchRealData("dashboard_data").then(data => {
      const categories = data.transaction_trends?.reduce((acc: any, t: any) => {
        acc[t.category] = (acc[t.category] || 0) + t.peso_value;
        return acc;
      }, {}) || {};
      
      const total = Object.values(categories).reduce((sum: number, val: any) => sum + val, 0);
      const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#f97316", "#84cc16"];
      
      return Object.entries(categories).map(([category, value]: [string, any], i) => ({
        category,
        value: Math.round(value),
        percentage: Math.round((value / total) * 100 * 10) / 10,
        color: colors[i % colors.length]
      }));
    })
  });

  const { 
    data: brandData, 
    isLoading: brandLoading 
  } = useQuery<BrandData[]>({
    queryKey: ["brands"],
    queryFn: () => fetchRealData("dashboard_data").then(data => {
      return data.brand_trends?.slice(0, 20).map((item: any) => ({
        brand: item.brand,
        sales: Math.round(item.value),
        category: item.category,
        isTBWAClient: Math.random() > 0.6, // 40% chance of being TBWA client
        growth: Math.round(item.pct_change * 100 * 10) / 10
      })) || [];
    })
  });

  const { 
    data: trendData, 
    isLoading: trendLoading 
  } = useQuery<TrendData[]>({
    queryKey: ["trends"],
    queryFn: () => fetchRealData("dashboard_data").then(data => {
      // Aggregate by date for cleaner trends
      const dailyData = data.transaction_trends?.reduce((acc: any, t: any) => {
        if (!acc[t.date]) acc[t.date] = { transactions: 0, pesoValue: 0, count: 0 };
        acc[t.date].transactions += t.units;
        acc[t.date].pesoValue += t.peso_value;
        acc[t.date].count += 1;
        return acc;
      }, {}) || {};
      
      return Object.entries(dailyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(0, 30) // Last 30 data points
        .map(([date, data]: [string, any]) => ({
          period: date,
          transactions: data.transactions,
          pesoValue: Math.round(data.pesoValue)
        }));
    })
  });

  const { 
    data: aiInsights, 
    isLoading: insightsLoading 
  } = useQuery<AIInsight[]>({
    queryKey: ["insights"],
    queryFn: () => fetchRealData("dashboard_data").then(data => {
      // Use AI insights from the enhanced data if available
      if (data.ai_insights && data.ai_insights.length > 0) {
        return data.ai_insights.map((insight: any) => ({
          id: insight.insight_id,
          type: insight.type === 'opportunity' ? 'info' : insight.type === 'anomaly' ? 'warning' : 'error',
          title: insight.message.split(' ').slice(0, 5).join(' ') + '...',
          description: insight.message,
          impact: insight.severity,
          timestamp: new Date().toISOString(),
          recommendation: insight.recommendation,
          confidence: insight.confidence_score
        }));
      }
      // Fallback to generated insights
      return generateMockAIInsights();
    })
  });

  const { 
    data: basketData, 
    isLoading: basketLoading 
  } = useQuery({
    queryKey: ["basket"],
    queryFn: () => fetchRealData("dashboard_data").then(data => data.basket_analysis || [])
  });

  const { 
    data: substitutionData, 
    isLoading: substitutionLoading 
  } = useQuery({
    queryKey: ["substitution"],
    queryFn: () => fetchRealData("dashboard_data").then(data => data.substitution_patterns || [])
  });

  const { 
    data: consumerProfilingData, 
    isLoading: profilingLoading 
  } = useQuery({
    queryKey: ["profiling"],
    queryFn: () => fetchRealData("dashboard_data").then(data => data.consumer_profiling || [])
  });

  const isLoading = kpiLoading || locationLoading || categoryLoading || brandLoading || 
                    trendLoading || insightsLoading || basketLoading || substitutionLoading || profilingLoading;

  return {
    dashboardData, // Expose full data for components to use
    kpiMetrics,
    locationData,
    categoryData,
    brandData,
    trendData,
    aiInsights,
    basketData,
    substitutionData,
    consumerProfilingData,
    behaviorData: dashboardData?.consumer_behavior, // Add behavior data
    isLoading,
  };
}
