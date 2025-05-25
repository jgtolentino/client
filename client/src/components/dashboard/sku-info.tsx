import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, TrendingUp, Repeat } from "lucide-react";
import { useDashboardData } from "@/hooks/use-dashboard-data";

export default function SKUInfo() {
  const { basketData, substitutionData, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Mix & SKU Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate top SKUs from basket data
  const skuFrequency = basketData?.reduce((acc: any, basket: any) => {
    acc[basket.brand] = (acc[basket.brand] || 0) + basket.item_count;
    return acc;
  }, {});

  const topSKUs = Object.entries(skuFrequency || {})
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 5);

  // Calculate basket composition
  const avgBasketSize = basketData?.reduce((sum: number, b: any) => sum + b.item_count, 0) / (basketData?.length || 1);
  const avgBasketValue = basketData?.reduce((sum: number, b: any) => sum + b.total_value, 0) / (basketData?.length || 1);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Product Mix & SKU Info
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Top SKUs */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            Top SKUs
          </h4>
          <div className="space-y-2">
            {topSKUs.map(([brand, count]: any, index) => (
              <div key={brand} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {index + 1}. {brand}
                </span>
                <span className="text-sm font-medium">{count} units</span>
              </div>
            ))}
          </div>
        </div>

        {/* Basket Composition */}
        <div className="pt-3 border-t">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
            <ShoppingCart className="h-4 w-4" />
            Basket Composition
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/50 p-2 rounded">
              <p className="text-xs text-muted-foreground">Avg Items</p>
              <p className="text-lg font-semibold">{avgBasketSize.toFixed(1)}</p>
            </div>
            <div className="bg-muted/50 p-2 rounded">
              <p className="text-xs text-muted-foreground">Avg Value</p>
              <p className="text-lg font-semibold">₱{avgBasketValue.toFixed(0)}</p>
            </div>
          </div>
        </div>

        {/* Substitution Patterns */}
        <div className="pt-3 border-t">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
            <Repeat className="h-4 w-4" />
            Substitution Patterns
          </h4>
          <div className="space-y-1">
            {substitutionData?.slice(0, 3).map((sub: any, index: number) => (
              <div key={index} className="text-xs text-muted-foreground">
                {sub.original} → {sub.substitute} ({sub.frequency}x)
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}