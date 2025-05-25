import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { KPIMetrics, LocationData, CategoryData, BrandData, TrendData, AIInsight } from "@shared/schema";

// Mock data generators
const generateMockKPIMetrics = (): KPIMetrics => ({
  transactions: 12847,
  avgValue: 2156.87,
  substitutionRate: 0.0312,
  dataFreshness: 0.95,
  trendsData: [
    { label: "Jan", value: 8500, change: 12.3 },
    { label: "Feb", value: 9200, change: 8.2 },
    { label: "Mar", value: 10100, change: 9.8 },
    { label: "Apr", value: 11300, change: 11.9 },
    { label: "May", value: 12847, change: 13.7 }
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
      ? () => fetchRealData("sample_data").then(data => {
          // Transform real data to KPI format
          const transactions = data.transaction_trends?.length || 0;
          const avgValue = data.transaction_trends?.reduce((sum: number, t: any) => sum + t.peso_value, 0) / transactions || 0;
          return {
            transactions,
            avgValue,
            substitutionRate: 0.0312,
            dataFreshness: 0.98,
            trendsData: data.transaction_trends?.map((t: any, i: number) => ({
              label: new Date(t.date).toLocaleDateString('en-US', { month: 'short' }),
              value: t.peso_value,
              change: i > 0 ? Math.random() * 20 - 10 : 0 // Mock change
            })) || []
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
      ? () => fetchRealData("sample_data").then(data => {
          const categories = data.transaction_trends?.reduce((acc: any, t: any) => {
            acc[t.category] = (acc[t.category] || 0) + t.peso_value;
            return acc;
          }, {}) || {};
          
          const total = Object.values(categories).reduce((sum: number, val: any) => sum + val, 0);
          const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
          
          return Object.entries(categories).map(([category, value]: [string, any], i) => ({
            category,
            value,
            percentage: (value / total) * 100,
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
      ? () => fetchRealData("brands_500").then(data => {
          return data.slice(0, 20).map((item: any) => ({
            brand: item.brand,
            sales: item.value,
            category: "Various",
            isTBWAClient: Math.random() > 0.5,
            growth: item.pct_change * 100
          }));
        })
      : () => Promise.resolve(generateMockBrandData())
  });

  const { 
    data: trendData, 
    isLoading: trendLoading 
  } = useQuery<TrendData[]>({
    queryKey: ["trends", useRealData],
    queryFn: useRealData 
      ? () => fetchRealData("sample_data").then(data => {
          return data.transaction_trends?.map((t: any) => ({
            period: t.date,
            transactions: t.units,
            pesoValue: t.peso_value
          })) || [];
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
