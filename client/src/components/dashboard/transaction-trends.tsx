import { MoreHorizontal, Download, Share2, AlertCircle, TrendingUp, Clock, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, Tooltip, ReferenceLine, Cell } from "recharts";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatPeso, formatCompactNumber, formatDate } from "@/lib/format-utils";
import { useState } from "react";

export default function TransactionTrends() {
  const { kpiMetrics, trendData, isLoading } = useDashboardData();
  const [viewMode, setViewMode] = useState<'hourly' | 'daily'>('hourly');

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="p-6">
          <Skeleton className="h-full w-full" />
        </CardContent>
      </Card>
    );
  }

  const hourlyData = kpiMetrics?.trendsData || [];
  const valueData = trendData || [];

  // Mark peak hours (6-9 AM, 5-8 PM)
  const hourlyDataWithPeaks = hourlyData.map(item => {
    const hour = parseInt(item.label.split(':')[0]);
    const isPeak = (hour >= 6 && hour <= 9) || (hour >= 17 && hour <= 20);
    return { ...item, isPeak };
  });

  // Find peak transaction period
  const peakHour = hourlyDataWithPeaks.reduce((max, current) => 
    current.value > max.value ? current : max, 
    hourlyDataWithPeaks[0] || { label: '', value: 0, isPeak: false }
  );

  // Calculate 24h volume
  const totalVolume = hourlyData.reduce((sum, item) => sum + item.value, 0);

  // Check for significant changes
  const hasSignificantChange = hourlyData.some(item => Math.abs(item.change || 0) > 5);

  const handleExport = (format: string) => {
    // Implement export logic
    console.log(`Exporting as ${format}`);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded shadow-lg border border-gray-200">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-blue-600">
            Volume: {formatNumber(payload[0].value)}
          </p>
          {data.isPeak && (
            <p className="text-xs text-orange-600 font-medium flex items-center gap-1">
              <Flame className="h-3 w-3" />
              Peak Hour
            </p>
          )}
          {data.change !== undefined && (
            <p className={`text-xs ${data.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              Change: {data.change > 0 ? '+' : ''}{data.change}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const ValueTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload[0]) {
      return (
        <div className="bg-white p-3 rounded shadow-lg border border-gray-200">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-yellow-600">
            {formatPeso(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const formatNumber = (value: number) => value.toLocaleString();

  return (
    <Card className="shadow-sm border border-gray-200 relative h-full">
      {/* AI Insight Dot */}
      {hasSignificantChange && (
        <div className="absolute" style={{ top: '16px', right: '56px', zIndex: 10 }}>
          <div className="relative flex" style={{ height: '12px', width: '12px' }}>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full bg-purple-500" style={{ height: '12px', width: '12px' }}></span>
          </div>
        </div>
      )}

      <CardHeader className="flex flex-row items-center justify-between space-y-0" style={{ padding: '16px 20px', paddingBottom: '12px' }}>
        <div>
          <CardTitle className="font-semibold flex items-center" style={{ fontSize: '16px', gap: '8px' }}>
            Transaction Trends
            <span className="font-normal text-muted-foreground bg-blue-50 text-blue-600 rounded" style={{ fontSize: '11px', padding: '2px 8px' }}>
              {viewMode === 'hourly' ? 'Hourly' : 'Daily'} Analysis
            </span>
          </CardTitle>
          {/* Time Annotations */}
          <div className="flex items-center text-muted-foreground" style={{ gap: '16px', marginTop: '8px', fontSize: '11px' }}>
            <span className="flex items-center" style={{ gap: '4px' }}>
              <Clock style={{ width: '12px', height: '12px' }} />
              Peak: {peakHour.label}
            </span>
            <span>24h volume: {formatNumber(totalVolume)}</span>
            <span className="flex items-center text-orange-600" style={{ gap: '4px' }}>
              <Flame style={{ width: '12px', height: '12px' }} />
              Peak hours: 6-9 AM, 5-8 PM
            </span>
          </div>
        </div>
        
        <div className="flex items-center" style={{ gap: '8px' }}>
          {/* View Mode Toggle */}
          <div className="flex rounded-md shadow-sm">
            <button
              className={`px-3 py-1 text-xs font-medium rounded-l-md border ${
                viewMode === 'hourly' 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setViewMode('hourly')}
            >
              Hourly
            </button>
            <button
              className={`px-3 py-1 text-xs font-medium rounded-r-md border-t border-r border-b ${
                viewMode === 'daily' 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setViewMode('daily')}
            >
              Daily
            </button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" style={{ padding: '4px' }}>
                <MoreHorizontal style={{ width: '20px', height: '20px' }} />
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
        </div>
      </CardHeader>
      
      <CardContent style={{ padding: '0 20px 20px', height: 'calc(100% - 80px)' }}>
        {viewMode === 'hourly' ? (
          <div className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyDataWithPeaks} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="label" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#666' }}
                  interval={1}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#666' }}
                  tickFormatter={(value) => formatCompactNumber(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  radius={[6, 6, 0, 0]}
                  animationDuration={1000}
                >
                  {hourlyDataWithPeaks.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.isPeak ? '#f97316' : '#3b82f6'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={valueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="period" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#666' }}
                  tickFormatter={(value) => formatDate(value)}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#666' }}
                  tickFormatter={(value) => formatCompactNumber(value)}
                />
                <Tooltip content={<ValueTooltip />} />
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
        )}
      </CardContent>
    </Card>
  );
}