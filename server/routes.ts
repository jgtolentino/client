import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { healthCheck } from "./health";
import { getDashboardData, getDashboardDataSubset } from "./routes/dashboard-data";
import { getParquetData, getParquetMetadata } from "./routes/parquet-data";
import { 
  getTransactions, 
  getBrandPerformance, 
  getLocationAnalytics, 
  getKPIMetrics as getAzureSQLKPIs,
  getTrendData,
  executeCustomQuery,
  getDatasetMetadata
} from "./routes/azure-sql-data";
import { 
  aggregateTransactionsByLocation,
  aggregateTransactionsByCategory,
  aggregateTransactionsByBrand,
  calculateKPIMetrics
} from "../client/src/lib/data-utils";
import type { 
  Transaction, 
  Consumer,
  TrendData 
} from "@shared/schema";
import datasourceRoutes from "./routes/datasources";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register datasource routes
  app.use("/api", datasourceRoutes);

  // Health check endpoint
  app.get("/api/health", healthCheck);

  // Dashboard data endpoints (Azure Blob Storage)
  app.get("/api/dashboard-data", getDashboardData);
  app.get("/api/dashboard-data/subset", getDashboardDataSubset);

  // Parquet data endpoints
  app.get("/api/parquet", getParquetMetadata);
  app.get("/api/parquet/data", getParquetData);

  // Azure SQL data endpoints (TBWA Mock Data)
  app.get("/api/azure-sql/transactions", getTransactions);
  app.get("/api/azure-sql/brands", getBrandPerformance);
  app.get("/api/azure-sql/locations", getLocationAnalytics);
  app.get("/api/azure-sql/kpi", getAzureSQLKPIs);
  app.get("/api/azure-sql/trends", getTrendData);
  app.get("/api/azure-sql/metadata", getDatasetMetadata);
  app.post("/api/azure-sql/query", executeCustomQuery);

  // Dashboard analytics endpoints
  app.get("/api/dashboard/kpi", async (req, res) => {
    try {
      const metrics = await storage.getKPIMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch KPI metrics" });
    }
  });

  app.get("/api/dashboard/locations", async (req, res) => {
    try {
      const locations = await storage.getLocationData();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch location data" });
    }
  });

  app.get("/api/dashboard/categories", async (req, res) => {
    try {
      const categories = await storage.getCategoryData();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category data" });
    }
  });

  app.get("/api/dashboard/brands", async (req, res) => {
    try {
      const brands = await storage.getBrandData();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch brand data" });
    }
  });

  app.get("/api/dashboard/trends", async (req, res) => {
    try {
      const trends = await storage.getTrendData();
      res.json(trends);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trend data" });
    }
  });

  app.get("/api/dashboard/insights", async (req, res) => {
    try {
      const insights = await storage.getAIInsights();
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AI insights" });
    }
  });

  // Transaction endpoints
  app.get("/api/transactions", async (req, res) => {
    try {
      const { location, brand, category } = req.query;
      
      let transactions;
      if (location) {
        transactions = await storage.getTransactionsByLocation(location as string);
      } else if (brand) {
        transactions = await storage.getTransactionsByBrand(brand as string);
      } else if (category) {
        transactions = await storage.getTransactionsByCategory(category as string);
      } else {
        transactions = await storage.getAllTransactions();
      }
      
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/consumers", async (req, res) => {
    try {
      const consumers = await storage.getAllConsumers();
      res.json(consumers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch consumers" });
    }
  });

  // 1. Brand performance endpoints
  app.get("/api/brands/:brandName/performance", async (req, res) => {
    try {
      const { brandName } = req.params;
      const { period = "30d" } = req.query;
      const transactions = await storage.getTransactionsByBrand(brandName);
      
      // Calculate performance metrics
      const totalValue = transactions.reduce((sum, t) => sum + parseFloat(t.pesoValue), 0);
      const avgTransaction = totalValue / transactions.length || 0;
      const growth = calculateGrowth(transactions, period as string);
      
      res.json({
        brand: brandName,
        period,
        metrics: {
          totalValue,
          transactionCount: transactions.length,
          averageTransaction: avgTransaction,
          growth
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch brand performance" });
    }
  });

  // 2. Location analytics endpoint
  app.get("/api/locations/:location/analytics", async (req, res) => {
    try {
      const { location } = req.params;
      const transactions = await storage.getTransactionsByLocation(location);
      const brandBreakdown = aggregateTransactionsByBrand(transactions);
      const categoryBreakdown = aggregateTransactionsByCategory(transactions);
      
      res.json({
        location,
        totalTransactions: transactions.length,
        totalValue: transactions.reduce((sum, t) => sum + parseFloat(t.pesoValue), 0),
        topBrands: brandBreakdown.slice(0, 5),
        categoryBreakdown
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch location analytics" });
    }
  });

  // 3. Consumer segmentation endpoint
  app.get("/api/consumers/segments", async (req, res) => {
    try {
      const consumers = await storage.getAllConsumers();
      const segments = {
        byAge: segmentByAge(consumers),
        byGender: segmentByGender(consumers),
        byLocation: segmentByLocation(consumers)
      };
      res.json(segments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch consumer segments" });
    }
  });

  // 4. Real-time data refresh endpoint
  app.post("/api/dashboard/refresh", async (req, res) => {
    try {
      // In production, this would fetch from real data sources
      const refreshedData = {
        kpi: await storage.getKPIMetrics(),
        brands: await storage.getBrandData(),
        trends: await storage.getTrendData(),
        insights: await storage.getAIInsights(),
        timestamp: new Date().toISOString()
      };
      res.json(refreshedData);
    } catch (error) {
      res.status(500).json({ error: "Failed to refresh dashboard data" });
    }
  });

  // 5. Data filtering endpoint
  app.post("/api/dashboard/filter", async (req, res) => {
    try {
      const { dateRange, location, brand, category } = req.body;
      let transactions = await storage.getAllTransactions();
      
      // Apply filters
      if (dateRange) {
        transactions = filterByDateRange(transactions, dateRange);
      }
      if (location && location !== "All Locations") {
        transactions = transactions.filter(t => t.location === location);
      }
      if (brand && brand !== "All Brands") {
        transactions = transactions.filter(t => t.brand === brand);
      }
      if (category && category !== "All Categories") {
        transactions = transactions.filter(t => t.category === category);
      }
      
      // Recalculate metrics with filtered data
      const filteredMetrics = {
        kpi: calculateKPIMetrics(transactions, await storage.getAllConsumers()),
        brands: aggregateTransactionsByBrand(transactions),
        locations: aggregateTransactionsByLocation(transactions),
        categories: aggregateTransactionsByCategory(transactions),
        trends: calculateTrends(transactions)
      };
      
      res.json(filteredMetrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to filter data" });
    }
  });

  // 6. Export data endpoints
  app.get("/api/export/csv", async (req, res) => {
    try {
      const { type = "transactions" } = req.query;
      let data: any[] = [];
      let filename = "";
      
      switch (type) {
        case "transactions":
          data = await storage.getAllTransactions();
          filename = "transactions.csv";
          break;
        case "brands":
          data = await storage.getBrandData();
          filename = "brand_performance.csv";
          break;
        case "locations":
          data = await storage.getLocationData();
          filename = "location_analytics.csv";
          break;
      }
      
      const csv = convertToCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(csv);
    } catch (error) {
      res.status(500).json({ error: "Failed to export data" });
    }
  });

  // 7. Generate report endpoint
  app.post("/api/reports/generate", async (req, res) => {
    try {
      const { reportType, filters, format = "json" } = req.body;
      
      const reportData = {
        title: `${reportType} Report`,
        generatedAt: new Date().toISOString(),
        filters,
        summary: await generateReportSummary(reportType, filters),
        data: await getReportData(reportType, filters)
      };
      
      if (format === "pdf") {
        // In production, use a PDF generation library
        res.status(501).json({ error: "PDF generation not yet implemented" });
      } else {
        res.json(reportData);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to generate report" });
    }
  });

  // 8. Comparison endpoint
  app.get("/api/compare", async (req, res) => {
    try {
      const { brands, period = "30d" } = req.query;
      const brandList = (brands as string)?.split(',') || [];
      
      const comparisons = await Promise.all(
        brandList.map(async (brand) => {
          const transactions = await storage.getTransactionsByBrand(brand);
          return {
            brand,
            metrics: calculateBrandMetrics(transactions, period as string)
          };
        })
      );
      
      res.json({ comparisons, period });
    } catch (error) {
      res.status(500).json({ error: "Failed to compare brands" });
    }
  });

  // 9. Predictive analytics endpoint
  app.get("/api/analytics/predict", async (req, res) => {
    try {
      const { brand, metric = "sales" } = req.query;
      const transactions = brand 
        ? await storage.getTransactionsByBrand(brand as string)
        : await storage.getAllTransactions();
      
      const prediction = {
        metric,
        brand: brand || "all",
        currentValue: calculateCurrentValue(transactions, metric as string),
        predictedValue: calculatePrediction(transactions, metric as string),
        confidence: 0.75,
        factors: ["Historical trends", "Seasonal patterns", "Market conditions"]
      };
      
      res.json(prediction);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate predictions" });
    }
  });

  // 10. Alert configuration endpoints
  app.get("/api/alerts", async (req, res) => {
    try {
      // In production, fetch from database
      const alerts = [
        {
          id: "1",
          type: "threshold",
          metric: "sales_decline",
          threshold: -10,
          brands: ["Oishi Ridges", "Winston"],
          active: true
        }
      ];
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const alert = req.body;
      // In production, save to database
      res.json({ ...alert, id: Date.now().toString() });
    } catch (error) {
      res.status(500).json({ error: "Failed to create alert" });
    }
  });

  // 11. Search endpoint
  app.get("/api/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.json({ results: [] });
      }
      
      const query = (q as string).toLowerCase();
      const [brands, locations, categories] = await Promise.all([
        storage.getBrandData(),
        storage.getLocationData(),
        storage.getCategoryData()
      ]);
      
      const results = {
        brands: brands.filter(b => b.brand.toLowerCase().includes(query)),
        locations: locations.filter(l => l.location.toLowerCase().includes(query)),
        categories: categories.filter(c => c.category.toLowerCase().includes(query))
      };
      
      res.json({ query: q, results });
    } catch (error) {
      res.status(500).json({ error: "Failed to search" });
    }
  });

  // 12. Dashboard preferences endpoint
  app.get("/api/preferences", async (req, res) => {
    try {
      // In production, fetch from user session/database
      const preferences = {
        defaultView: "overview",
        refreshInterval: 30000,
        chartType: "line",
        colorScheme: "default"
      };
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch preferences" });
    }
  });

  app.put("/api/preferences", async (req, res) => {
    try {
      const preferences = req.body;
      // In production, save to user session/database
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ error: "Failed to update preferences" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions
function calculateGrowth(transactions: Transaction[], period: string): number {
  // Simple growth calculation
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const recentTransactions = transactions.filter(t => new Date(t.date) >= cutoffDate);
  const previousTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date < cutoffDate && date >= new Date(cutoffDate.getTime() - days * 24 * 60 * 60 * 1000);
  });
  
  const recentValue = recentTransactions.reduce((sum, t) => sum + parseFloat(t.pesoValue), 0);
  const previousValue = previousTransactions.reduce((sum, t) => sum + parseFloat(t.pesoValue), 0);
  
  return previousValue > 0 ? ((recentValue - previousValue) / previousValue) * 100 : 0;
}

function segmentByAge(consumers: Consumer[]): Record<string, number> {
  const segments = {
    "18-25": 0,
    "26-35": 0,
    "36-45": 0,
    "46+": 0
  };
  
  consumers.forEach(c => {
    if (c.age <= 25) segments["18-25"]++;
    else if (c.age <= 35) segments["26-35"]++;
    else if (c.age <= 45) segments["36-45"]++;
    else segments["46+"]++;
  });
  
  return segments;
}

function segmentByGender(consumers: Consumer[]): Record<string, number> {
  return consumers.reduce((acc, c) => {
    acc[c.gender] = (acc[c.gender] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

function segmentByLocation(consumers: Consumer[]): Record<string, number> {
  return consumers.reduce((acc, c) => {
    acc[c.location] = (acc[c.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

function filterByDateRange(transactions: Transaction[], dateRange: string): Transaction[] {
  const now = new Date();
  let startDate = new Date();
  
  switch (dateRange) {
    case "Last 7 Days":
      startDate.setDate(now.getDate() - 7);
      break;
    case "Last 30 Days":
      startDate.setDate(now.getDate() - 30);
      break;
    case "Last 90 Days":
      startDate.setDate(now.getDate() - 90);
      break;
    default:
      return transactions;
  }
  
  return transactions.filter(t => new Date(t.date) >= startDate);
}

function calculateTrends(transactions: Transaction[]): TrendData[] {
  const grouped = transactions.reduce((acc, t) => {
    if (!acc[t.date]) {
      acc[t.date] = { transactions: 0, pesoValue: 0 };
    }
    acc[t.date].transactions++;
    acc[t.date].pesoValue += parseFloat(t.pesoValue);
    return acc;
  }, {} as Record<string, { transactions: number; pesoValue: number }>);
  
  return Object.entries(grouped)
    .map(([period, data]) => ({ period, ...data }))
    .sort((a, b) => a.period.localeCompare(b.period));
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return "";
  
  const headers = Object.keys(data[0]);
  const rows = data.map(item => 
    headers.map(header => JSON.stringify(item[header] || "")).join(",")
  );
  
  return [headers.join(","), ...rows].join("\n");
}

async function generateReportSummary(reportType: string, filters: any): Promise<any> {
  return {
    type: reportType,
    generatedAt: new Date().toISOString(),
    filters,
    keyFindings: [
      "Brand performance shows positive trend",
      "Regional markets expanding",
      "Category diversification successful"
    ]
  };
}

async function getReportData(reportType: string, filters: any): Promise<any> {
  // Implementation would fetch and format data based on report type
  return {
    type: reportType,
    data: []
  };
}

function calculateBrandMetrics(transactions: Transaction[], period: string): any {
  const totalValue = transactions.reduce((sum, t) => sum + parseFloat(t.pesoValue), 0);
  const avgTransaction = totalValue / transactions.length || 0;
  
  return {
    totalValue,
    transactionCount: transactions.length,
    averageTransaction: avgTransaction,
    growth: calculateGrowth(transactions, period)
  };
}

function calculateCurrentValue(transactions: Transaction[], metric: string): number {
  switch (metric) {
    case "sales":
      return transactions.reduce((sum, t) => sum + parseFloat(t.pesoValue), 0);
    case "volume":
      return transactions.reduce((sum, t) => sum + t.volume, 0);
    case "transactions":
      return transactions.length;
    default:
      return 0;
  }
}

function calculatePrediction(transactions: Transaction[], metric: string): number {
  // Simple prediction - in production use proper ML/statistical models
  const currentValue = calculateCurrentValue(transactions, metric);
  const growthRate = 0.05; // 5% growth prediction
  return currentValue * (1 + growthRate);
}
