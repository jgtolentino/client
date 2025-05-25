import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Package, Calendar, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { calculateMetrics } from "@/lib/data-calculations";
import { formatPercentage } from "@/lib/format-utils";

export default function TransactionMetrics() {
  const { dashboardData, isLoading } = useDashboardData();
  
  const metrics = useMemo(() => {
    if (!dashboardData || !dashboardData.transaction_trends) return null;
    return calculateMetrics(dashboardData.transaction_trends);
  }, [dashboardData]);

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const avgDuration = metrics?.avgDuration || 85;
  const avgUnits = metrics?.avgUnits || 3.2;
  const durationDist = metrics?.durationDistribution || {
    quick: 150,
    normal: 280,
    long: 70
  };
  const weekendVsWeekday = metrics?.weekendVsWeekday || {
    weekend: { percentage: 30, avgValue: 1950 },
    weekday: { percentage: 70, avgValue: 1820 }
  };

  const total = durationDist.quick + durationDist.normal + durationDist.long;

  return (
    <Card className="h-full">
      <CardHeader style={{ padding: '16px 20px', paddingBottom: '12px' }}>
        <CardTitle className="flex items-center" style={{ fontSize: '16px', gap: '8px' }}>
          <Activity style={{ width: '20px', height: '20px' }} />
          Transaction Metrics
        </CardTitle>
      </CardHeader>
      <CardContent style={{ padding: '16px 20px', paddingTop: '8px' }}>
        {/* Average Metrics */}
        <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '16px' }}>
          <div className="bg-blue-50 rounded-lg" style={{ padding: '12px' }}>
            <div className="flex items-center justify-between">
              <span className="text-blue-700" style={{ fontSize: '11px' }}>Avg Duration</span>
              <Clock className="text-blue-600" style={{ width: '16px', height: '16px' }} />
            </div>
            <p className="font-bold text-blue-700" style={{ fontSize: '24px', marginTop: '4px' }}>
              {Math.round(avgDuration)}s
            </p>
            <p className="text-blue-600" style={{ fontSize: '10px' }}>Per transaction</p>
          </div>
          
          <div className="bg-green-50 rounded-lg" style={{ padding: '12px' }}>
            <div className="flex items-center justify-between">
              <span className="text-green-700" style={{ fontSize: '11px' }}>Avg Units</span>
              <Package className="text-green-600" style={{ width: '16px', height: '16px' }} />
            </div>
            <p className="font-bold text-green-700" style={{ fontSize: '24px', marginTop: '4px' }}>
              {avgUnits.toFixed(1)}
            </p>
            <p className="text-green-600" style={{ fontSize: '10px' }}>Items per basket</p>
          </div>
        </div>

        {/* Duration Distribution */}
        <div style={{ marginBottom: '16px' }}>
          <h4 className="font-medium" style={{ fontSize: '13px', marginBottom: '8px' }}>
            Transaction Duration Distribution
          </h4>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between" style={{ fontSize: '11px', marginBottom: '2px' }}>
                <span>Quick ({"<"}1 min)</span>
                <span>{formatPercentage((durationDist.quick / total) * 100, 0)}%</span>
              </div>
              <Progress 
                value={(durationDist.quick / total) * 100} 
                className="h-2"
                style={{ backgroundColor: '#e0e7ff' }}
              />
            </div>
            <div>
              <div className="flex justify-between" style={{ fontSize: '11px', marginBottom: '2px' }}>
                <span>Normal (1-3 min)</span>
                <span>{formatPercentage((durationDist.normal / total) * 100, 0)}%</span>
              </div>
              <Progress 
                value={(durationDist.normal / total) * 100} 
                className="h-2"
                style={{ backgroundColor: '#e0e7ff' }}
              />
            </div>
            <div>
              <div className="flex justify-between" style={{ fontSize: '11px', marginBottom: '2px' }}>
                <span>Long ({">"}3 min)</span>
                <span>{formatPercentage((durationDist.long / total) * 100, 0)}%</span>
              </div>
              <Progress 
                value={(durationDist.long / total) * 100} 
                className="h-2"
                style={{ backgroundColor: '#e0e7ff' }}
              />
            </div>
          </div>
        </div>

        {/* Weekend vs Weekday */}
        <div className="border-t" style={{ paddingTop: '12px' }}>
          <h4 className="font-medium flex items-center" style={{ fontSize: '13px', marginBottom: '8px', gap: '4px' }}>
            <Calendar style={{ width: '14px', height: '14px' }} />
            Weekend vs Weekday Performance
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="border rounded-lg" style={{ padding: '8px' }}>
              <p className="font-medium" style={{ fontSize: '12px' }}>Weekday</p>
              <p className="text-muted-foreground" style={{ fontSize: '10px' }}>
                {formatPercentage(weekendVsWeekday.weekday.percentage, 0)}% of sales
              </p>
              <p className="font-semibold" style={{ fontSize: '14px', marginTop: '4px' }}>
                ₱{weekendVsWeekday.weekday.avgValue.toLocaleString()}
              </p>
              <p className="text-muted-foreground" style={{ fontSize: '9px' }}>avg transaction</p>
            </div>
            <div className="border rounded-lg" style={{ padding: '8px' }}>
              <p className="font-medium" style={{ fontSize: '12px' }}>Weekend</p>
              <p className="text-muted-foreground" style={{ fontSize: '10px' }}>
                {formatPercentage(weekendVsWeekday.weekend.percentage, 0)}% of sales
              </p>
              <p className="font-semibold" style={{ fontSize: '14px', marginTop: '4px' }}>
                ₱{weekendVsWeekday.weekend.avgValue.toLocaleString()}
              </p>
              <p className="text-muted-foreground" style={{ fontSize: '9px' }}>avg transaction</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}