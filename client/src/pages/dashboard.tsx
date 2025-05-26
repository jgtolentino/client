import { useState, useEffect, lazy, Suspense } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import TopBar from "@/components/dashboard/top-bar";
import KPICards from "@/components/dashboard/kpi-cards";
import Footer from "@/components/dashboard/footer";
import { useDashboardData } from "@/hooks/use-dashboard-data";

// Lazy load heavy components to reduce initial bundle size
const TransactionTrends = lazy(() => import("@/components/dashboard/transaction-trends"));
const ProductMix = lazy(() => import("@/components/dashboard/product-mix"));
const SKUInfo = lazy(() => import("@/components/dashboard/sku-info"));
const ConsumerBehavior = lazy(() => import("@/components/dashboard/consumer-behavior"));
const ConsumerProfiling = lazy(() => import("@/components/dashboard/consumer-profiling"));
const GeospatialMap = lazy(() => import("@/components/dashboard/geospatial-map"));
const TransactionMetrics = lazy(() => import("@/components/dashboard/transaction-metrics"));
const AIInsights = lazy(() => import("@/components/dashboard/ai-insights"));

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: "Last 30 Days",
    location: "All Locations",
    brand: "All Brands",
    category: "All Categories"
  });


  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar - Responsive Width */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 flex-shrink-0`}>
          <Sidebar collapsed={sidebarCollapsed} />
        </div>
          
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="h-16 flex-shrink-0">
            <TopBar 
              onToggleSidebar={toggleSidebar}
              filters={filters}
              onUpdateFilter={updateFilter}
            />
          </div>
          
          {/* Main Dashboard Content */}
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* KPI Cards - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICards />
              </div>
              
              {/* Core Modules Grid - Responsive with Aspect Ratios */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {/* Row 1 */}
                <div className="aspect-chart bg-white rounded-lg shadow-sm overflow-hidden">
                  <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                    <TransactionTrends />
                  </Suspense>
                </div>
                
                <div className="aspect-chart bg-white rounded-lg shadow-sm overflow-hidden">
                  <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                    <ProductMix />
                  </Suspense>
                </div>
                
                <div className="aspect-chart bg-white rounded-lg shadow-sm overflow-hidden">
                  <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                    <SKUInfo />
                  </Suspense>
                </div>
                
                {/* Row 2 */}
                <div className="aspect-chart bg-white rounded-lg shadow-sm overflow-hidden">
                  <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                    <ConsumerBehavior />
                  </Suspense>
                </div>
                
                <div className="aspect-chart bg-white rounded-lg shadow-sm overflow-hidden">
                  <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                    <ConsumerProfiling />
                  </Suspense>
                </div>
                
                <div className="aspect-chart bg-white rounded-lg shadow-sm overflow-hidden">
                  <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                    <TransactionMetrics />
                  </Suspense>
                </div>
                
                {/* Row 3 - Full Width Map */}
                <div className="lg:col-span-3 aspect-map bg-white rounded-lg shadow-sm overflow-hidden">
                  <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                    <GeospatialMap />
                  </Suspense>
                </div>
              </div>
              
              {/* AI Insights Section */}
              <div className="aspect-dashboard bg-white rounded-lg shadow-sm overflow-hidden">
                <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                  <AIInsights filters={filters} />
                </Suspense>
              </div>
              
              {/* Footer */}
              <Footer />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}