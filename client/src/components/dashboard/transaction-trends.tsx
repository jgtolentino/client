import { MoreHorizontal, Download, Share2, AlertCircle, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, Tooltip, ReferenceLine } from "recharts";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TransactionTrends() {
  const { kpiMetrics, trendData, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const hourlyData = kpiMetrics?.trendsData || [];
  const valueData = trendData || [];

  // Find peak transaction period
  const peakHour = hourlyData.reduce((max, current) => 
    current.value > max.value ? current : max, 
    hourlyData[0] || { label: '', value: 0 }
  );

  // Calculate 24h volume
  const totalVolume = hourlyData.reduce((sum, item) => sum + item.value, 0);

  // Check for significant changes
  const hasSignificantChange = hourlyData.some(item => Math.abs(item.change) > 5);

  const handleExport = (format: string) => {
    // Implement export logic
    console.log(`Exporting as ${format}`);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload[0]) {
      return (
        <div className="bg-white p-3 rounded shadow-lg border border-gray-200">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-blue-600">Volume: {payload[0].value.toLocaleString()}</p>
          {payload[0].payload.change && (
            <p className="text-xs text-gray-500">
              Change: {payload[0].payload.change > 0 ? '+' : ''}{payload[0].payload.change}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Transaction Volume Chart */}
      <Card className="shadow-sm border border-gray-200 relative">
        {/* AI Insight Dot */}
        {hasSignificantChange && (
          <div className="absolute top-4 right-14 z-10">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
            </div>
          </div>
        )}

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              Transaction Trends
              <span className="text-xs font-normal text-muted-foreground bg-blue-50 text-blue-600 px-2 py-1 rounded">
                Volume Analysis
              </span>
            </CardTitle>
            {/* Time Annotations */}
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Peak: {peakHour.label}
              </span>
              <span>24h volume: {totalVolume.toLocaleString()}</span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                <Download className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('png')}>
                <Download className="mr-2 h-4 w-4" />
                Export as PNG
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                Share Insight
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="label" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <Tooltip content={<CustomTooltip />} />
                {/* Peak hour reference line */}
                <ReferenceLine 
                  x={peakHour.label} 
                  stroke="#8b5cf6" 
                  strokeDasharray="3 3"
                  label={{ value: "Peak", position: "top", fill: "#8b5cf6", fontSize: 12 }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Value Chart */}
      <Card className="shadow-sm border border-gray-200 relative">
        {/* Trend Indicator */}
        {valueData.length > 1 && (
          <div className="absolute top-4 right-14 z-10">
            <div className="bg-green-50 text-green-600 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Growing
            </div>
          </div>
        )}

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              Transaction Value Trends
              <span className="text-xs font-normal text-muted-foreground bg-yellow-50 text-yellow-600 px-2 py-1 rounded">
                Peso Value
              </span>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Daily average transaction values
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                <Download className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                Share Insight
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={valueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="period" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                  tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value: any) => [`₱${value.toLocaleString()}`, 'Value']}
                  labelStyle={{ fontSize: 12 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="pesoValue" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Insight Callout */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <strong>Insight:</strong> Transaction values show consistent growth pattern. 
              Consider inventory adjustments for high-value periods.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}