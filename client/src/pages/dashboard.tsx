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

  // Maintain aspect ratio with responsive scaling
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    const handleResize = () => {
      // Target resolution: 1920x1080 (16:9 aspect ratio)
      const targetWidth = 1920;
      const targetHeight = 1080;
      
      // Calculate scale to fit viewport while maintaining aspect ratio
      const scaleX = window.innerWidth / targetWidth;
      const scaleY = window.innerHeight / targetHeight;
      
      // Use the smaller scale to ensure the entire dashboard fits
      const newScale = Math.min(scaleX, scaleY, 1); // Cap at 1 to prevent upscaling
      
      setScale(newScale);
    };
    
    // Initial calculation
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* Fixed Aspect Ratio Container */}
      <div
        className="mx-auto bg-background shadow-xl relative"
        style={{
          width: '1920px',
          height: '1080px',
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          // Adjust margin to center when scaled down
          marginTop: scale < 1 ? `${(1 - scale) * -540}px` : 0
        }}
      >
        <div className="flex h-full">
          {/* Sidebar - Fixed Width */}
          <div style={{ width: sidebarCollapsed ? '64px' : '250px' }} className="transition-all duration-300">
            <Sidebar collapsed={sidebarCollapsed} />
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Bar - Fixed Height */}
            <div style={{ height: '64px' }}>
              <TopBar 
                onToggleSidebar={toggleSidebar}
                filters={filters}
                onUpdateFilter={updateFilter}
              />
            </div>
            
            {/* Main Dashboard Content */}
            <main className="flex-1 overflow-auto" style={{ padding: '24px' }}>
              {/* KPI Cards - Increased Height */}
              <div style={{ height: '160px', marginBottom: '24px' }}>
                <KPICards />
              </div>
              
              {/* Core Modules Grid - Fixed Heights */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '20px',
                height: 'calc(100% - 184px - 160px)' // Subtract KPI and AI sections
              }}>
                {/* Row 1 */}
                <div style={{ height: '300px' }}>
                  <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                    <TransactionTrends />
                  </Suspense>
                </div>
                
                <div style={{ height: '300px' }}>
                  <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                    <ProductMix />
                  </Suspense>
                </div>
                
                <div style={{ height: '300px' }}>
                  <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                    <SKUInfo />
                  </Suspense>
                </div>
                
                {/* Row 2 */}
                <div style={{ height: '300px' }}>
                  <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                    <ConsumerBehavior />
                  </Suspense>
                </div>
                
                <div style={{ height: '300px' }}>
                  <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                    <ConsumerProfiling />
                  </Suspense>
                </div>
                
                <div style={{ height: '300px' }}>
                  <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                    <TransactionMetrics />
                  </Suspense>
                </div>
                
                {/* Row 3 */}
                <div style={{ height: '300px', gridColumn: 'span 3' }}>
                  <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                    <GeospatialMap />
                  </Suspense>
                </div>
              </div>
              
              {/* AI Insights - Fixed Height at Bottom */}
              <div style={{ height: '140px', marginTop: '20px' }}>
                <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                  <AIInsights filters={filters} />
                </Suspense>
              </div>
            </main>
            
            {/* Footer - Fixed Height */}
            <div style={{ height: '40px' }}>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}