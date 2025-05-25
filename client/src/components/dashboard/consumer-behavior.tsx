import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MousePointer, MessageSquare, Store } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function ConsumerBehavior() {
  // Simulated behavior data - in a real app, this would come from the API
  const behaviorData = {
    requestMethods: [
      { method: "Pointing", percentage: 65, count: 3250 },
      { method: "Verbal", percentage: 35, count: 1750 }
    ],
    storeAcceptance: {
      accepted: 78,
      rejected: 22
    },
    preferences: [
      { signal: "Brand Loyalty", strength: 85 },
      { signal: "Price Sensitivity", strength: 72 },
      { signal: "Quality Focus", strength: 68 },
      { signal: "Convenience", strength: 45 }
    ]
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Consumer Behavior & Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Request Methods */}
        <div>
          <h4 className="text-sm font-medium mb-2">Request Methods</h4>
          <div className="space-y-2">
            {behaviorData.requestMethods.map((method) => (
              <div key={method.method} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    {method.method === "Pointing" ? (
                      <MousePointer className="h-3 w-3" />
                    ) : (
                      <MessageSquare className="h-3 w-3" />
                    )}
                    {method.method}
                  </span>
                  <span className="text-muted-foreground">{method.percentage}%</span>
                </div>
                <Progress value={method.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Store Suggestion Acceptance */}
        <div className="pt-3 border-t">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
            <Store className="h-4 w-4" />
            Store Suggestion Acceptance
          </h4>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-600">Accepted</span>
                <span>{behaviorData.storeAcceptance.accepted}%</span>
              </div>
              <Progress value={behaviorData.storeAcceptance.accepted} className="h-2 bg-green-100" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-red-600">Rejected</span>
                <span>{behaviorData.storeAcceptance.rejected}%</span>
              </div>
              <Progress value={behaviorData.storeAcceptance.rejected} className="h-2 bg-red-100" />
            </div>
          </div>
        </div>

        {/* Preference Signals */}
        <div className="pt-3 border-t">
          <h4 className="text-sm font-medium mb-2">Preference Signals</h4>
          <div className="space-y-2">
            {behaviorData.preferences.map((pref) => (
              <div key={pref.signal} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{pref.signal}</span>
                <div className="flex items-center gap-2">
                  <Progress value={pref.strength} className="w-20 h-1.5" />
                  <span className="text-xs font-medium w-10 text-right">{pref.strength}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}