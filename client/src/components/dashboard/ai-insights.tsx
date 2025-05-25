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
    <Card className="shadow-sm border border-gray-200 h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0" style={{ padding: '12px 20px', height: '48px' }}>
        <CardTitle className="font-semibold flex items-center" style={{ fontSize: '16px', gap: '8px' }}>
          <Lightbulb className="text-yellow-500" style={{ width: '20px', height: '20px' }} />
          AI Recommendation Panel
        </CardTitle>
        <div className="flex items-center" style={{ gap: '8px' }}>
          <span className="relative flex" style={{ height: '8px', width: '8px' }}>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full bg-green-500" style={{ height: '8px', width: '8px' }}></span>
          </span>
          <span className="text-muted-foreground" style={{ fontSize: '12px' }}>Live insights</span>
        </div>
      </CardHeader>
      <CardContent style={{ padding: '16px 20px', height: 'calc(100% - 48px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', height: '100%' }}>
          {insightsToShow?.map((insight: any) => {
            const IconComponent = insight.icon || Info;
            const colors = getInsightColors(insight.type);
            
            return (
              <div
                key={insight.id}
                className={`border-l-4 ${colors.border} ${colors.bg} rounded-lg shadow-sm hover:shadow-md transition-shadow h-full`}
                style={{ padding: '12px' }}
              >
                <div className="flex items-start h-full" style={{ gap: '12px' }}>
                  <div className={`${colors.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`} style={{ width: '36px', height: '36px' }}>
                    <IconComponent className="text-white" style={{ width: '20px', height: '20px' }} />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h4 className="font-semibold text-gray-900" style={{ fontSize: '14px', marginBottom: '4px' }}>{insight.title}</h4>
                    <p className="text-gray-600 leading-relaxed flex-1" style={{ fontSize: '12px', marginBottom: '8px' }}>{insight.description}</p>
                    {insight.action && (
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-500" style={{ fontSize: '11px' }}>Action:</span>
                        <Button 
                          size="sm"
                          variant="ghost"
                          style={{ fontSize: '11px', height: '24px', padding: '0 8px' }}
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
      </CardContent>
    </Card>
  );
}