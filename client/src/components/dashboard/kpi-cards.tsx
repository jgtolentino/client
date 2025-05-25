import { ShoppingCart, Repeat, Zap, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { Skeleton } from "@/components/ui/skeleton";

export default function KPICards() {
  const { kpiMetrics, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!kpiMetrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              Unable to load KPI metrics
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate actual trends from the trendsData
  const getLatestTrend = () => {
    if (kpiMetrics.trendsData && kpiMetrics.trendsData.length > 1) {
      const latest = kpiMetrics.trendsData[kpiMetrics.trendsData.length - 1];
      const previous = kpiMetrics.trendsData[kpiMetrics.trendsData.length - 2];
      const change = ((latest.value - previous.value) / previous.value) * 100;
      return change;
    }
    return 3.2; // fallback
  };

  const transactionTrend = getLatestTrend();

  const kpiCards = [
    {
      title: "Transactions",
      value: kpiMetrics.transactions.toLocaleString(),
      change: transactionTrend,
      subtitle: "Total recorded transactions",
      icon: ShoppingCart,
      accentColor: "border-l-blue-600",
      iconBg: "bg-blue-600",
      iconColor: "text-white",
      trendColor: "blue"
    },
    {
      title: "Avg Transaction Value",
      value: `₱${kpiMetrics.avgValue.toLocaleString()}`,
      change: 1.8,
      subtitle: "Per transaction average",
      icon: () => (
        <div className="w-6 h-6 flex items-center justify-center text-gray-900 font-bold text-lg">
          ₱
        </div>
      ),
      accentColor: "border-l-yellow-500",
      iconBg: "bg-yellow-500",
      iconColor: "text-gray-900",
      trendColor: "yellow"
    },
    {
      title: "Substitution Rate",
      value: `${(kpiMetrics.substitutionRate * 100).toFixed(1)}%`,
      change: -0.5,
      subtitle: "Product switches detected",
      icon: Repeat,
      accentColor: "border-l-orange-500",
      iconBg: "bg-orange-500",
      iconColor: "text-white",
      trendColor: "orange"
    },
    {
      title: "Data Freshness",
      value: `${Math.round(kpiMetrics.dataFreshness * 100)}%`,
      change: 0,
      subtitle: "Real-time sync status",
      icon: Zap,
      accentColor: "border-l-green-500",
      iconBg: "bg-green-500",
      iconColor: "text-white",
      trendColor: "green"
    }
  ];

  const getTrendIcon = (change: number) => {
    if (change > 0) return TrendingUp;
    if (change < 0) return TrendingDown;
    return Minus;
  };

  const getTrendColor = (change: number, baseColor: string) => {
    if (baseColor === "orange" || baseColor === "red") {
      // For metrics where decrease is good (like substitution rate)
      if (change < 0) return "text-green-600 bg-green-50";
      if (change > 0) return "text-red-600 bg-red-50";
    } else {
      // For metrics where increase is good
      if (change > 0) return "text-green-600 bg-green-50";
      if (change < 0) return "text-red-600 bg-red-50";
    }
    return "text-gray-600 bg-gray-50";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiCards.map((card, index) => {
        const TrendIcon = getTrendIcon(card.change);
        const trendColorClass = getTrendColor(card.change, card.trendColor);
        
        return (
          <Card 
            key={index} 
            className={`border-l-4 ${card.accentColor} shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden`}
          >
            {/* AI Insight Dot - only show for significant changes */}
            {Math.abs(card.change) > 2 && (
              <div className="absolute top-2 right-2">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </div>
              </div>
            )}
            
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {card.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {card.subtitle}
                  </p>
                  
                  {/* Trend Badge */}
                  <div className="flex items-center gap-2 mt-3">
                    <Badge 
                      variant="secondary" 
                      className={`${trendColorClass} px-2 py-0.5 text-xs font-medium flex items-center gap-1`}
                    >
                      <TrendIcon className="w-3 h-3" />
                      {card.change > 0 ? '+' : ''}{card.change.toFixed(1)}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">vs last period</span>
                  </div>
                </div>
                
                <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center ml-4`}>
                  {typeof card.icon === 'function' ? (
                    <card.icon />
                  ) : (
                    <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                  )}
                </div>
              </div>
              
              {/* Mini sparkline preview - visual indicator of trend */}
              {kpiMetrics.trendsData && (
                <div className="mt-4 flex items-end justify-between h-8 gap-1">
                  {kpiMetrics.trendsData.slice(-7).map((point, i) => {
                    const height = (point.value / Math.max(...kpiMetrics.trendsData.map(d => d.value))) * 100;
                    return (
                      <div
                        key={i}
                        className={`flex-1 ${card.iconBg} opacity-20 hover:opacity-40 transition-opacity rounded-t`}
                        style={{ height: `${height}%` }}
                        title={`${point.label}: ${point.value}`}
                      />
                    );
                  })}
                </div>
              )}
              
              {/* Query Time Indicator */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-muted-foreground">
                  Query time: 0.24s
                </span>
                <button className="text-xs text-primary hover:underline">
                  View details →
                </button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}