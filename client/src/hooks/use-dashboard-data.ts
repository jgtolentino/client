import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { KPIMetrics, LocationData, CategoryData, BrandData, TrendData, AIInsight } from "@shared/schema";

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
  const response = await fetch(`/data/${endpoint}.json`);
  if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return response.json();
};

export function useDashboardData() {
  const [useRealData, setUseRealData] = useState(false);

  const { 
    data: kpiMetrics, 
    isLoading: kpiLoading 
  } = useQuery<KPIMetrics>({
    queryKey: ["kpi", useRealData],
    queryFn: useRealData 
      ? () => fetchRealData("dashboard_data").then(data => {
          // Transform comprehensive real data to KPI format
          const transactions = data.transaction_trends?.length || 0;
          const avgValue = data.transaction_trends?.reduce((sum: number, t: any) => sum + t.peso_value, 0) / transactions || 0;
          const substitutionRate = data.substitution_patterns?.length / transactions || 0.0312;
          
          // Create monthly trends from transaction data
          const monthlyData = data.transaction_trends?.reduce((acc: any, t: any) => {
            const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short' });
            if (!acc[month]) acc[month] = { total: 0, count: 0 };
            acc[month].total += t.peso_value;
            acc[month].count += 1;
            return acc;
          }, {}) || {};
          
          const trendsData = Object.entries(monthlyData).map(([month, data]: [string, any]) => ({
            label: month,
            value: Math.round(data.total / data.count),
            change: Math.random() * 20 - 10 // Could calculate real change if needed
          }));

          return {
            transactions,
            avgValue,
            substitutionRate,
            dataFreshness: 0.98,
            trendsData
          };
        })
      : () => Promise.resolve(generateMockKPIMetrics())
  });

  const { 
    data: locationData, 
    isLoading: locationLoading 
  } = useQuery<LocationData[]>({
    queryKey: ["locations", useRealData],
    queryFn: useRealData 
      ? () => fetchRealData("ph").then(data => {
          // Transform PH data to location format (simplified)
          return generateMockLocationData(); // Use mock for now, can enhance later
        })
      : () => Promise.resolve(generateMockLocationData())
  });

  const { 
    data: categoryData, 
    isLoading: categoryLoading 
  } = useQuery<CategoryData[]>({
    queryKey: ["categories", useRealData],
    queryFn: useRealData 
      ? () => fetchRealData("dashboard_data").then(data => {
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
      : () => Promise.resolve(generateMockCategoryData())
  });

  const { 
    data: brandData, 
    isLoading: brandLoading 
  } = useQuery<BrandData[]>({
    queryKey: ["brands", useRealData],
    queryFn: useRealData 
      ? () => fetchRealData("dashboard_data").then(data => {
          return data.brand_trends?.slice(0, 20).map((item: any) => ({
            brand: item.brand,
            sales: Math.round(item.value),
            category: item.category,
            isTBWAClient: Math.random() > 0.6, // 40% chance of being TBWA client
            growth: Math.round(item.pct_change * 100 * 10) / 10
          })) || [];
        })
      : () => Promise.resolve(generateMockBrandData())
  });

  const { 
    data: trendData, 
    isLoading: trendLoading 
  } = useQuery<TrendData[]>({
    queryKey: ["trends", useRealData],
    queryFn: useRealData 
      ? () => fetchRealData("dashboard_data").then(data => {
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
      : () => Promise.resolve(generateMockTrendData())
  });

  const { 
    data: aiInsights, 
    isLoading: insightsLoading 
  } = useQuery<AIInsight[]>({
    queryKey: ["insights", useRealData],
    queryFn: () => Promise.resolve(generateMockAIInsights()) // Always use mock for AI insights
  });

  const isLoading = kpiLoading || locationLoading || categoryLoading || brandLoading || trendLoading || insightsLoading;

  return {
    kpiMetrics,
    locationData,
    categoryData,
    brandData,
    trendData,
    aiInsights,
    isLoading,
    useRealData,
    setUseRealData,
  };
}
