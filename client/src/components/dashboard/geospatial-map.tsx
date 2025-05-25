import { useState } from "react";
import { MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { Skeleton } from "@/components/ui/skeleton";
import TransactionMap from "./transaction-map";

export default function GeospatialMap() {
  const [mapView, setMapView] = useState("Density");
  const { locationData, isLoading } = useDashboardData();

  const toggleMapView = () => {
    setMapView(prev => prev === "Density" ? "Markers" : "Density");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Interactive OpenStreetMap */}
      <TransactionMap />
      
      {/* Location Data Table */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Location Performance</CardTitle>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-medium text-gray-700 border-b pb-2">
              <span>Location</span>
              <span>Transaction Volume</span>
            </div>
            {locationData?.slice(0, 7).map((location) => (
              <div key={location.location} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="font-medium text-gray-900">{location.location}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900">{location.transactions}</span>
                  <div className="text-xs text-gray-500">transactions</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regional Performance */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Regional Performance</CardTitle>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {locationData?.map((location) => (
              <div
                key={location.location}
                className="flex items-center justify-between p-3 bg-muted/50 rounded cursor-pointer hover:bg-muted transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground">{location.location}</p>
                  <p className="text-sm text-muted-foreground">
                    ₱{(location.revenue / 1000000).toFixed(1)}M revenue
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{location.transactions}</p>
                  <div className="flex items-center gap-1">
                    {location.change >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-600" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-600" />
                    )}
                    <p className={`text-xs ${location.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {location.change >= 0 ? "+" : ""}{location.change.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
