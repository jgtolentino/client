import type { Transaction, Consumer, LocationData, CategoryData, BrandData } from "@shared/schema";

export function aggregateTransactionsByLocation(transactions: Transaction[]): LocationData[] {
  const locationMap = new Map<string, { count: number; revenue: number }>();

  transactions.forEach(transaction => {
    const location = transaction.location;
    const revenue = parseFloat(transaction.pesoValue);
    
    if (locationMap.has(location)) {
      const existing = locationMap.get(location)!;
      locationMap.set(location, {
        count: existing.count + 1,
        revenue: existing.revenue + revenue
      });
    } else {
      locationMap.set(location, { count: 1, revenue });
    }
  });

  // Coordinates for major Philippine cities
  const coordinates: Record<string, [number, number]> = {
    "Manila": [14.5995, 120.9842],
    "Cebu": [10.3157, 123.8854],
    "Davao": [7.1907, 125.4553],
    "Iloilo": [10.7202, 122.5621],
    "Cagayan de Oro": [8.4542, 124.6319]
  };

  return Array.from(locationMap.entries()).map(([location, data]) => ({
    location,
    transactions: data.count,
    revenue: data.revenue,
    coordinates: coordinates[location] || [14.5995, 120.9842],
    change: Math.random() * 10 - 2 // Mock change percentage
  }));
}

export function aggregateTransactionsByCategory(transactions: Transaction[]): CategoryData[] {
  const categoryMap = new Map<string, number>();

  transactions.forEach(transaction => {
    const category = transaction.category;
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
  });

  const total = transactions.length;
  const colors = ["hsl(var(--primary))", "hsl(42 100% 50%)", "hsl(142 76% 36%)", "hsl(0 84% 60%)"];

  return Array.from(categoryMap.entries()).map(([category, count], index) => ({
    category,
    value: count,
    percentage: (count / total) * 100,
    color: colors[index % colors.length]
  }));
}

export function aggregateTransactionsByBrand(transactions: Transaction[]): BrandData[] {
  const brandMap = new Map<string, { sales: number; category: string }>();

  transactions.forEach(transaction => {
    const brand = transaction.brand;
    const sales = parseFloat(transaction.pesoValue);
    
    if (brandMap.has(brand)) {
      const existing = brandMap.get(brand)!;
      brandMap.set(brand, {
        sales: existing.sales + sales,
        category: existing.category
      });
    } else {
      brandMap.set(brand, { sales, category: transaction.category });
    }
  });

  // TBWA client brands
  const tbwaClients = [
    "Del Monte", "Alaska", "Oishi", "Champion", "Pride", "Cyclone", 
    "Alpine", "Cow Bell", "Winston", "Camel", "Mevius", "Gourmet Picks", "Crispy Patata"
  ];

  return Array.from(brandMap.entries())
    .map(([brand, data]) => ({
      brand,
      sales: data.sales,
      category: data.category,
      isTBWAClient: tbwaClients.some(client => brand.includes(client))
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 10); // Top 10 brands
}

export function calculateKPIMetrics(transactions: Transaction[], consumers: Consumer[]) {
  const totalTransactions = transactions.length;
  const totalValue = transactions.reduce((sum, t) => sum + parseFloat(t.pesoValue), 0);
  const avgValue = totalValue / totalTransactions;

  // Calculate substitution rate (mock calculation)
  const substitutionRate = 12.4;
  const dataFreshness = 98.2;

  // Generate hourly trends
  const trendsData = [
    { label: "6AM", value: 120, change: 5 },
    { label: "9AM", value: 190, change: 8 },
    { label: "12PM", value: 300, change: 12 },
    { label: "3PM", value: 250, change: -2 },
    { label: "6PM", value: 200, change: -5 },
    { label: "9PM", value: 150, change: -8 }
  ];

  return {
    transactions: totalTransactions,
    avgValue,
    substitutionRate,
    dataFreshness,
    trendsData
  };
}

export function formatCurrency(amount: number, currency = "PHP"): string {
  // Format with peso symbol
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return `₱${formatted}`;
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
