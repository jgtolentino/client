var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  consumers: () => consumers,
  insertConsumerSchema: () => insertConsumerSchema,
  insertTransactionSchema: () => insertTransactionSchema,
  insertUserSchema: () => insertUserSchema,
  transactions: () => transactions,
  users: () => users
});
import { pgTable, text, serial, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  volume: integer("volume").notNull(),
  pesoValue: decimal("peso_value", { precision: 10, scale: 2 }).notNull(),
  duration: integer("duration").notNull(),
  units: integer("units").notNull(),
  brand: text("brand").notNull(),
  category: text("category").notNull(),
  location: text("location").notNull(),
  barangay: text("barangay")
});
var consumers = pgTable("consumers", {
  id: serial("id").primaryKey(),
  gender: text("gender").notNull(),
  age: integer("age").notNull(),
  location: text("location").notNull(),
  transactionId: integer("transaction_id").references(() => transactions.id)
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true
});
var insertConsumerSchema = createInsertSchema(consumers).omit({
  id: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc } from "drizzle-orm";

// client/src/lib/data-utils.ts
function aggregateTransactionsByLocation(transactions2) {
  const locationMap = /* @__PURE__ */ new Map();
  transactions2.forEach((transaction) => {
    const location = transaction.location;
    const revenue = parseFloat(transaction.pesoValue);
    if (locationMap.has(location)) {
      const existing = locationMap.get(location);
      locationMap.set(location, {
        count: existing.count + 1,
        revenue: existing.revenue + revenue
      });
    } else {
      locationMap.set(location, { count: 1, revenue });
    }
  });
  const coordinates = {
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
    change: Math.random() * 10 - 2
    // Mock change percentage
  }));
}
function aggregateTransactionsByCategory(transactions2) {
  const categoryMap = /* @__PURE__ */ new Map();
  transactions2.forEach((transaction) => {
    const category = transaction.category;
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
  });
  const total = transactions2.length;
  const colors = ["hsl(var(--primary))", "hsl(42 100% 50%)", "hsl(142 76% 36%)", "hsl(0 84% 60%)"];
  return Array.from(categoryMap.entries()).map(([category, count], index) => ({
    category,
    value: count,
    percentage: count / total * 100,
    color: colors[index % colors.length]
  }));
}
function aggregateTransactionsByBrand(transactions2) {
  const brandMap = /* @__PURE__ */ new Map();
  transactions2.forEach((transaction) => {
    const brand = transaction.brand;
    const sales = parseFloat(transaction.pesoValue);
    if (brandMap.has(brand)) {
      const existing = brandMap.get(brand);
      brandMap.set(brand, {
        sales: existing.sales + sales,
        category: existing.category
      });
    } else {
      brandMap.set(brand, { sales, category: transaction.category });
    }
  });
  const tbwaClients = [
    "Del Monte",
    "Alaska",
    "Oishi",
    "Champion",
    "Pride",
    "Cyclone",
    "Alpine",
    "Cow Bell",
    "Winston",
    "Camel",
    "Mevius",
    "Gourmet Picks",
    "Crispy Patata"
  ];
  return Array.from(brandMap.entries()).map(([brand, data]) => ({
    brand,
    sales: data.sales,
    category: data.category,
    isTBWAClient: tbwaClients.some((client) => brand.includes(client))
  })).sort((a, b) => b.sales - a.sales).slice(0, 10);
}
function calculateKPIMetrics(transactions2, consumers2) {
  const totalTransactions = transactions2.length;
  const totalValue = transactions2.reduce((sum, t) => sum + parseFloat(t.pesoValue), 0);
  const avgValue = totalValue / totalTransactions;
  const substitutionRate = 12.4;
  const dataFreshness = 98.2;
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

// server/storage.ts
var MemStorage = class {
  users;
  transactions;
  consumers;
  currentUserId;
  currentTransactionId;
  currentConsumerId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.transactions = /* @__PURE__ */ new Map();
    this.consumers = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentTransactionId = 1;
    this.currentConsumerId = 1;
    this.initializeSampleData();
  }
  initializeSampleData() {
    const brandData = [
      // TBWA Clients - Del Monte
      { brand: "Del Monte Tomato Sauce & Ketchup", category: "Sauce", baseValue: 24e5, isTBWA: true },
      { brand: "Del Monte Spaghetti Sauce", category: "Sauce", baseValue: 195e4, isTBWA: true },
      { brand: "Del Monte Fruit Cocktail", category: "Canned Goods", baseValue: 16e5, isTBWA: true },
      { brand: "Del Monte Pineapple", category: "Canned Goods", baseValue: 13e5, isTBWA: true },
      { brand: "Del Monte Pasta", category: "Pasta", baseValue: 11e5, isTBWA: true },
      // TBWA Clients - Alaska
      { brand: "Alaska Evaporated Milk", category: "Dairy", baseValue: 19e5, isTBWA: true },
      { brand: "Alaska Condensed Milk", category: "Dairy", baseValue: 175e4, isTBWA: true },
      { brand: "Alaska Powdered Milk", category: "Dairy", baseValue: 14e5, isTBWA: true },
      { brand: "Alpine Evaporated Milk", category: "Dairy", baseValue: 125e4, isTBWA: true },
      { brand: "Krem-Top Coffee Creamer", category: "Dairy", baseValue: 12e5, isTBWA: true },
      { brand: "Cow Bell Powdered Milk", category: "Dairy", baseValue: 105e4, isTBWA: true },
      // TBWA Clients - Oishi
      { brand: "Oishi Prawn Crackers", category: "Snacks", baseValue: 12e5, isTBWA: true },
      { brand: "Oishi Ridges", category: "Snacks", baseValue: 95e4, isTBWA: true },
      { brand: "Oishi Bread Pan", category: "Snacks", baseValue: 85e4, isTBWA: true },
      { brand: "Oishi Marty's", category: "Snacks", baseValue: 7e5, isTBWA: true },
      { brand: "Oishi Pillows", category: "Snacks", baseValue: 65e4, isTBWA: true },
      { brand: "Gourmet Picks", category: "Snacks", baseValue: 6e5, isTBWA: true },
      { brand: "Crispy Patata", category: "Snacks", baseValue: 55e4, isTBWA: true },
      // TBWA Clients - Peerless
      { brand: "Champion Detergent", category: "Home Care", baseValue: 13e5, isTBWA: true },
      { brand: "Pride Dishwashing Liquid", category: "Home Care", baseValue: 11e5, isTBWA: true },
      { brand: "Cyclone Bleach", category: "Home Care", baseValue: 9e5, isTBWA: true },
      // TBWA Clients - JTI
      { brand: "Winston", category: "Tobacco", baseValue: 24e5, isTBWA: true },
      { brand: "Camel", category: "Tobacco", baseValue: 21e5, isTBWA: true },
      { brand: "Mevius", category: "Tobacco", baseValue: 14e5, isTBWA: true },
      // Competitors
      { brand: "UFC Tomato Sauce", category: "Sauce", baseValue: 4e5, isTBWA: false },
      { brand: "Bear Brand Milk", category: "Dairy", baseValue: 3e5, isTBWA: false },
      { brand: "Piattos", category: "Snacks", baseValue: 25e4, isTBWA: false },
      { brand: "Nestle Milk", category: "Dairy", baseValue: 2e5, isTBWA: false },
      { brand: "Rinbee", category: "Snacks", baseValue: 18e4, isTBWA: false },
      { brand: "Hi-Ho", category: "Snacks", baseValue: 16e4, isTBWA: false }
    ];
    const locations = ["Manila", "Cebu", "Davao", "Iloilo", "Cagayan de Oro", "Baguio", "Quezon City", "Zamboanga", "Bacolod", "Tacloban"];
    const barangays = ["Makati", "BGC", "Ortigas", "Alabang", "IT Park", "Lahug", "Poblacion", "Divisoria", "Session Road", "Commonwealth"];
    for (let i = 0; i < 500; i++) {
      const brand = brandData[Math.floor(Math.random() * brandData.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const barangay = barangays[Math.floor(Math.random() * barangays.length)];
      const date = /* @__PURE__ */ new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      const variance = 0.3 + Math.random() * 0.4;
      const pesoValue = Math.floor(brand.baseValue * variance);
      const transaction = {
        date: date.toISOString().split("T")[0],
        volume: Math.floor(1e3 + Math.random() * 2e3),
        pesoValue: pesoValue.toString(),
        duration: Math.floor(15 + Math.random() * 40),
        units: Math.floor(200 + Math.random() * 600),
        brand: brand.brand,
        category: brand.category,
        location,
        barangay
      };
      this.createTransaction(transaction);
    }
    const sampleConsumers = [
      { gender: "Male", age: 34, location: "Manila" },
      { gender: "Female", age: 28, location: "Cebu" },
      { gender: "Male", age: 42, location: "Manila" },
      { gender: "Female", age: 35, location: "Davao" },
      { gender: "Male", age: 29, location: "Cebu" },
      { gender: "Female", age: 31, location: "Manila" },
      { gender: "Male", age: 26, location: "Davao" },
      { gender: "Female", age: 39, location: "Cebu" }
    ];
    sampleConsumers.forEach((consumer) => {
      this.createConsumer(consumer);
    });
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Transaction methods
  async getAllTransactions() {
    return Array.from(this.transactions.values());
  }
  async getTransactionsByLocation(location) {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.location === location
    );
  }
  async getTransactionsByBrand(brand) {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.brand === brand
    );
  }
  async getTransactionsByCategory(category) {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.category === category
    );
  }
  async createTransaction(insertTransaction) {
    const id = this.currentTransactionId++;
    const transaction = {
      ...insertTransaction,
      id,
      pesoValue: insertTransaction.pesoValue
    };
    this.transactions.set(id, transaction);
    return transaction;
  }
  // Consumer methods
  async getAllConsumers() {
    return Array.from(this.consumers.values());
  }
  async createConsumer(insertConsumer) {
    const id = this.currentConsumerId++;
    const consumer = {
      ...insertConsumer,
      id
    };
    this.consumers.set(id, consumer);
    return consumer;
  }
  // Dashboard analytics methods
  async getKPIMetrics() {
    const transactions2 = await this.getAllTransactions();
    const consumers2 = await this.getAllConsumers();
    return calculateKPIMetrics(transactions2, consumers2);
  }
  async getLocationData() {
    const transactions2 = await this.getAllTransactions();
    return aggregateTransactionsByLocation(transactions2);
  }
  async getCategoryData() {
    const transactions2 = await this.getAllTransactions();
    return aggregateTransactionsByCategory(transactions2);
  }
  async getBrandData() {
    const transactions2 = await this.getAllTransactions();
    return aggregateTransactionsByBrand(transactions2);
  }
  async getTrendData() {
    const transactions2 = await this.getAllTransactions();
    const dateGroups = /* @__PURE__ */ new Map();
    transactions2.forEach((transaction) => {
      const date = transaction.date;
      if (!dateGroups.has(date)) {
        dateGroups.set(date, []);
      }
      dateGroups.get(date).push(transaction);
    });
    return Array.from(dateGroups.entries()).map(([date, dayTransactions]) => ({
      period: date,
      transactions: dayTransactions.length,
      pesoValue: dayTransactions.reduce((sum, t) => sum + parseFloat(t.pesoValue), 0)
    })).sort((a, b) => a.period.localeCompare(b.period)).slice(-7);
  }
  async getAIInsights() {
    return [
      {
        id: "1",
        type: "error",
        title: "Declining Market Share",
        description: "TBWA client brands show 3.2% decline in weekly transactions vs competitors",
        impact: "high",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: "2",
        type: "warning",
        title: "Growth Opportunity",
        description: "Strong potential identified in Cebu market for dairy products expansion",
        impact: "medium",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: "3",
        type: "info",
        title: "Peak Performance",
        description: "Del Monte and Alaska brands achieving 18% above-average transaction values",
        impact: "low",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    ];
  }
};
var DatabaseStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async getAllTransactions() {
    return await db.select().from(transactions).orderBy(desc(transactions.id));
  }
  async getTransactionsByLocation(location) {
    return await db.select().from(transactions).where(eq(transactions.location, location));
  }
  async getTransactionsByBrand(brand) {
    return await db.select().from(transactions).where(eq(transactions.brand, brand));
  }
  async getTransactionsByCategory(category) {
    return await db.select().from(transactions).where(eq(transactions.category, category));
  }
  async createTransaction(insertTransaction) {
    const [transaction] = await db.insert(transactions).values(insertTransaction).returning();
    return transaction;
  }
  async getAllConsumers() {
    return await db.select().from(consumers);
  }
  async createConsumer(insertConsumer) {
    const [consumer] = await db.insert(consumers).values(insertConsumer).returning();
    return consumer;
  }
  // Keep all the analytics methods from MemStorage but use database data
  async getKPIMetrics() {
    const allTransactions = await this.getAllTransactions();
    const allConsumers = await this.getAllConsumers();
    return calculateKPIMetrics(allTransactions, allConsumers);
  }
  async getLocationData() {
    const allTransactions = await this.getAllTransactions();
    return aggregateTransactionsByLocation(allTransactions);
  }
  async getCategoryData() {
    const allTransactions = await this.getAllTransactions();
    return aggregateTransactionsByCategory(allTransactions);
  }
  async getBrandData() {
    const allTransactions = await this.getAllTransactions();
    return aggregateTransactionsByBrand(allTransactions);
  }
  async getTrendData() {
    const allTransactions = await this.getAllTransactions();
    const groupedByDate = allTransactions.reduce((acc, transaction) => {
      const date = transaction.date;
      if (!acc[date]) {
        acc[date] = { transactions: 0, pesoValue: 0 };
      }
      acc[date].transactions++;
      acc[date].pesoValue += parseFloat(transaction.pesoValue);
      return acc;
    }, {});
    return Object.entries(groupedByDate).map(([period, data]) => ({
      period,
      transactions: data.transactions,
      pesoValue: data.pesoValue
    })).sort((a, b) => a.period.localeCompare(b.period)).slice(-7);
  }
  async getAIInsights() {
    const allTransactions = await this.getAllTransactions();
    const brandData = await this.getBrandData();
    const insights = [];
    const tbwaClients = brandData.filter((b) => b.isTBWAClient);
    const avgGrowth = tbwaClients.reduce((sum, b) => sum + (b.growth || 0), 0) / tbwaClients.length;
    if (avgGrowth > 15) {
      insights.push({
        id: "1",
        type: "info",
        title: "Strong TBWA Client Performance",
        description: `TBWA clients showing ${avgGrowth.toFixed(1)}% average growth across Philippine markets`,
        impact: "high",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    const topLocation = await this.getLocationData();
    if (topLocation[0]?.transactions > 50) {
      insights.push({
        id: "2",
        type: "info",
        title: "Regional Market Leader",
        description: `${topLocation[0].location} leading with ${topLocation[0].transactions} transactions`,
        impact: "medium",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    return insights;
  }
};
var storage = process.env.NODE_ENV === "production" ? new DatabaseStorage() : new MemStorage();

// server/health.ts
var healthCheck = (_req, res) => {
  const healthStatus = {
    status: "healthy",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    memory: {
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + " MB",
      heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + " MB"
    },
    version: process.env.npm_package_version || "1.0.0"
  };
  res.status(200).json(healthStatus);
};

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/health", healthCheck);
  app2.get("/api/dashboard/kpi", async (req, res) => {
    try {
      const metrics = await storage.getKPIMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch KPI metrics" });
    }
  });
  app2.get("/api/dashboard/locations", async (req, res) => {
    try {
      const locations = await storage.getLocationData();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch location data" });
    }
  });
  app2.get("/api/dashboard/categories", async (req, res) => {
    try {
      const categories = await storage.getCategoryData();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category data" });
    }
  });
  app2.get("/api/dashboard/brands", async (req, res) => {
    try {
      const brands = await storage.getBrandData();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch brand data" });
    }
  });
  app2.get("/api/dashboard/trends", async (req, res) => {
    try {
      const trends = await storage.getTrendData();
      res.json(trends);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trend data" });
    }
  });
  app2.get("/api/dashboard/insights", async (req, res) => {
    try {
      const insights = await storage.getAIInsights();
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AI insights" });
    }
  });
  app2.get("/api/transactions", async (req, res) => {
    try {
      const { location, brand, category } = req.query;
      let transactions2;
      if (location) {
        transactions2 = await storage.getTransactionsByLocation(location);
      } else if (brand) {
        transactions2 = await storage.getTransactionsByBrand(brand);
      } else if (category) {
        transactions2 = await storage.getTransactionsByCategory(category);
      } else {
        transactions2 = await storage.getAllTransactions();
      }
      res.json(transactions2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });
  app2.get("/api/consumers", async (req, res) => {
    try {
      const consumers2 = await storage.getAllConsumers();
      res.json(consumers2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch consumers" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    // Fix bundle size issues
    chunkSizeWarningLimit: 1e3,
    // Increase limit to 1MB
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React vendor code
          "react-vendor": ["react", "react-dom", "wouter"],
          // Split chart libraries
          "chart-vendor": ["recharts"],
          // Split UI component libraries
          "ui-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-popover",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-progress",
            "@radix-ui/react-tabs",
            "@radix-ui/react-switch",
            "@radix-ui/react-scroll-area"
          ],
          // Split utility libraries
          "util-vendor": ["clsx", "class-variance-authority", "tailwind-merge"],
          // Split map libraries (if any)
          "map-vendor": ["leaflet", "react-leaflet"],
          // Split query libraries
          "query-vendor": ["@tanstack/react-query"],
          // Split icon libraries
          "icon-vendor": ["lucide-react"]
        }
      }
    },
    // Optimize for production  
    minify: "esbuild"
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "recharts",
      "@tanstack/react-query",
      "lucide-react"
    ]
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  if (process.env.AZURE_FUNCTIONS_ENVIRONMENT) {
    return app;
  }
  const port = process.env.PORT || 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
var index_default = app;
export {
  index_default as default
};
