import { Menu, Calendar, MapPin, Tag, Grid3X3, Download, HelpCircle, User, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface TopBarProps {
  onToggleSidebar: () => void;
  filters: {
    dateRange: string;
    location: string;
    brand: string;
    category: string;
  };
  onUpdateFilter: (key: string, value: string) => void;
}

export default function TopBar({ onToggleSidebar, filters, onUpdateFilter }: TopBarProps) {
  const [exporting, setExporting] = useState(false);

  const dateRangeOptions = ["Today", "Last 7 Days", "Last 30 Days", "Last 90 Days", "Custom Range"];
  const locationOptions = ["All Locations", "Taguig", "Quezon City", "Makati", "Marikina", "Pasig"];
  const brandOptions = ["All Brands", "Pride", "Alaska", "Crispy Patata", "Oaties", "Rinbee", "Top 10 Brands"];
  const categoryOptions = ["All Categories", "Beverages", "Snacks", "Personal Care", "Cigarettes", "Dairy"];

  const handleExport = async () => {
    setExporting(true);
    // Simulate export delay
    setTimeout(() => {
      setExporting(false);
      // In real app, trigger download here
      alert("Dashboard exported successfully!");
    }, 2000);
  };

  return (
    <header className="bg-white border-b border-gray-200" style={{ height: '64px', padding: '0 24px' }}>
      <div className="flex items-center justify-between h-full">
        {/* Left: Toggle and Filters */}
        <div className="flex items-center" style={{ gap: '16px' }}>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onToggleSidebar}
            className="hover:bg-muted rounded transition-colors"
            style={{ padding: '8px' }}
          >
            <Menu style={{ width: '20px', height: '20px' }} />
          </Button>
          
          {/* Filter Pills */}
          <div className="flex items-center" style={{ gap: '12px' }}>
            {/* Date Range Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="filter-pill hover:bg-gray-100 transition-colors cursor-pointer">
                  <Calendar style={{ width: '16px', height: '16px' }} />
                  <span>{filters.dateRange}</span>
                  <ChevronDown style={{ width: '16px', height: '16px' }} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {dateRangeOptions.map(option => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => onUpdateFilter('dateRange', option)}
                    className="flex items-center justify-between"
                  >
                    <span>{option}</span>
                    {filters.dateRange === option && <Check className="w-4 h-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Location Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="filter-pill hover:bg-gray-100 transition-colors cursor-pointer">
                  <MapPin style={{ width: '16px', height: '16px' }} />
                  <span>{filters.location}</span>
                  <ChevronDown style={{ width: '16px', height: '16px' }} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {locationOptions.map(option => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => onUpdateFilter('location', option)}
                    className="flex items-center justify-between"
                  >
                    <span>{option}</span>
                    {filters.location === option && <Check className="w-4 h-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Brand Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="filter-pill hover:bg-gray-100 transition-colors cursor-pointer">
                  <Tag style={{ width: '16px', height: '16px' }} />
                  <span>{filters.brand}</span>
                  <ChevronDown style={{ width: '16px', height: '16px' }} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {brandOptions.map(option => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => onUpdateFilter('brand', option)}
                    className="flex items-center justify-between"
                  >
                    <span>{option}</span>
                    {filters.brand === option && <Check className="w-4 h-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Category Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="filter-pill hover:bg-gray-100 transition-colors cursor-pointer">
                  <Grid3X3 style={{ width: '16px', height: '16px' }} />
                  <span>{filters.category}</span>
                  <ChevronDown style={{ width: '16px', height: '16px' }} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {categoryOptions.map(option => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => onUpdateFilter('category', option)}
                    className="flex items-center justify-between"
                  >
                    <span>{option}</span>
                    {filters.category === option && <Check className="w-4 h-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center" style={{ gap: '12px' }}>
          <Button 
            className="flex items-center bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            style={{ gap: '8px', padding: '8px 16px' }}
            onClick={handleExport}
            disabled={exporting}
          >
            <Download style={{ width: '16px', height: '16px' }} />
            <span>{exporting ? 'Exporting...' : 'Export'}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="hover:bg-muted rounded transition-colors"
            style={{ padding: '8px' }}
            title="Help"
          >
            <HelpCircle style={{ width: '20px', height: '20px' }} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="hover:bg-muted rounded transition-colors"
            style={{ padding: '8px' }}
            title="User Profile"
          >
            <User style={{ width: '20px', height: '20px' }} />
          </Button>
        </div>
      </div>
    </header>
  );
}