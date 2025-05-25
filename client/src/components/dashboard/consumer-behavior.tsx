import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MousePointer, MessageSquare, Store, TrendingUp, UserCheck, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { formatPercentage } from "@/lib/format-utils";

export default function ConsumerBehavior() {
  const { behaviorData, isLoading } = useDashboardData();

  // Use real data if available, otherwise use defaults
  const data = behaviorData || {
    requestMethods: [
      { method: "Pointing", percentage: 65, count: 3250 },
      { method: "Verbal", percentage: 35, count: 1750 }
    ],
    storeAcceptance: {
      accepted: 78,
      rejected: 22,
      influenced: 456,
      total: 584
    },
    substitutionPatterns: {
      rate: 15.8,
      topSubstitutions: [
        { from: "Brand A", to: "Brand B", count: 45 },
        { from: "Brand C", to: "Brand D", count: 38 }
      ]
    },
    preferences: [
      { signal: "Brand Loyalty", strength: 85, trend: "+2%" },
      { signal: "Price Sensitivity", strength: 72, trend: "-1%" },
      { signal: "Quality Focus", strength: 68, trend: "+3%" },
      { signal: "Convenience", strength: 45, trend: "0%" }
    ]
  };

  return (
    <Card className="h-full">
      <CardHeader style={{ padding: '16px 20px', paddingBottom: '12px' }}>
        <CardTitle className="flex items-center justify-between" style={{ fontSize: '16px' }}>
          <span className="flex items-center" style={{ gap: '8px' }}>
            <Users style={{ width: '20px', height: '20px' }} />
            Consumer Behavior & Preferences
          </span>
          <Badge variant="outline" className="font-normal" style={{ fontSize: '11px' }}>
            <Sparkles className="mr-1" style={{ width: '12px', height: '12px' }} />
            AI Enhanced
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent style={{ padding: '16px 20px', paddingTop: '8px', height: 'calc(100% - 52px)', overflowY: 'auto' }}>
        {/* Store Influence Metrics - NEW */}
        <div style={{ marginBottom: '16px' }}>
          <h4 className="font-medium flex items-center" style={{ fontSize: '13px', marginBottom: '8px', gap: '4px' }}>
            <Store style={{ width: '14px', height: '14px' }} />
            Store Attendant Influence
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-lg" style={{ padding: '12px' }}>
              <div className="flex items-center justify-between">
                <span className="text-green-700" style={{ fontSize: '11px' }}>Influenced Sales</span>
                <UserCheck className="text-green-600" style={{ width: '16px', height: '16px' }} />
              </div>
              <p className="font-bold text-green-700" style={{ fontSize: '20px', marginTop: '4px' }}>
                {data.storeAcceptance.influenced}
              </p>
              <p className="text-green-600" style={{ fontSize: '10px' }}>
                {formatPercentage((data.storeAcceptance.influenced / data.storeAcceptance.total) * 100)}% of total
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg" style={{ padding: '12px' }}>
              <div className="flex items-center justify-between">
                <span className="text-blue-700" style={{ fontSize: '11px' }}>Acceptance Rate</span>
                <TrendingUp className="text-blue-600" style={{ width: '16px', height: '16px' }} />
              </div>
              <p className="font-bold text-blue-700" style={{ fontSize: '20px', marginTop: '4px' }}>
                {data.storeAcceptance.accepted}%
              </p>
              <p className="text-blue-600" style={{ fontSize: '10px' }}>Above average</p>
            </div>
          </div>
        </div>

        {/* Request Methods */}
        <div style={{ marginBottom: '16px' }}>
          <h4 className="font-medium" style={{ fontSize: '13px', marginBottom: '8px' }}>Request Methods</h4>
          <div style={{ display: 'flex', gap: '12px' }}>
            {data.requestMethods.map((method) => (
              <div key={method.method} className="flex-1">
                <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
                  <span className="flex items-center" style={{ fontSize: '11px', gap: '4px' }}>
                    {method.method === "Pointing" ? (
                      <MousePointer style={{ width: '12px', height: '12px' }} />
                    ) : (
                      <MessageSquare style={{ width: '12px', height: '12px' }} />
                    )}
                    {method.method}
                  </span>
                  <span className="font-medium" style={{ fontSize: '12px' }}>{method.percentage}%</span>
                </div>
                <Progress value={method.percentage} style={{ height: '6px' }} />
                <p className="text-muted-foreground" style={{ fontSize: '10px', marginTop: '2px' }}>
                  {method.count.toLocaleString()} requests
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Substitution Patterns - NEW */}
        <div className="border-t" style={{ paddingTop: '12px', marginBottom: '16px' }}>
          <h4 className="font-medium" style={{ fontSize: '13px', marginBottom: '8px' }}>
            Substitution Patterns
          </h4>
          <div className="bg-orange-50 rounded-lg" style={{ padding: '12px', marginBottom: '8px' }}>
            <div className="flex items-center justify-between">
              <span className="text-orange-700" style={{ fontSize: '11px' }}>Substitution Rate</span>
              <Badge className="bg-orange-600 text-white" style={{ fontSize: '10px' }}>
                {data.substitutionPatterns.rate}%
              </Badge>
            </div>
          </div>
          <div style={{ fontSize: '11px', color: '#666' }}>
            <p className="font-medium" style={{ marginBottom: '4px' }}>Top Substitutions:</p>
            {data.substitutionPatterns.topSubstitutions.map((sub, idx) => (
              <div key={idx} className="flex items-center justify-between" style={{ marginBottom: '2px' }}>
                <span>{sub.from} → {sub.to}</span>
                <span className="text-muted-foreground">{sub.count} times</span>
              </div>
            ))}
          </div>
        </div>

        {/* Preference Signals */}
        <div className="border-t" style={{ paddingTop: '12px' }}>
          <h4 className="font-medium" style={{ fontSize: '13px', marginBottom: '8px' }}>Preference Signals</h4>
          <div className="space-y-2">
            {data.preferences.map((pref) => (
              <div key={pref.signal} className="flex items-center justify-between">
                <span className="text-muted-foreground" style={{ fontSize: '11px' }}>{pref.signal}</span>
                <div className="flex items-center" style={{ gap: '8px' }}>
                  <Progress value={pref.strength} style={{ width: '60px', height: '4px' }} />
                  <span className="font-medium" style={{ fontSize: '11px', width: '32px', textAlign: 'right' }}>
                    {pref.strength}%
                  </span>
                  <span 
                    className={`text-xs ${
                      pref.trend.startsWith('+') ? 'text-green-600' : 
                      pref.trend.startsWith('-') ? 'text-red-600' : 
                      'text-gray-500'
                    }`}
                    style={{ fontSize: '10px', width: '28px' }}
                  >
                    {pref.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}