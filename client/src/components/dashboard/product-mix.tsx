import { MoreHorizontal, Download, Share2, Package, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProductMix() {
  const { categoryData, brandData, isLoading } = useDashboardData();

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

  // Consistent color scheme
  const COLORS = {
    primary: "#3b82f6", // Blue for volume
    secondary: "#f59e0b", // Yellow for value
    tertiary: "#10b981", // Green for positive
    quaternary: "#ef4444", // Red for risk
    others: ["#8b5cf6", "#ec4899", "#f97316", "#84cc16"]
  };

  const categoryColors = [COLORS.primary, COLORS.secondary, COLORS.tertiary, COLORS.quaternary, ...COLORS.others];

  // Check for significant category dominance
  const hasDominantCategory = categoryData?.some(cat => cat.percentage > 40);

  const handleExport = (format: string) => {
    console.log(`Exporting as ${format}`);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      return (
        <div className="bg-white p-3 rounded shadow-lg border border-gray-200">
          <p className="text-sm font-medium">{payload[0].name || payload[0].payload.category}</p>
          <p className="text-sm text-blue-600">
            Value: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    if (percent < 0.05) return null; // Don't show label for small slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* Category Mix Chart */}
      <Card className="shadow-sm border border-gray-200 relative">
        {/* AI Insight Dot for dominant category */}
        {hasDominantCategory && (
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
              Category Mix
              <span className="text-xs font-normal text-muted-foreground bg-purple-50 text-purple-600 px-2 py-1 rounded">
                Distribution
              </span>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Product category breakdown by sales volume
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
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {categoryData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend with values */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData?.slice(0, 4).map((cat, index) => (
              <div key={cat.category} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded" 
                  style={{ backgroundColor: categoryColors[index] }}
                />
                <span className="text-muted-foreground">{cat.category}:</span>
                <span className="font-medium">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Brands Performance */}
      <Card className="shadow-sm border border-gray-200 relative">
        {/* Growth indicator for top brand */}
        {brandData && brandData[0]?.growth > 10 && (
          <div className="absolute top-4 right-14 z-10">
            <div className="bg-green-50 text-green-600 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Top Growth
            </div>
          </div>
        )}

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              Top Brands Performance
              <span className="text-xs font-normal text-muted-foreground bg-blue-50 text-blue-600 px-2 py-1 rounded">
                By Sales
              </span>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Leading brands by peso value
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
              <BarChart data={brandData?.slice(0, 8)} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  type="number" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                  tickFormatter={(value) => `₱${(value / 1000000).toFixed(1)}M`}
                />
                <YAxis 
                  dataKey="brand" 
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                  width={100}
                />
                <Tooltip 
                  formatter={(value: any) => [`₱${value.toLocaleString()}`, 'Sales']}
                  labelStyle={{ fontSize: 12 }}
                />
                <Bar 
                  dataKey="sales" 
                  fill="#3b82f6"
                  radius={[0, 8, 8, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Brand performance indicators */}
          <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t">
            {brandData?.slice(0, 4).map((brand, index) => (
              <div key={brand.brand} className="text-center">
                <p className="text-xs text-muted-foreground">{brand.brand}</p>
                <p className={`text-sm font-medium ${brand.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {brand.growth > 0 ? '+' : ''}{brand.growth}%
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}