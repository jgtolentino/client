import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, MapPin, Users, Calendar } from "lucide-react";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export default function ConsumerProfiling() {
  const { consumerProfilingData, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            Consumer Profiling
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

  // Process gender distribution
  const genderCount = consumerProfilingData?.reduce((acc: any, profile: any) => {
    acc[profile.gender] = (acc[profile.gender] || 0) + 1;
    return acc;
  }, {});

  const genderData = Object.entries(genderCount || {}).map(([gender, count]: any) => ({
    name: gender,
    value: count,
    percentage: ((count / (consumerProfilingData?.length || 1)) * 100).toFixed(1)
  }));

  // Process age distribution
  const ageGroups = {
    "18-24": 0,
    "25-34": 0,
    "35-44": 0,
    "45-54": 0,
    "55+": 0
  };

  consumerProfilingData?.forEach((profile: any) => {
    if (profile.age < 25) ageGroups["18-24"]++;
    else if (profile.age < 35) ageGroups["25-34"]++;
    else if (profile.age < 45) ageGroups["35-44"]++;
    else if (profile.age < 55) ageGroups["45-54"]++;
    else ageGroups["55+"]++;
  });

  const ageData = Object.entries(ageGroups).map(([group, count]) => ({
    name: group,
    value: count,
    percentage: ((count / (consumerProfilingData?.length || 1)) * 100).toFixed(1)
  }));

  // Process location distribution
  const locationCount = consumerProfilingData?.reduce((acc: any, profile: any) => {
    acc[profile.location] = (acc[profile.location] || 0) + 1;
    return acc;
  }, {});

  const topLocations = Object.entries(locationCount || {})
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 5);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCircle className="h-5 w-5" />
          Consumer Profiling
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Gender Distribution */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
            <Users className="h-4 w-4" />
            Gender Distribution
          </h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {genderData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs">{item.name}: {item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Age Distribution */}
        <div className="pt-3 border-t">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Age Groups
          </h4>
          <div className="space-y-1">
            {ageData.map((age) => (
              <div key={age.name} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{age.name}</span>
                <span className="font-medium">{age.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Locations */}
        <div className="pt-3 border-t">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            Top Locations
          </h4>
          <div className="space-y-1">
            {topLocations.map(([location, count]: any, index) => (
              <div key={location} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {index + 1}. {location}
                </span>
                <span className="font-medium">{count} consumers</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}