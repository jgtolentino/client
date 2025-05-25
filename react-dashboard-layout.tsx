import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RetailDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Maintain aspect ratio
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    const handleResize = () => {
      const scale = Math.min(
        window.innerWidth / 1920,
        window.innerHeight / 1080,
        1
      );
      setScale(scale);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* Fixed Aspect Ratio Container */}
      <div
        className="mx-auto bg-white shadow-xl"
        style={{
          width: '1920px',
          height: '1080px',
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          marginTop: scale < 1 ? `${(1 - scale) * -540}px` : 0
        }}
      >
        {/* Header - Fixed Height */}
        <header className="h-16 bg-blue-900 text-white flex items-center px-8 shadow-lg">
          <h1 className="text-2xl font-bold">Retail Analytics Dashboard</h1>
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-sm opacity-90">Last Updated: 5 mins ago</span>
            <button className="px-4 py-1 bg-blue-700 rounded hover:bg-blue-600 transition-colors">
              Refresh
            </button>
          </div>
        </header>

        {/* KPI Strip - Prominent and Consistent */}
        <div className="h-24 bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-4">
          <div className="grid grid-cols-5 gap-6 h-full">
            {[
              { label: 'Total Revenue', value: '₱2.4M', change: '+12.5%', icon: '₱' },
              { label: 'Transactions', value: '1,847', change: '+8.2%', icon: '🛒' },
              { label: 'Avg Basket', value: '₱487', change: '+5.1%', icon: '📊' },
              { label: 'Units Sold', value: '8,234', change: '+15.3%', icon: '📦' },
              { label: 'Peak Hour', value: '6-7PM', change: '45% ↑', icon: '⏰' }
            ].map((kpi, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="h-full flex items-center px-4">
                  <div className="text-3xl mr-4 opacity-70">{kpi.icon}</div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{kpi.label}</p>
                    <p className="text-2xl font-bold text-gray-800">{kpi.value}</p>
                    <p className={`text-sm font-medium ${
                      kpi.change.startsWith('+') ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {kpi.change}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area - 3 Column Grid */}
        <div className="px-8 py-6" style={{ height: 'calc(100% - 520px)' }}>
          <div className="grid grid-cols-12 gap-6 h-full">
            
            {/* Left Column - Time Analysis (4 cols) */}
            <div className="col-span-4 space-y-6">
              <Card className="h-64">
                <CardHeader>
                  <CardTitle className="text-lg">Transaction Volume by Hour</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                    {/* Hourly Bar Chart */}
                    <div className="flex items-end justify-between h-full">
                      {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((hour) => {
                        const height = Math.random() * 80 + 20;
                        const isPeak = [7, 8, 17, 18, 19].includes(hour);
                        return (
                          <div key={hour} className="flex-1 flex flex-col items-center">
                            <div
                              className={`w-full mx-0.5 rounded-t transition-all duration-300 ${
                                isPeak ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'
                              }`}
                              style={{ height: `${height}%` }}
                            />
                            <span className="text-xs mt-1">{hour}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-64">
                <CardHeader>
                  <CardTitle className="text-lg">Revenue Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { day: 'Monday', value: 342500, pct: 85 },
                      { day: 'Tuesday', value: 387200, pct: 95 },
                      { day: 'Wednesday', value: 298100, pct: 73 },
                      { day: 'Thursday', value: 356800, pct: 88 },
                      { day: 'Friday', value: 412300, pct: 100 },
                      { day: 'Saturday', value: 389700, pct: 94 },
                      { day: 'Sunday', value: 367900, pct: 89 }
                    ].map((day) => (
                      <div key={day.day} className="flex items-center">
                        <span className="text-sm w-20">{day.day}</span>
                        <div className="flex-1 mx-2 bg-gray-200 rounded-full h-5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                            style={{ width: `${day.pct}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-20 text-right">₱{(day.value/1000).toFixed(0)}K</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Middle Column - Product Analytics (5 cols) */}
            <div className="col-span-5 space-y-6">
              <Card className="h-80">
                <CardHeader>
                  <CardTitle className="text-lg">Category Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 h-64">
                    {/* Donut Chart Area */}
                    <div className="flex items-center justify-center">
                      <div className="relative w-48 h-48">
                        <svg className="w-full h-full transform -rotate-90">
                          {[
                            { name: 'Cigarettes', value: 35, color: '#EF4444', offset: 0 },
                            { name: 'Beverages', value: 25, color: '#3B82F6', offset: 35 },
                            { name: 'Snacks', value: 20, color: '#10B981', offset: 60 },
                            { name: 'Personal Care', value: 15, color: '#F59E0B', offset: 80 },
                            { name: 'Others', value: 5, color: '#6B7280', offset: 95 }
                          ].map((cat) => {
                            const radius = 80;
                            const strokeWidth = 40;
                            const circumference = 2 * Math.PI * radius;
                            const strokeDasharray = `${(cat.value / 100) * circumference} ${circumference}`;
                            const strokeDashoffset = -(cat.offset / 100) * circumference;
                            
                            return (
                              <circle
                                key={cat.name}
                                cx="96"
                                cy="96"
                                r={radius}
                                fill="none"
                                stroke={cat.color}
                                strokeWidth={strokeWidth}
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-500 hover:opacity-80"
                              />
                            );
                          })}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-3xl font-bold">₱2.4M</p>
                            <p className="text-sm text-gray-500">Total</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Legend and Details */}
                    <div className="space-y-2">
                      {[
                        { name: 'Cigarettes', value: '₱840K', pct: '35%', color: 'bg-red-500' },
                        { name: 'Beverages', value: '₱600K', pct: '25%', color: 'bg-blue-500' },
                        { name: 'Snacks', value: '₱480K', pct: '20%', color: 'bg-green-500' },
                        { name: 'Personal Care', value: '₱360K', pct: '15%', color: 'bg-yellow-500' },
                        { name: 'Others', value: '₱120K', pct: '5%', color: 'bg-gray-500' }
                      ].map((cat) => (
                        <div key={cat.name} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 ${cat.color} rounded-full mr-2`} />
                            <span className="text-sm">{cat.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium">{cat.value}</span>
                            <span className="text-xs text-gray-500 ml-2">({cat.pct})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-48">
                <CardHeader>
                  <CardTitle className="text-lg">Top Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Product</th>
                          <th className="text-right py-2">Units</th>
                          <th className="text-right py-2">Revenue</th>
                          <th className="text-right py-2">Growth</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'Marlboro Red', units: 487, revenue: '₱70.6K', growth: '+15%' },
                          { name: 'San Miguel Pale', units: 342, revenue: '₱45.2K', growth: '+8%' },
                          { name: 'Jack n Jill Piattos', units: 298, revenue: '₱38.7K', growth: '+22%' }
                        ].map((product, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50">
                            <td className="py-2">{product.name}</td>
                            <td className="text-right py-2">{product.units}</td>
                            <td className="text-right py-2 font-medium">{product.revenue}</td>
                            <td className="text-right py-2 text-green-600">{product.growth}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Filters (3 cols) */}
            <div className="col-span-3">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Filters & Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Time Range */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Time Range</label>
                    <select 
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={selectedTimeRange}
                      onChange={(e) => setSelectedTimeRange(e.target.value)}
                    >
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <select 
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                    >
                      <option value="all">All Locations</option>
                      <option value="poblacion">Poblacion</option>
                      <option value="san-antonio">San Antonio</option>
                      <option value="commonwealth">Commonwealth</option>
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <div className="space-y-2">
                      {['All', 'Cigarettes', 'Beverages', 'Snacks', 'Personal Care'].map(cat => (
                        <label key={cat} className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="mr-2 rounded focus:ring-2 focus:ring-blue-500"
                            defaultChecked={cat === 'All'}
                          />
                          <span className="text-sm">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Day Type Toggle */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Day Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">
                        Weekday
                      </button>
                      <button className="px-3 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300">
                        Weekend
                      </button>
                    </div>
                  </div>

                  {/* Apply Filters Button */}
                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Apply Filters
                  </button>

                  {/* Reset Button */}
                  <button className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Reset All
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Bottom Section - AI Insights */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-4">
          <h3 className="text-lg font-bold mb-3 flex items-center">
            <span className="mr-2">🤖</span> AI-Powered Insights & Recommendations
          </h3>
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-gray-700 bg-opacity-50 rounded-lg p-3 hover:bg-opacity-70 transition-colors">
              <p className="text-yellow-400 text-xs mb-1 flex items-center">
                <span className="mr-1">📈</span> Opportunity
              </p>
              <p className="text-sm">Peak hours (6-8 PM) show 45% higher basket value</p>
            </div>
            <div className="bg-gray-700 bg-opacity-50 rounded-lg p-3 hover:bg-opacity-70 transition-colors">
              <p className="text-green-400 text-xs mb-1 flex items-center">
                <span className="mr-1">💡</span> Recommendation
              </p>
              <p className="text-sm">Stock more cigarettes & beverages for evening rush</p>
            </div>
            <div className="bg-gray-700 bg-opacity-50 rounded-lg p-3 hover:bg-opacity-70 transition-colors">
              <p className="text-orange-400 text-xs mb-1 flex items-center">
                <span className="mr-1">⚠️</span> Alert
              </p>
              <p className="text-sm">Poblacion store shows 23% lower sales than average</p>
            </div>
            <div className="bg-gray-700 bg-opacity-50 rounded-lg p-3 hover:bg-opacity-70 transition-colors">
              <p className="text-blue-400 text-xs mb-1 flex items-center">
                <span className="mr-1">🎯</span> Action
              </p>
              <p className="text-sm">Enable GCash to capture 18% more transactions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailDashboard;