import { BarChart3, LayoutDashboard, TrendingUp, Package, Brain, MapPin } from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
}

export default function Sidebar({ collapsed }: SidebarProps) {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: TrendingUp, label: "Transaction Trends", active: false },
    { icon: Package, label: "Product Mix", active: false },
    { icon: Brain, label: "AI Insights", active: false },
    { icon: MapPin, label: "Geospatial", active: false },
  ];

  return (
    <div className={`${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out h-full`}>
      {/* Sidebar Header */}
      <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
        <div className="flex items-center" style={{ gap: '12px' }}>
          <div className="bg-primary rounded-lg flex items-center justify-center transition-transform hover:scale-110" style={{ width: '36px', height: '36px' }}>
            <BarChart3 className="text-primary-foreground" style={{ width: '20px', height: '20px' }} />
          </div>
          {!collapsed && (
            <span className="font-semibold text-foreground" style={{ fontSize: '18px' }}>Client360</span>
          )}
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1" style={{ padding: '16px' }}>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item, index) => (
            <li key={index}>
              <a 
                href="#" 
                className={`flex items-center rounded-lg transition-all duration-200 ${
                  item.active 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                style={{ 
                  padding: collapsed ? '12px' : '12px 16px',
                  gap: '12px',
                  textDecoration: 'none'
                }}
              >
                <item.icon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                {!collapsed && (
                  <span style={{ fontSize: '14px', fontWeight: item.active ? 500 : 400 }}>
                    {item.label}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Sidebar Footer - Optional */}
      {!collapsed && (
        <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb' }}>
          <p className="text-muted-foreground" style={{ fontSize: '11px', textAlign: 'center' }}>
            © 2024 Client360 v2.0
          </p>
        </div>
      )}
    </div>
  );
}
