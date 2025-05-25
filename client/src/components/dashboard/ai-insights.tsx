import React, { useMemo } from "react";
import { AlertTriangle, TrendingUp, Info, Target, Zap, Eye, Lightbulb, ShoppingBag, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { Skeleton } from "@/components/ui/skeleton";

interface AIInsightsProps {
  filters?: {
    dateRange: string;
    location: string;
    brand: string;
    category: string;
  };
}

// Generate dynamic insights based on current data and filters
function generateDynamicInsights(data: any, filters: any) {
  const insights = [];
  
  // Analyze brand performance
  if (data.brandData && data.brandData.length > 0) {
    const topBrand = data.brandData[0];
    const bottomBrand = data.brandData[data.brandData.length - 1];
    
    if (topBrand.growth > 10) {
      insights.push({
        id: "brand-growth",
        type: "info",
        icon: TrendingUp,
        title: `${topBrand.brand} Leading Growth`,
        description: `${topBrand.brand} shows ${topBrand.growth}% growth. Recommend expanding shelf space and running promotional campaigns.`,
        impact: "high",
        action: "Increase inventory by 20%"
      });
    }
    
    if (bottomBrand.growth < -5) {
      insights.push({
        id: "brand-decline",
        type: "warning",
        icon: AlertTriangle,
        title: `${bottomBrand.brand} Needs Attention`,
        description: `${bottomBrand.brand} declined ${Math.abs(bottomBrand.growth)}%. Consider repositioning or promotional support.`,
        impact: "medium",
        action: "Review pricing strategy"
      });
    }
  }
  
  // Analyze category trends
  if (data.categoryData && data.categoryData.length > 0) {
    const topCategory = data.categoryData[0];
    insights.push({
      id: "category-focus",
      type: "info",
      icon: ShoppingBag,
      title: `${topCategory.category} Dominates Sales`,
      description: `${topCategory.category} represents ${topCategory.percentage}% of sales. Optimize product mix within this category.`,
      impact: "high",
      action: "Expand SKU variety"
    });
  }
  
  // Analyze consumer behavior
  if (data.consumerProfilingData && data.consumerProfilingData.length > 10) {
    const avgAge = data.consumerProfilingData.reduce((sum: number, p: any) => sum + p.age, 0) / data.consumerProfilingData.length;
    insights.push({
      id: "consumer-insight",
      type: "info",
      icon: Users,
      title: `Target Demographics: Age ${Math.round(avgAge)}`,
      description: `Average consumer age is ${Math.round(avgAge)}. Tailor product placement and promotions to this demographic.`,
      impact: "medium",
      action: "Adjust marketing materials"
    });
  }
  
  // Filter-specific insights
  if (filters?.location !== "All Locations") {
    insights.push({
      id: "location-specific",
      type: "info",
      icon: Target,
      title: `${filters.location} Location Analysis`,
      description: `Viewing data specific to ${filters.location}. Consider local preferences in your strategy.`,
      impact: "medium",
      action: "Implement local promotions"
    });
  }
  
  return insights.slice(0, 3); // Return top 3 insights
}

export default function AIInsights({ filters }: AIInsightsProps) {
  const { aiInsights, brandData, categoryData, consumerProfilingData, isLoading } = useDashboardData();

  // Generate contextual insights based on current filters and data
  const dynamicInsights = useMemo(() => {
    if (isLoading) return [];
    return generateDynamicInsights({
      brandData,
      categoryData,
      consumerProfilingData
    }, filters);
  }, [brandData, categoryData, consumerProfilingData, filters, isLoading]);

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6">
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const getInsightColors = (type: string) => {
    switch (type) {
      case "error":
        return {
          border: "border-l-red-500",
          bg: "bg-red-50",
          iconBg: "bg-red-500",
          buttonBg: "bg-red-500 hover:bg-red-600"
        };
      case "warning":
        return {
          border: "border-l-yellow-500",
          bg: "bg-yellow-50",
          iconBg: "bg-yellow-500",
          buttonBg: "bg-yellow-500 hover:bg-yellow-600"
        };
      case "info":
      default:
        return {
          border: "border-l-blue-600",
          bg: "bg-blue-50",
          iconBg: "bg-blue-600",
          buttonBg: "bg-blue-600 hover:bg-blue-700"
        };
    }
  };

  // Use dynamic insights if available, fallback to static insights
  const insightsToShow = dynamicInsights.length > 0 ? dynamicInsights : aiInsights;

  return (
    <Card className="shadow-sm border border-gray-200 mt-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          AI Recommendation Panel
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-sm text-muted-foreground">Live insights</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insightsToShow?.map((insight: any) => {
            const IconComponent = insight.icon || Info;
            const colors = getInsightColors(insight.type);
            
            return (
              <div
                key={insight.id}
                className={`border-l-4 ${colors.border} ${colors.bg} p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">{insight.description}</p>
                    {insight.action && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">Action:</span>
                        <Button 
                          size="sm"
                          variant="ghost"
                          className="text-xs h-7 px-2"
                        >
                          {insight.action}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Contextual tip based on filters */}
        {filters && filters.dateRange !== "Last 30 Days" && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> You're viewing {filters.dateRange.toLowerCase()} data. 
              Compare with other periods to identify seasonal trends.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}