var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// client/public/data/dashboard_data.json
var require_dashboard_data = __commonJS({
  "client/public/data/dashboard_data.json"(exports, module) {
    module.exports = {
      transaction_trends: [
        {
          transaction_id: "TRX0001",
          date: "2025-05-21",
          volume: 1723,
          peso_value: 632613.53,
          duration_seconds: 78,
          units: 2,
          brand: "Pride (Dishwashing Liquid)",
          category: "General",
          store_id: "STR5",
          store_location: "Central",
          city: "Taguig",
          time: "12:59:00",
          hour: 12,
          time_of_day: "Afternoon",
          day_of_week: "Wednesday",
          is_weekend: false,
          is_peak_hour: false,
          payment_method: "Cash",
          cashier_id: "EMP1",
          sku: "GEN-PRI-297",
          unit_price: 316306.765,
          cost: 268860.75025,
          margin_percentage: "15.00",
          was_recommended: false,
          originally_requested: "Pride (Dishwashing Liquid)",
          influence_success: false,
          customer_id: "CUST112"
        },
        {
          transaction_id: "TRX0002",
          date: "2025-05-09",
          volume: 1164,
          peso_value: 242493006e-2,
          duration_seconds: 176,
          units: 3,
          brand: "Crispy Patata",
          category: "General",
          store_id: "STR8",
          store_location: "Central",
          city: "Taguig",
          time: "07:07:00",
          hour: 7,
          time_of_day: "Morning",
          day_of_week: "Friday",
          is_weekend: false,
          is_peak_hour: true,
          payment_method: "Cash",
          cashier_id: "EMP4",
          sku: "GEN-CRI-824",
          unit_price: 808310.02,
          cost: 687063.517,
          margin_percentage: "15.00",
          was_recommended: true,
          originally_requested: "Crispy Patata",
          influence_success: false,
          customer_id: "CUST176"
        },
        {
          transaction_id: "TRX0003",
          date: "2025-05-12",
          volume: 1651,
          peso_value: 220428308e-2,
          duration_seconds: 54,
          units: 8,
          brand: "Oishi Pillows",
          category: "Snacks",
          store_id: "STR9",
          store_location: "Central",
          city: "Iloilo",
          time: "17:17:00",
          hour: 17,
          time_of_day: "Evening",
          day_of_week: "Monday",
          is_weekend: false,
          is_peak_hour: true,
          payment_method: "Maya",
          cashier_id: "EMP3",
          sku: "SNK-OIS-884",
          unit_price: 275535.385,
          cost: 234205.07725,
          margin_percentage: "15.00",
          was_recommended: false,
          originally_requested: "Oishi Pillows",
          influence_success: false,
          customer_id: "0CUST90"
        },
        {
          transaction_id: "TRX0004",
          date: "2025-04-26",
          volume: 758,
          peso_value: 205368461e-2,
          duration_seconds: 192,
          units: 6,
          brand: "Champion (Detergent, Fabric Conditioner)",
          category: "General",
          store_id: "STR5",
          store_location: "Bagong Pag-asa",
          city: "Iloilo",
          time: "12:03:00",
          hour: 12,
          time_of_day: "Afternoon",
          day_of_week: "Saturday",
          is_weekend: true,
          is_peak_hour: false,
          payment_method: "Cash",
          cashier_id: "EMP1",
          sku: "GEN-CHA-762",
          unit_price: 342280.76833333337,
          cost: 290938.65308333334,
          margin_percentage: "15.00",
          was_recommended: true,
          originally_requested: "Marlboro",
          influence_success: true,
          customer_id: "0CUST53"
        },
        {
          transaction_id: "TRX0005",
          date: "2025-05-01",
          volume: 537,
          peso_value: 998067.59,
          duration_seconds: 177,
          units: 6,
          brand: "Del Monte Fruit Cocktail",
          category: "Beverages",
          store_id: "STR5",
          store_location: "Sta. Cruz",
          city: "Zamboanga",
          time: "09:12:00",
          hour: 9,
          time_of_day: "Morning",
          day_of_week: "Thursday",
          is_weekend: false,
          is_peak_hour: true,
          payment_method: "Cash",
          cashier_id: "EMP2",
          sku: "BEV-DEL-888",
          unit_price: 166344.59833333333,
          cost: 141392.90858333334,
          margin_percentage: "15.00",
          was_recommended: false,
          originally_requested: "Del Monte Fruit Cocktail",
          influence_success: false,
          customer_id: "0CUST67"
        }
      ],
      brand_trends: [
        {
          brand: "Alaska Powdered Milk",
          category: "Dairy",
          value: 109975.14,
          pct_change: 0.0521
        },
        {
          brand: "Camel",
          category: "General",
          value: 135746293e-2,
          pct_change: 0.1721
        },
        {
          brand: "Today's (Budget-Friendly Product Line)",
          category: "General",
          value: 420228.22,
          pct_change: 0.1996
        },
        {
          brand: "Alaska Milk Corporation",
          category: "Dairy",
          value: 127041285e-2,
          pct_change: 0.0794
        },
        {
          brand: "Calla (Personal Care Products)",
          category: "General",
          value: 226712525e-2,
          pct_change: -0.0657
        }
      ],
      consumer_profiles: [],
      product_mix: [],
      basket_analysis: [
        {
          basket_id: "BASKET0001",
          brand: "Oishi Marty's",
          item_count: 2,
          total_value: 1599.22,
          customer_id: "CUST0001",
          transaction_date: "2025-05-21",
          store_id: "STR3"
        },
        {
          basket_id: "BASKET0002",
          brand: "Caster",
          item_count: 4,
          total_value: 390.39,
          customer_id: "CUST0002",
          transaction_date: "2025-05-09",
          store_id: "STR10"
        },
        {
          basket_id: "BASKET0003",
          brand: "Alpine (Evaporated & Condensed Milk)",
          item_count: 7,
          total_value: 1486.33,
          customer_id: "CUST0003",
          transaction_date: "2025-05-12",
          store_id: "STR10"
        },
        {
          basket_id: "BASKET0004",
          brand: "Rinbee",
          item_count: 3,
          total_value: 733.25,
          customer_id: "CUST0004",
          transaction_date: "2025-04-26",
          store_id: "STR10"
        },
        {
          basket_id: "BASKET0005",
          brand: "Deli Mex",
          item_count: 7,
          total_value: 1790.79,
          customer_id: "CUST0005",
          transaction_date: "2025-05-01",
          store_id: "STR8"
        }
      ],
      ai_insights: [
        {
          insight_id: "INS001",
          type: "opportunity",
          severity: "high",
          message: "Peak hours show -5% higher transaction values",
          recommendation: "Ensure full stock availability during peak hours (6-9 AM, 5-8 PM)",
          potential_revenue_impact: -5326365016615368e-7,
          confidence_score: 0.89,
          affected_categories: [
            "Cigarettes",
            "Beverages",
            "Snacks"
          ]
        },
        {
          insight_id: "00INS2",
          type: "optimization",
          severity: "low",
          message: "General drives 59% of transactions",
          recommendation: "Expand General product range and ensure competitive pricing",
          potential_revenue_impact: 4444445784600007e-8,
          confidence_score: 0.82
        }
      ],
      time_patterns: {
        hourly_patterns: [
          {
            hour: 6,
            time_label: "6:00",
            avg_transactions: 26,
            avg_basket_size: "7.2",
            avg_transaction_value: "1585299.48",
            total_revenue: "41217786.58",
            is_peak: true
          },
          {
            hour: 7,
            time_label: "7:00",
            avg_transactions: 39,
            avg_basket_size: "5.6",
            avg_transaction_value: "1445590.32",
            total_revenue: "56378022.38",
            is_peak: true
          },
          {
            hour: 8,
            time_label: "8:00",
            avg_transactions: 36,
            avg_basket_size: "5.3",
            avg_transaction_value: "1545963.47",
            total_revenue: "55654684.94",
            is_peak: true
          }
        ],
        demand_forecast: []
      },
      substitution_patterns: [
        {
          original: "Del Monte Pasta",
          substitution: "Alaska Powdered Milk",
          count: 127,
          reason: "Taste",
          avg_price_difference: "7.77",
          conversion_rate: "0.80",
          revenue_impact: "5657.55"
        },
        {
          original: "Crispy Patata",
          substitution: "Del Monte Fruit Cocktail",
          count: 17,
          reason: "Price",
          avg_price_difference: "12.94",
          conversion_rate: "0.81",
          revenue_impact: "43.15"
        },
        {
          original: "Oaties",
          substitution: "Winston",
          count: 27,
          reason: "Availability",
          avg_price_difference: "5.52",
          conversion_rate: "0.70",
          revenue_impact: "476.56"
        }
      ],
      location_data: [],
      sku_data: [],
      _metadata: {
        total_records: {
          transaction_trends: 500,
          brand_trends: 40,
          consumer_profiles: 0
        },
        data_location: "azure-blob-storage",
        last_updated: "2025-05-25T17:23:41.753Z"
      }
    };
  }
});

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// client/src/lib/data-utils.ts
function aggregateTransactionsByLocation(transactions) {
  const locationMap = /* @__PURE__ */ new Map();
  transactions.forEach((transaction) => {
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
function aggregateTransactionsByCategory(transactions) {
  const categoryMap = /* @__PURE__ */ new Map();
  transactions.forEach((transaction) => {
    const category = transaction.category;
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
  });
  const total = transactions.length;
  const colors = ["hsl(var(--primary))", "hsl(42 100% 50%)", "hsl(142 76% 36%)", "hsl(0 84% 60%)"];
  return Array.from(categoryMap.entries()).map(([category, count], index) => ({
    category,
    value: count,
    percentage: count / total * 100,
    color: colors[index % colors.length]
  }));
}
function aggregateTransactionsByBrand(transactions) {
  const brandMap = /* @__PURE__ */ new Map();
  transactions.forEach((transaction) => {
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
function calculateKPIMetrics(transactions, consumers) {
  const totalTransactions = transactions.length;
  const totalValue = transactions.reduce((sum, t) => sum + parseFloat(t.pesoValue), 0);
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
    const transactions = await this.getAllTransactions();
    const consumers = await this.getAllConsumers();
    return calculateKPIMetrics(transactions, consumers);
  }
  async getLocationData() {
    const transactions = await this.getAllTransactions();
    return aggregateTransactionsByLocation(transactions);
  }
  async getCategoryData() {
    const transactions = await this.getAllTransactions();
    return aggregateTransactionsByCategory(transactions);
  }
  async getBrandData() {
    const transactions = await this.getAllTransactions();
    return aggregateTransactionsByBrand(transactions);
  }
  async getTrendData() {
    const transactions = await this.getAllTransactions();
    const dateGroups = /* @__PURE__ */ new Map();
    transactions.forEach((transaction) => {
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
var storage = new MemStorage();

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

// server/routes/dashboard-data.ts
var AZURE_STORAGE_URL = process.env.AZURE_STORAGE_URL || "https://your-account.blob.core.windows.net";
var CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME || "dashboard-data";
var USE_PARQUET = process.env.USE_PARQUET === "true";
var cachedData = null;
var cacheTimestamp = 0;
var CACHE_DURATION = 5 * 60 * 1e3;
async function getDashboardData(req, res) {
  try {
    const now = Date.now();
    if (cachedData && now - cacheTimestamp < CACHE_DURATION) {
      return res.json(cachedData);
    }
    if (process.env.NODE_ENV === "production" && process.env.AZURE_STORAGE_URL) {
      const response = await fetch(`${AZURE_STORAGE_URL}/${CONTAINER_NAME}/dashboard-data.json`);
      if (!response.ok) {
        throw new Error("Failed to fetch data from Azure");
      }
      cachedData = await response.json();
      cacheTimestamp = now;
      return res.json(cachedData);
    }
    const sampleData = await Promise.resolve().then(() => __toESM(require_dashboard_data(), 1));
    return res.json(sampleData.default);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({
      error: "Failed to fetch dashboard data",
      message: process.env.NODE_ENV === "development" ? error.message : void 0
    });
  }
}
async function getDashboardDataSubset(req, res) {
  const { subset, limit = 100, offset = 0 } = req.query;
  try {
    const fullData = await getDashboardDataInternal();
    if (!subset || typeof subset !== "string") {
      return res.status(400).json({ error: "Subset parameter required" });
    }
    const data = fullData[subset];
    if (!Array.isArray(data)) {
      return res.json(data || null);
    }
    const paginatedData = data.slice(
      Number(offset),
      Number(offset) + Number(limit)
    );
    res.json({
      data: paginatedData,
      total: data.length,
      limit: Number(limit),
      offset: Number(offset),
      hasMore: Number(offset) + Number(limit) < data.length
    });
  } catch (error) {
    console.error("Error fetching data subset:", error);
    res.status(500).json({ error: "Failed to fetch data subset" });
  }
}
async function getDashboardDataInternal() {
  return {
    transaction_trends: [],
    brand_trends: [],
    consumer_profiles: [],
    product_mix: [],
    ai_insights: [],
    time_patterns: {
      hourly_patterns: [],
      demand_forecast: []
    }
  };
}

// server/routes/datasources.ts
import { Router } from "express";

// server/datasources/core/types.ts
var ConnectorError = class extends Error {
  constructor(message, code, details) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = "ConnectorError";
  }
};
var ConnectionError = class extends ConnectorError {
  constructor(message, details) {
    super(message, "CONNECTION_ERROR", details);
    this.name = "ConnectionError";
  }
};
var QueryError = class extends ConnectorError {
  constructor(message, query, details) {
    super(message, "QUERY_ERROR", details);
    this.query = query;
    this.name = "QueryError";
  }
};

// server/datasources/core/BaseConnector.ts
var BaseConnector = class {
  config;
  connected = false;
  connectionStartTime;
  constructor(config) {
    this.config = config;
  }
  // Common implementation methods
  isConnected() {
    return this.connected;
  }
  async testConnection() {
    const startTime = Date.now();
    try {
      if (!this.connected) {
        await this.connect(this.config);
      }
      const testResult = await this.runTestQuery();
      const latency = Date.now() - startTime;
      return {
        success: true,
        message: "Connection successful",
        details: {
          latency,
          ...testResult
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Connection failed: ${error.message}`,
        error
      };
    }
  }
  // Default streaming implementation - can be overridden for better performance
  async *queryStream(request) {
    const result = await this.query(request);
    for (const row of result.rows) {
      yield row;
    }
  }
  // Helper methods for subclasses
  async runTestQuery() {
    try {
      const result = await this.query({
        sql: "SELECT 1 as test"
      });
      return { rows: result.rowCount };
    } catch {
      return { connected: true };
    }
  }
  validateConnection() {
    if (!this.connected) {
      throw new ConnectionError("Not connected to data source");
    }
  }
  async executeWithRetry(operation, maxRetries = 3, retryDelay = 1e3) {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (this.isNonRetryableError(error)) {
          throw error;
        }
        if (attempt < maxRetries) {
          await this.delay(retryDelay * Math.pow(2, attempt - 1));
        }
      }
    }
    throw lastError;
  }
  isNonRetryableError(error) {
    const nonRetryableMessages = [
      "syntax error",
      "permission denied",
      "access denied",
      "authentication failed",
      "invalid query"
    ];
    const errorMessage = error?.message?.toLowerCase() || "";
    return nonRetryableMessages.some((msg) => errorMessage.includes(msg));
  }
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  buildQueryFromRequest(request) {
    if (request.sql) {
      return request.sql;
    }
    let query = this.buildSelect(request);
    query += this.buildFrom(request);
    query += this.buildJoins(request);
    query += this.buildWhere(request);
    query += this.buildGroupBy(request);
    query += this.buildHaving(request);
    query += this.buildOrderBy(request);
    query += this.buildLimit(request);
    return query;
  }
  buildSelect(request) {
    const columns = request.select?.join(", ") || "*";
    return `SELECT ${columns}`;
  }
  buildFrom(request) {
    if (!request.table) {
      throw new QueryError("Table name is required");
    }
    return ` FROM ${request.table}`;
  }
  buildJoins(request) {
    if (!request.joins || request.joins.length === 0) {
      return "";
    }
    return request.joins.map((join) => {
      return ` ${join.type} JOIN ${join.table} ON ${join.on.leftField} ${join.on.operator} ${join.on.rightField}`;
    }).join("");
  }
  buildWhere(request) {
    if (!request.where || request.where.length === 0) {
      return "";
    }
    const conditions = this.buildConditions(request.where);
    return ` WHERE ${conditions}`;
  }
  buildConditions(clauses) {
    return clauses.map((clause) => {
      if (clause.and) {
        return `(${this.buildConditions(clause.and).split(" AND ").join(" AND ")})`;
      }
      if (clause.or) {
        return `(${this.buildConditions(clause.or).split(" OR ").join(" OR ")})`;
      }
      const value = this.formatValue(clause.value, clause.operator);
      return `${clause.field} ${clause.operator} ${value}`;
    }).join(" AND ");
  }
  formatValue(value, operator) {
    if (operator === "IS NULL" || operator === "IS NOT NULL") {
      return "";
    }
    if (operator === "IN" || operator === "NOT IN") {
      if (Array.isArray(value)) {
        return `(${value.map((v) => this.escapeValue(v)).join(", ")})`;
      }
      return `(${this.escapeValue(value)})`;
    }
    if (operator === "BETWEEN" || operator === "NOT BETWEEN") {
      if (Array.isArray(value) && value.length === 2) {
        return `${this.escapeValue(value[0])} AND ${this.escapeValue(value[1])}`;
      }
      throw new QueryError("BETWEEN operator requires array with 2 values");
    }
    return this.escapeValue(value);
  }
  escapeValue(value) {
    if (value === null || value === void 0) {
      return "NULL";
    }
    if (typeof value === "string") {
      return `'${value.replace(/'/g, "''")}'`;
    }
    if (typeof value === "boolean") {
      return value ? "TRUE" : "FALSE";
    }
    if (value instanceof Date) {
      return `'${value.toISOString()}'`;
    }
    return String(value);
  }
  buildGroupBy(request) {
    if (!request.groupBy || request.groupBy.length === 0) {
      return "";
    }
    return ` GROUP BY ${request.groupBy.join(", ")}`;
  }
  buildHaving(request) {
    if (!request.having || request.having.length === 0) {
      return "";
    }
    const conditions = this.buildConditions(request.having);
    return ` HAVING ${conditions}`;
  }
  buildOrderBy(request) {
    if (!request.orderBy || request.orderBy.length === 0) {
      return "";
    }
    const orderClauses = request.orderBy.map(
      (order) => `${order.column} ${order.direction}`
    ).join(", ");
    return ` ORDER BY ${orderClauses}`;
  }
  buildLimit(request) {
    if (!request.limit) {
      return "";
    }
    let limitClause = ` LIMIT ${request.limit}`;
    if (request.offset) {
      limitClause += ` OFFSET ${request.offset}`;
    }
    return limitClause;
  }
  // Helper to map native database types to common DataType enum
  mapNativeTypeToDataType(nativeType) {
    const typeMap = {
      // String types
      "varchar": "string" /* String */,
      "char": "string" /* String */,
      "text": "string" /* String */,
      "nvarchar": "string" /* String */,
      "nchar": "string" /* String */,
      "string": "string" /* String */,
      // Number types
      "int": "number" /* Number */,
      "integer": "number" /* Number */,
      "bigint": "number" /* Number */,
      "smallint": "number" /* Number */,
      "tinyint": "number" /* Number */,
      "decimal": "number" /* Number */,
      "numeric": "number" /* Number */,
      "float": "number" /* Number */,
      "double": "number" /* Number */,
      "real": "number" /* Number */,
      "number": "number" /* Number */,
      // Boolean types
      "boolean": "boolean" /* Boolean */,
      "bool": "boolean" /* Boolean */,
      "bit": "boolean" /* Boolean */,
      // Date/Time types
      "date": "date" /* Date */,
      "datetime": "datetime" /* DateTime */,
      "timestamp": "datetime" /* DateTime */,
      "time": "time" /* Time */,
      // JSON types
      "json": "json" /* JSON */,
      "jsonb": "json" /* JSON */,
      // Binary types
      "binary": "binary" /* Binary */,
      "varbinary": "binary" /* Binary */,
      "blob": "binary" /* Binary */,
      "bytea": "binary" /* Binary */
    };
    const normalizedType = nativeType.toLowerCase();
    if (typeMap[normalizedType]) {
      return typeMap[normalizedType];
    }
    for (const [pattern, dataType] of Object.entries(typeMap)) {
      if (normalizedType.includes(pattern)) {
        return dataType;
      }
    }
    return "unknown" /* Unknown */;
  }
  // Helper to extract field info from result metadata
  extractFieldInfo(fields) {
    return fields.map((field) => ({
      name: field.name || field.column_name || "unknown",
      type: this.mapNativeTypeToDataType(field.type || field.data_type || ""),
      nullable: field.nullable ?? true,
      maxLength: field.max_length || field.character_maximum_length,
      precision: field.precision || field.numeric_precision,
      scale: field.scale || field.numeric_scale
    }));
  }
  // Helper to format query result consistently
  formatQueryResult(rows, fields, executionTime) {
    return {
      rows,
      rowCount: rows.length,
      fields: this.extractFieldInfo(fields),
      executionTime
    };
  }
};

// server/datasources/connectors/MemoryConnector.ts
import alasql from "alasql";
var MemoryConnector = class extends BaseConnector {
  transactions = [];
  consumers = [];
  brands = [];
  locations = [];
  categories = [];
  async connect() {
    try {
      this.initializeSampleData();
      this.connected = true;
      this.connectionStartTime = /* @__PURE__ */ new Date();
    } catch (error) {
      throw new Error(`Failed to connect to memory storage: ${error.message}`);
    }
  }
  initializeSampleData() {
    const brandData = [
      // TBWA Clients
      { brand: "Del Monte Tomato Sauce & Ketchup", category: "Sauce", baseValue: 24e5, isTBWA: true },
      { brand: "Del Monte Spaghetti Sauce", category: "Sauce", baseValue: 195e4, isTBWA: true },
      { brand: "Del Monte Fruit Cocktail", category: "Canned Goods", baseValue: 16e5, isTBWA: true },
      { brand: "Alaska Evaporated Milk", category: "Dairy", baseValue: 19e5, isTBWA: true },
      { brand: "Oishi Prawn Crackers", category: "Snacks", baseValue: 12e5, isTBWA: true },
      { brand: "Champion Detergent", category: "Home Care", baseValue: 13e5, isTBWA: true },
      { brand: "Winston", category: "Tobacco", baseValue: 24e5, isTBWA: true },
      // Competitors
      { brand: "UFC Tomato Sauce", category: "Sauce", baseValue: 4e5, isTBWA: false },
      { brand: "Bear Brand Milk", category: "Dairy", baseValue: 3e5, isTBWA: false },
      { brand: "Piattos", category: "Snacks", baseValue: 25e4, isTBWA: false }
    ];
    const locations = ["Manila", "Cebu", "Davao", "Iloilo", "Cagayan de Oro"];
    const barangays = ["Makati", "BGC", "Ortigas", "Alabang", "IT Park"];
    let transactionId = 1;
    for (let i = 0; i < 500; i++) {
      const brand = brandData[Math.floor(Math.random() * brandData.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const barangay = barangays[Math.floor(Math.random() * barangays.length)];
      const date = /* @__PURE__ */ new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      const variance = 0.3 + Math.random() * 0.4;
      const pesoValue = Math.floor(brand.baseValue * variance);
      this.transactions.push({
        id: transactionId++,
        date: date.toISOString().split("T")[0],
        volume: Math.floor(1e3 + Math.random() * 2e3),
        pesoValue: pesoValue.toString(),
        duration: Math.floor(15 + Math.random() * 40),
        units: Math.floor(200 + Math.random() * 600),
        brand: brand.brand,
        category: brand.category,
        location,
        barangay
      });
    }
    const genders = ["Male", "Female"];
    for (let i = 1; i <= 50; i++) {
      this.consumers.push({
        id: i,
        gender: genders[Math.floor(Math.random() * genders.length)],
        age: 18 + Math.floor(Math.random() * 50),
        location: locations[Math.floor(Math.random() * locations.length)]
      });
    }
    const brandMap = /* @__PURE__ */ new Map();
    this.transactions.forEach((t) => {
      const existing = brandMap.get(t.brand) || {
        brand: t.brand,
        value: 0,
        transactions: 0,
        isTBWAClient: brandData.find((b) => b.brand === t.brand)?.isTBWA || false
      };
      existing.value += parseFloat(t.pesoValue);
      existing.transactions += 1;
      brandMap.set(t.brand, existing);
    });
    this.brands = Array.from(brandMap.values()).map((b) => ({
      ...b,
      averageTransaction: b.value / b.transactions,
      growth: (Math.random() - 0.5) * 20,
      // Random growth -10% to +10%
      marketShare: 0
      // Will be calculated
    }));
    const totalValue = this.brands.reduce((sum, b) => sum + b.value, 0);
    this.brands.forEach((b) => {
      b.marketShare = b.value / totalValue * 100;
    });
    const locationMap = /* @__PURE__ */ new Map();
    this.transactions.forEach((t) => {
      const existing = locationMap.get(t.location) || {
        location: t.location,
        transactions: 0,
        value: 0
      };
      existing.value += parseFloat(t.pesoValue);
      existing.transactions += 1;
      locationMap.set(t.location, existing);
    });
    this.locations = Array.from(locationMap.values()).map((l) => ({
      ...l,
      averageTransaction: l.value / l.transactions,
      topBrand: this.brands[0]?.brand
      // Simplified
    }));
    const categoryMap = /* @__PURE__ */ new Map();
    this.transactions.forEach((t) => {
      const existing = categoryMap.get(t.category) || {
        category: t.category,
        value: 0,
        transactions: 0
      };
      existing.value += parseFloat(t.pesoValue);
      existing.transactions += 1;
      categoryMap.set(t.category, existing);
    });
    this.categories = Array.from(categoryMap.values()).map((c) => ({
      ...c,
      topBrand: this.brands.find((b) => b.category === c.category)?.brand,
      growth: (Math.random() - 0.5) * 15
    }));
  }
  async disconnect() {
    this.transactions = [];
    this.consumers = [];
    this.brands = [];
    this.locations = [];
    this.categories = [];
    this.connected = false;
  }
  async query(request) {
    this.validateConnection();
    const startTime = Date.now();
    try {
      let result;
      if (request.sql) {
        result = await this.executeSql(request.sql, request.parameters);
      } else if (request.table) {
        result = await this.executeTableQuery(request);
      } else {
        throw new QueryError("Either sql or table must be provided");
      }
      const executionTime = Date.now() - startTime;
      return {
        rows: result.rows || result,
        rowCount: result.length || result.rows?.length || 0,
        fields: this.inferFields(result.rows || result),
        executionTime
      };
    } catch (error) {
      throw new QueryError(
        `Query execution failed: ${error.message}`,
        request.sql || this.buildQueryFromRequest(request)
      );
    }
  }
  async executeSql(sql, parameters) {
    alasql.tables.transactions = { data: this.transactions };
    alasql.tables.consumers = { data: this.consumers };
    alasql.tables.brands = { data: this.brands };
    alasql.tables.locations = { data: this.locations };
    alasql.tables.categories = { data: this.categories };
    try {
      const result = alasql(sql, parameters);
      return result;
    } catch (error) {
      throw new QueryError(`SQL execution error: ${error.message}`, sql);
    }
  }
  async executeTableQuery(request) {
    const table = request.table.toLowerCase();
    let data;
    switch (table) {
      case "transactions":
        data = this.transactions;
        break;
      case "consumers":
        data = this.consumers;
        break;
      case "brands":
        data = this.brands;
        break;
      case "locations":
        data = this.locations;
        break;
      case "categories":
        data = this.categories;
        break;
      default:
        throw new QueryError(`Unknown table: ${table}`);
    }
    if (request.where && request.where.length > 0) {
      data = this.applyFilters(data, request.where);
    }
    if (request.groupBy && request.groupBy.length > 0) {
      data = this.applyGrouping(data, request);
    }
    if (request.orderBy && request.orderBy.length > 0) {
      data = this.applyOrdering(data, request.orderBy);
    }
    if (request.limit || request.offset) {
      const offset = request.offset || 0;
      const limit = request.limit || data.length;
      data = data.slice(offset, offset + limit);
    }
    if (request.select && request.select.length > 0) {
      data = this.selectColumns(data, request.select);
    }
    return data;
  }
  applyFilters(data, where) {
    return data.filter((row) => {
      return where.every((clause) => this.evaluateWhereClause(row, clause));
    });
  }
  evaluateWhereClause(row, clause) {
    if (clause.and) {
      return clause.and.every((c) => this.evaluateWhereClause(row, c));
    }
    if (clause.or) {
      return clause.or.some((c) => this.evaluateWhereClause(row, c));
    }
    const fieldValue = row[clause.field];
    const compareValue = clause.value;
    switch (clause.operator) {
      case "=":
        return fieldValue == compareValue;
      case "!=":
        return fieldValue != compareValue;
      case "<":
        return fieldValue < compareValue;
      case "<=":
        return fieldValue <= compareValue;
      case ">":
        return fieldValue > compareValue;
      case ">=":
        return fieldValue >= compareValue;
      case "LIKE":
        return String(fieldValue).toLowerCase().includes(String(compareValue).toLowerCase());
      case "NOT LIKE":
        return !String(fieldValue).toLowerCase().includes(String(compareValue).toLowerCase());
      case "IN":
        return Array.isArray(compareValue) ? compareValue.includes(fieldValue) : fieldValue == compareValue;
      case "NOT IN":
        return Array.isArray(compareValue) ? !compareValue.includes(fieldValue) : fieldValue != compareValue;
      case "IS NULL":
        return fieldValue == null;
      case "IS NOT NULL":
        return fieldValue != null;
      case "BETWEEN":
        return fieldValue >= compareValue[0] && fieldValue <= compareValue[1];
      case "NOT BETWEEN":
        return fieldValue < compareValue[0] || fieldValue > compareValue[1];
      default:
        throw new QueryError(`Unknown operator: ${clause.operator}`);
    }
  }
  applyGrouping(data, request) {
    const sql = this.buildQueryFromRequest(request);
    return alasql(sql, [data]);
  }
  applyOrdering(data, orderBy) {
    return data.sort((a, b) => {
      for (const order of orderBy) {
        const aVal = a[order.column];
        const bVal = b[order.column];
        if (aVal < bVal) return order.direction === "ASC" ? -1 : 1;
        if (aVal > bVal) return order.direction === "ASC" ? 1 : -1;
      }
      return 0;
    });
  }
  selectColumns(data, columns) {
    return data.map((row) => {
      const newRow = {};
      columns.forEach((col) => {
        if (col.includes(" as ")) {
          const [expr, alias] = col.split(" as ");
          newRow[alias.trim()] = row[expr.trim()];
        } else {
          newRow[col] = row[col];
        }
      });
      return newRow;
    });
  }
  inferFields(data) {
    if (!data || data.length === 0) return [];
    const firstRow = data[0];
    return Object.keys(firstRow).map((key) => ({
      name: key,
      type: this.inferType(firstRow[key]),
      nullable: data.some((row) => row[key] == null)
    }));
  }
  inferType(value) {
    if (value == null) return "unknown" /* Unknown */;
    if (typeof value === "string") return "string" /* String */;
    if (typeof value === "number") return "number" /* Number */;
    if (typeof value === "boolean") return "boolean" /* Boolean */;
    if (value instanceof Date) return "datetime" /* DateTime */;
    if (typeof value === "object") return "json" /* JSON */;
    return "unknown" /* Unknown */;
  }
  async getSchema() {
    this.validateConnection();
    return {
      name: "memory",
      tables: await this.getTables(),
      relationships: [
        {
          name: "transaction_brand",
          fromTable: "transactions",
          fromColumn: "brand",
          toTable: "brands",
          toColumn: "brand",
          type: "many-to-one"
        },
        {
          name: "transaction_location",
          fromTable: "transactions",
          fromColumn: "location",
          toTable: "locations",
          toColumn: "location",
          type: "many-to-one"
        }
      ]
    };
  }
  async getTables() {
    this.validateConnection();
    return [
      {
        name: "transactions",
        columns: this.getTransactionColumns(),
        rowCount: this.transactions.length
      },
      {
        name: "consumers",
        columns: this.getConsumerColumns(),
        rowCount: this.consumers.length
      },
      {
        name: "brands",
        columns: this.getBrandColumns(),
        rowCount: this.brands.length
      },
      {
        name: "locations",
        columns: this.getLocationColumns(),
        rowCount: this.locations.length
      },
      {
        name: "categories",
        columns: this.getCategoryColumns(),
        rowCount: this.categories.length
      }
    ];
  }
  async getTableSchema(tableName) {
    const tables = await this.getTables();
    const table = tables.find((t) => t.name === tableName.toLowerCase());
    if (!table) {
      throw new Error(`Table '${tableName}' not found`);
    }
    return table;
  }
  getTransactionColumns() {
    return [
      { name: "id", type: "number" /* Number */, nativeType: "integer", nullable: false, primaryKey: true },
      { name: "date", type: "date" /* Date */, nativeType: "date", nullable: false },
      { name: "volume", type: "number" /* Number */, nativeType: "integer", nullable: false },
      { name: "pesoValue", type: "string" /* String */, nativeType: "varchar", nullable: false },
      { name: "duration", type: "number" /* Number */, nativeType: "integer", nullable: false },
      { name: "units", type: "number" /* Number */, nativeType: "integer", nullable: false },
      { name: "brand", type: "string" /* String */, nativeType: "varchar", nullable: false },
      { name: "category", type: "string" /* String */, nativeType: "varchar", nullable: false },
      { name: "location", type: "string" /* String */, nativeType: "varchar", nullable: false },
      { name: "barangay", type: "string" /* String */, nativeType: "varchar", nullable: false }
    ];
  }
  getConsumerColumns() {
    return [
      { name: "id", type: "number" /* Number */, nativeType: "integer", nullable: false, primaryKey: true },
      { name: "gender", type: "string" /* String */, nativeType: "varchar", nullable: false },
      { name: "age", type: "number" /* Number */, nativeType: "integer", nullable: false },
      { name: "location", type: "string" /* String */, nativeType: "varchar", nullable: false }
    ];
  }
  getBrandColumns() {
    return [
      { name: "brand", type: "string" /* String */, nativeType: "varchar", nullable: false, primaryKey: true },
      { name: "value", type: "number" /* Number */, nativeType: "decimal", nullable: false },
      { name: "transactions", type: "number" /* Number */, nativeType: "integer", nullable: false },
      { name: "averageTransaction", type: "number" /* Number */, nativeType: "decimal", nullable: false },
      { name: "growth", type: "number" /* Number */, nativeType: "decimal", nullable: true },
      { name: "marketShare", type: "number" /* Number */, nativeType: "decimal", nullable: true },
      { name: "isTBWAClient", type: "boolean" /* Boolean */, nativeType: "boolean", nullable: false }
    ];
  }
  getLocationColumns() {
    return [
      { name: "location", type: "string" /* String */, nativeType: "varchar", nullable: false, primaryKey: true },
      { name: "transactions", type: "number" /* Number */, nativeType: "integer", nullable: false },
      { name: "value", type: "number" /* Number */, nativeType: "decimal", nullable: false },
      { name: "averageTransaction", type: "number" /* Number */, nativeType: "decimal", nullable: false },
      { name: "topBrand", type: "string" /* String */, nativeType: "varchar", nullable: true }
    ];
  }
  getCategoryColumns() {
    return [
      { name: "category", type: "string" /* String */, nativeType: "varchar", nullable: false, primaryKey: true },
      { name: "value", type: "number" /* Number */, nativeType: "decimal", nullable: false },
      { name: "transactions", type: "number" /* Number */, nativeType: "integer", nullable: false },
      { name: "topBrand", type: "string" /* String */, nativeType: "varchar", nullable: true },
      { name: "growth", type: "number" /* Number */, nativeType: "decimal", nullable: true }
    ];
  }
  getCapabilities() {
    return {
      supportsStreaming: true,
      supportsTransactions: false,
      supportsBatchOperations: true,
      supportsSchemaDiscovery: true,
      supportsStoredProcedures: false,
      supportsViews: false,
      maxQuerySize: 1e6,
      // 1MB
      maxResultSize: 1e7
      // 10MB
    };
  }
  getMetadata() {
    return {
      name: "memory",
      displayName: "In-Memory Storage",
      description: "Fast in-memory storage for development and testing",
      version: "1.0.0",
      author: "System",
      icon: "database",
      configSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Unique identifier for this data source"
          },
          name: {
            type: "string",
            description: "Display name for this data source"
          }
        },
        required: ["id", "name"]
      }
    };
  }
  // Override streaming for better performance
  async *queryStream(request) {
    this.validateConnection();
    const result = await this.query(request);
    const chunkSize = 100;
    for (let i = 0; i < result.rows.length; i += chunkSize) {
      const chunk = result.rows.slice(i, i + chunkSize);
      for (const row of chunk) {
        yield row;
      }
    }
  }
};

// server/datasources/connectors/CSVConnector.ts
import path from "path";
import { createReadStream } from "fs";
import { parse } from "csv-parse";
import alasql2 from "alasql";
var CSVConnector = class extends BaseConnector {
  data = /* @__PURE__ */ new Map();
  schemas = /* @__PURE__ */ new Map();
  filePaths = /* @__PURE__ */ new Map();
  async connect(config) {
    this.config = config;
    this.connected = true;
    this.connectionStartTime = /* @__PURE__ */ new Date();
    if (config.filePath) {
      const tableName = path.basename(config.filePath, ".csv");
      await this.loadCSVFile(config.filePath, tableName);
    }
  }
  async disconnect() {
    this.data.clear();
    this.schemas.clear();
    this.filePaths.clear();
    this.connected = false;
  }
  async loadCSVFile(filePath, tableName) {
    const records = [];
    return new Promise((resolve, reject) => {
      const parser = parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
        cast: true,
        cast_date: true,
        relax_quotes: true,
        relax_column_count: true
      });
      const stream = createReadStream(filePath);
      stream.pipe(parser).on("data", (data) => {
        records.push(data);
      }).on("end", () => {
        this.data.set(tableName, records);
        this.filePaths.set(tableName, filePath);
        const schema = this.generateSchemaFromData(tableName, records);
        this.schemas.set(tableName, schema);
        resolve();
      }).on("error", (error) => {
        reject(new Error(`Failed to parse CSV file: ${error.message}`));
      });
    });
  }
  generateSchemaFromData(tableName, data) {
    if (!data.length) {
      return {
        name: tableName,
        columns: [],
        rowCount: 0
      };
    }
    const sampleSize = Math.min(data.length, 100);
    const sample = data.slice(0, sampleSize);
    const columns = Object.keys(data[0]).map((columnName) => {
      const values = sample.map((row) => row[columnName]).filter((v) => v != null);
      return {
        name: columnName,
        type: this.inferDataType(values),
        nativeType: "text",
        nullable: values.length < sample.length,
        primaryKey: false
      };
    });
    return {
      name: tableName,
      columns,
      rowCount: data.length
    };
  }
  inferDataType(values) {
    if (!values.length) return "string" /* String */;
    const types = new Set(values.map((v) => {
      if (v instanceof Date) return "datetime" /* DateTime */;
      if (typeof v === "number") {
        return "number" /* Number */;
      }
      if (typeof v === "boolean") return "boolean" /* Boolean */;
      return "string" /* String */;
    }));
    if (types.size > 1) return "string" /* String */;
    const type = Array.from(types)[0];
    return type;
  }
  async query(request) {
    this.validateConnection();
    const startTime = Date.now();
    try {
      let result;
      if (request.sql) {
        for (const [tableName, tableData] of this.data.entries()) {
          alasql2.tables[tableName] = { data: [...tableData] };
        }
        result = alasql2(request.sql);
      } else if (request.table) {
        const tableData = this.data.get(request.table);
        if (!tableData) {
          throw new QueryError(`Table '${request.table}' not found`);
        }
        const sql = this.buildQueryFromRequest(request);
        alasql2.tables[request.table] = { data: [...tableData] };
        result = alasql2(sql);
      } else {
        throw new QueryError("Either sql or table must be specified in query request");
      }
      if (request.limit && !request.sql?.toLowerCase().includes("limit")) {
        result = result.slice(0, request.limit);
      }
      const executionTime = Date.now() - startTime;
      return {
        rows: result,
        rowCount: result.length,
        fields: this.extractFieldInfo(result),
        executionTime
      };
    } catch (error) {
      throw new QueryError(
        `CSV query failed: ${error.message}`,
        request.sql || this.buildQueryFromRequest(request)
      );
    }
  }
  async getSchema() {
    this.validateConnection();
    return {
      name: "csv",
      tables: Array.from(this.schemas.values()),
      relationships: []
    };
  }
  async getTables() {
    this.validateConnection();
    return Array.from(this.schemas.values());
  }
  async getTableSchema(tableName) {
    this.validateConnection();
    const schema = this.schemas.get(tableName);
    if (!schema) {
      throw new Error(`Table '${tableName}' not found`);
    }
    return schema;
  }
  getCapabilities() {
    return {
      supportsStreaming: true,
      supportsTransactions: false,
      supportsBatchOperations: false,
      supportsSchemaDiscovery: true,
      supportsStoredProcedures: false,
      supportsViews: false,
      maxQuerySize: 1e6,
      // 1MB
      maxResultSize: 5e7
      // 50MB
    };
  }
  getMetadata() {
    return {
      name: "csv",
      displayName: "CSV File Connector",
      description: "Load and query CSV files with SQL",
      version: "1.0.0",
      author: "System",
      icon: "file-text",
      configSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Unique identifier for this data source"
          },
          name: {
            type: "string",
            description: "Display name for this data source"
          },
          filePath: {
            type: "string",
            description: "Path to CSV file (optional, can add files later)"
          }
        },
        required: ["id", "name"]
      }
    };
  }
  // Additional methods for CSV management
  async addCSVFile(filePath, tableName) {
    const name = tableName || path.basename(filePath, ".csv");
    await this.loadCSVFile(filePath, name);
  }
  async removeTable(tableName) {
    this.data.delete(tableName);
    this.schemas.delete(tableName);
    this.filePaths.delete(tableName);
  }
  async refreshTable(tableName) {
    const filePath = this.filePaths.get(tableName);
    if (!filePath) {
      throw new Error(`No file path found for table '${tableName}'`);
    }
    await this.loadCSVFile(filePath, tableName);
  }
  getTableData(tableName) {
    return this.data.get(tableName);
  }
  // Override streaming for CSV files
  async *queryStream(request) {
    this.validateConnection();
    if (request.table && this.data.has(request.table)) {
      const tableData = this.data.get(request.table);
      const chunkSize = 1e3;
      for (let i = 0; i < tableData.length; i += chunkSize) {
        const chunk = tableData.slice(i, i + chunkSize);
        for (const row of chunk) {
          yield row;
        }
      }
    } else {
      yield* super.queryStream(request);
    }
  }
};

// server/datasources/connectors/RestAPIConnector.ts
import axios from "axios";
import alasql3 from "alasql";
import { RateLimiter } from "limiter";
var RestAPIConnector = class extends BaseConnector {
  client;
  limiter;
  endpoints = /* @__PURE__ */ new Map();
  cache = /* @__PURE__ */ new Map();
  cacheTimeout = 5 * 60 * 1e3;
  // 5 minutes
  async connect(config) {
    this.config = config;
    const axiosConfig = {
      baseURL: config.baseUrl,
      headers: config.headers || {},
      timeout: config.timeout || 3e4
    };
    if (config.auth) {
      switch (config.auth.type) {
        case "basic":
          axiosConfig.auth = {
            username: config.auth.credentials?.username || "",
            password: config.auth.credentials?.password || ""
          };
          break;
        case "bearer":
          axiosConfig.headers.Authorization = `Bearer ${config.auth.credentials?.token}`;
          break;
        case "apiKey":
          const header = config.auth.credentials?.apiKeyHeader || "X-API-Key";
          axiosConfig.headers[header] = config.auth.credentials?.apiKey || "";
          break;
        case "oauth2":
          axiosConfig.headers.Authorization = `Bearer ${config.auth.credentials?.token}`;
          break;
      }
    }
    this.client = axios.create(axiosConfig);
    if (config.rateLimit) {
      this.limiter = new RateLimiter({
        tokensPerInterval: config.rateLimit.requests,
        interval: config.rateLimit.interval
      });
    }
    this.loadAPITemplate(config);
    this.connected = true;
  }
  async disconnect() {
    this.cache.clear();
    this.endpoints.clear();
    this.connected = false;
  }
  async query(request) {
    const startTime = Date.now();
    if (request.sql) {
      return this.executeSQLQuery(request.sql);
    }
    const endpoint = this.endpoints.get(request.table || "");
    if (!endpoint) {
      throw new Error(`No endpoint configured for table: ${request.table}`);
    }
    const data = await this.fetchEndpointData(endpoint);
    let result = data;
    if (request.where && request.where.length > 0) {
      result = this.applyWhereFilters(result, request.where);
    }
    if (request.limit) {
      result = result.slice(0, request.limit);
    }
    return {
      rows: result,
      rowCount: result.length,
      fields: this.getFieldsFromData(result),
      executionTime: Date.now() - startTime
    };
  }
  async getSchema() {
    const tables = [];
    for (const [name, endpoint] of Array.from(this.endpoints)) {
      if (endpoint.schema) {
        tables.push(endpoint.schema);
      } else {
        try {
          const sample = await this.fetchEndpointData(endpoint, { limit: 5 });
          const schema = this.discoverSchema(name, sample);
          endpoint.schema = schema;
          tables.push(schema);
        } catch (error) {
          console.error(`Failed to discover schema for ${name}:`, error);
        }
      }
    }
    return {
      name: "rest-api",
      tables,
      relationships: []
    };
  }
  async testConnection() {
    try {
      const testEndpoint = this.endpoints.values().next().value;
      if (testEndpoint) {
        await this.fetchEndpointData(testEndpoint, { limit: 1 });
      } else {
        await this.client.get("/");
      }
      return {
        success: true,
        message: "Connection successful"
      };
    } catch (error) {
      console.error("Connection test failed:", error);
      return {
        success: false,
        message: `Connection failed: ${error instanceof Error ? error.message : String(error)}`,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  }
  async getTables() {
    const schema = await this.getSchema();
    return schema.tables;
  }
  async getTableSchema(tableName) {
    const endpoint = this.endpoints.get(tableName);
    if (!endpoint) {
      throw new Error(`No endpoint configured for table: ${tableName}`);
    }
    if (endpoint.schema) {
      return endpoint.schema;
    }
    const sample = await this.fetchEndpointData(endpoint, { limit: 5 });
    const schema = this.discoverSchema(tableName, sample);
    endpoint.schema = schema;
    return schema;
  }
  getCapabilities() {
    return {
      supportsStreaming: false,
      supportsTransactions: false,
      supportsBatchOperations: false,
      supportsSchemaDiscovery: true,
      supportsStoredProcedures: false,
      supportsViews: false,
      maxQuerySize: 1e6,
      maxResultSize: 1e7
    };
  }
  getMetadata() {
    return {
      name: "rest-api",
      displayName: "REST API Connector",
      description: "Connect to any REST API and query data with SQL",
      version: "1.0.0",
      author: "System",
      icon: "cloud",
      configSchema: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          baseUrl: { type: "string" }
        },
        required: ["id", "name", "baseUrl"]
      }
    };
  }
  // Add or update an endpoint
  addEndpoint(name, config) {
    this.endpoints.set(name, { ...config, tableName: name });
    this.cache.delete(name);
  }
  // Fetch data from an endpoint with caching and pagination
  async fetchEndpointData(endpoint, options) {
    const cacheKey = JSON.stringify({ endpoint, options });
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    if (this.limiter) {
      await this.limiter.removeTokens(1);
    }
    const config = this.config;
    let allData = [];
    let hasMore = true;
    let cursor = null;
    let page = 1;
    while (hasMore) {
      const params = { ...endpoint.params };
      if (config.pagination) {
        switch (config.pagination.type) {
          case "offset":
            params[config.pagination.limitParam || "limit"] = options?.limit || 100;
            params[config.pagination.offsetParam || "offset"] = allData.length + (options?.offset || 0);
            break;
          case "page":
            params[config.pagination.pageParam || "page"] = page;
            params[config.pagination.limitParam || "per_page"] = options?.limit || 100;
            break;
          case "cursor":
            if (cursor) {
              params[config.pagination.cursorParam || "cursor"] = cursor;
            }
            params[config.pagination.limitParam || "limit"] = options?.limit || 100;
            break;
        }
      }
      const response = await this.client.request({
        method: endpoint.method || "GET",
        url: endpoint.path,
        params,
        data: endpoint.body
      });
      let pageData = response.data;
      if (config.pagination?.dataPath) {
        pageData = this.getNestedValue(pageData, config.pagination.dataPath);
      }
      if (endpoint.transform || config.transform) {
        pageData = this.transformData(pageData, endpoint.transform || config.transform);
      }
      allData = allData.concat(Array.isArray(pageData) ? pageData : [pageData]);
      if (config.pagination) {
        switch (config.pagination.type) {
          case "cursor":
            cursor = this.getNestedValue(response.data, config.pagination.nextLinkPath || "next_cursor");
            hasMore = !!cursor;
            break;
          case "page":
            const total = this.getNestedValue(response.data, config.pagination.totalPath || "total");
            hasMore = page * (options?.limit || 100) < total;
            page++;
            break;
          case "link":
            const nextLink = this.getNestedValue(response.data, config.pagination.nextLinkPath || "next");
            hasMore = !!nextLink;
            if (nextLink) {
              endpoint.path = nextLink;
            }
            break;
          default:
            hasMore = pageData.length === (options?.limit || 100);
        }
      } else {
        hasMore = false;
      }
      if (options?.limit && allData.length >= options.limit) {
        allData = allData.slice(0, options.limit);
        break;
      }
    }
    this.cache.set(cacheKey, { data: allData, timestamp: Date.now() });
    return allData;
  }
  transformData(data, transform) {
    if (!transform) return data;
    let result = data;
    if (transform.jsonPath) {
      result = this.getNestedValue(result, transform.jsonPath);
    }
    if (transform.flatten) {
      result = Array.isArray(result) ? result.map((item) => this.flattenObject(item)) : this.flattenObject(result);
    }
    if (transform.pivot && Array.isArray(result)) {
      const pivoted = [];
      for (const item of result) {
        const arrayData = this.getNestedValue(item, transform.pivot.arrayPath);
        if (Array.isArray(arrayData)) {
          for (const element of arrayData) {
            pivoted.push({
              ...item,
              [transform.pivot.keyPath || "key"]: element[transform.pivot.keyPath || "key"],
              [transform.pivot.valuePath || "value"]: element[transform.pivot.valuePath || "value"]
            });
          }
        }
      }
      result = pivoted;
    }
    return result;
  }
  flattenObject(obj, prefix = "") {
    const flattened = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}_${key}` : key;
        if (obj[key] === null || obj[key] === void 0) {
          flattened[newKey] = obj[key];
        } else if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
          Object.assign(flattened, this.flattenObject(obj[key], newKey));
        } else {
          flattened[newKey] = obj[key];
        }
      }
    }
    return flattened;
  }
  getNestedValue(obj, path5) {
    return path5.split(".").reduce((curr, prop) => curr?.[prop], obj);
  }
  async executeSQLQuery(sql) {
    const tempTables = {};
    for (const [name, endpoint] of Array.from(this.endpoints)) {
      try {
        tempTables[name] = await this.fetchEndpointData(endpoint);
      } catch (error) {
        console.error(`Failed to fetch data for table ${name}:`, error);
      }
    }
    const startTime = Date.now();
    const result = alasql3(sql, tempTables);
    return {
      rows: Array.isArray(result) ? result : [result],
      rowCount: Array.isArray(result) ? result.length : 1,
      fields: this.getFieldsFromData(Array.isArray(result) ? result : [result]),
      executionTime: Date.now() - startTime
    };
  }
  applyWhereFilters(data, whereClause) {
    return data.filter((item) => {
      return whereClause.every((clause) => {
        const fieldValue = item[clause.field];
        switch (clause.operator) {
          case "=":
            return fieldValue === clause.value;
          case "!=":
            return fieldValue !== clause.value;
          case ">":
            return fieldValue > clause.value;
          case ">=":
            return fieldValue >= clause.value;
          case "<":
            return fieldValue < clause.value;
          case "<=":
            return fieldValue <= clause.value;
          case "LIKE":
            return String(fieldValue).includes(String(clause.value));
          default:
            return true;
        }
      });
    });
  }
  getFieldsFromData(data) {
    if (!data || data.length === 0) {
      return [];
    }
    const sample = data[0];
    const fields = [];
    for (const [key, value] of Object.entries(sample)) {
      fields.push({
        name: key,
        type: this.inferDataType(value),
        nullable: true
      });
    }
    return fields;
  }
  discoverSchema(tableName, sampleData) {
    if (!sampleData || sampleData.length === 0) {
      return {
        name: tableName,
        columns: []
      };
    }
    const columns = [];
    const sample = sampleData[0];
    for (const [key, value] of Object.entries(sample)) {
      columns.push({
        name: key,
        type: this.inferDataType(value),
        nativeType: typeof value,
        nullable: true
      });
    }
    return {
      name: tableName,
      columns,
      rowCount: sampleData.length
    };
  }
  inferDataType(value) {
    if (value === null || value === void 0) return "string" /* String */;
    if (typeof value === "number") return "number" /* Number */;
    if (typeof value === "boolean") return "boolean" /* Boolean */;
    if (value instanceof Date) return "datetime" /* DateTime */;
    if (typeof value === "string") {
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return "date" /* Date */;
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) return "datetime" /* DateTime */;
    }
    return "string" /* String */;
  }
  loadAPITemplate(config) {
    if (config.baseUrl.includes("github.com")) {
      this.loadGitHubTemplate();
    } else if (config.baseUrl.includes("stripe.com")) {
      this.loadStripeTemplate();
    } else if (config.baseUrl.includes("shopify.com")) {
      this.loadShopifyTemplate();
    }
  }
  loadGitHubTemplate() {
    this.addEndpoint("repositories", {
      path: "/user/repos",
      tableName: "repositories",
      pagination: {
        type: "page",
        pageParam: "page",
        limitParam: "per_page"
      }
    });
    this.addEndpoint("issues", {
      path: "/issues",
      tableName: "issues",
      pagination: {
        type: "page",
        pageParam: "page",
        limitParam: "per_page"
      }
    });
    this.addEndpoint("pull_requests", {
      path: "/pulls",
      tableName: "pull_requests",
      pagination: {
        type: "page",
        pageParam: "page",
        limitParam: "per_page"
      }
    });
  }
  loadStripeTemplate() {
    this.addEndpoint("customers", {
      path: "/v1/customers",
      tableName: "customers",
      pagination: {
        type: "cursor",
        cursorParam: "starting_after",
        limitParam: "limit",
        dataPath: "data"
      }
    });
    this.addEndpoint("charges", {
      path: "/v1/charges",
      tableName: "charges",
      pagination: {
        type: "cursor",
        cursorParam: "starting_after",
        limitParam: "limit",
        dataPath: "data"
      }
    });
    this.addEndpoint("subscriptions", {
      path: "/v1/subscriptions",
      tableName: "subscriptions",
      pagination: {
        type: "cursor",
        cursorParam: "starting_after",
        limitParam: "limit",
        dataPath: "data"
      }
    });
  }
  loadShopifyTemplate() {
    this.addEndpoint("products", {
      path: "/admin/api/2023-10/products.json",
      tableName: "products",
      pagination: {
        type: "link",
        nextLinkPath: "link",
        dataPath: "products"
      }
    });
    this.addEndpoint("orders", {
      path: "/admin/api/2023-10/orders.json",
      tableName: "orders",
      pagination: {
        type: "link",
        nextLinkPath: "link",
        dataPath: "orders"
      }
    });
    this.addEndpoint("customers", {
      path: "/admin/api/2023-10/customers.json",
      tableName: "customers",
      pagination: {
        type: "link",
        nextLinkPath: "link",
        dataPath: "customers"
      }
    });
  }
};

// server/datasources/core/DataSourceManager.ts
var DataSourceManager = class _DataSourceManager {
  static instance;
  connectors = /* @__PURE__ */ new Map();
  registry = /* @__PURE__ */ new Map();
  defaultConnectorId = "default-memory";
  constructor() {
    this.registerBuiltInConnectors();
  }
  /**
   * Get singleton instance
   */
  static getInstance() {
    if (!_DataSourceManager.instance) {
      _DataSourceManager.instance = new _DataSourceManager();
    }
    return _DataSourceManager.instance;
  }
  /**
   * Initialize the manager with default data source
   */
  async initialize() {
    const memoryConnector = new MemoryConnector({
      id: this.defaultConnectorId,
      name: "Default Memory Storage",
      type: "memory",
      description: "In-memory storage with Philippine brand data"
    });
    await this.addConnector(this.defaultConnectorId, memoryConnector);
  }
  /**
   * Register a new connector type
   */
  registerConnectorType(type, constructor, metadata) {
    this.registry.set(type.toLowerCase(), { constructor, metadata });
  }
  /**
   * Get available connector types
   */
  getAvailableConnectorTypes() {
    return Array.from(this.registry.values()).map((entry) => entry.metadata);
  }
  /**
   * Create a new connector instance
   */
  createConnector(config) {
    const entry = this.registry.get(config.type.toLowerCase());
    if (!entry) {
      throw new ConnectorError(
        `Unknown connector type: ${config.type}`,
        "UNKNOWN_CONNECTOR_TYPE",
        { availableTypes: Array.from(this.registry.keys()) }
      );
    }
    return new entry.constructor(config);
  }
  /**
   * Add a new data source connection
   */
  async addDataSource(config) {
    if (this.connectors.has(config.id)) {
      throw new ConnectorError(
        `Data source with id '${config.id}' already exists`,
        "DUPLICATE_DATASOURCE"
      );
    }
    const connector = this.createConnector(config);
    try {
      await connector.connect(config);
      await this.addConnector(config.id, connector);
    } catch (error) {
      throw new ConnectionError(
        `Failed to connect to data source: ${error.message}`,
        { config, originalError: error }
      );
    }
  }
  /**
   * Add an already connected connector
   */
  async addConnector(id, connector) {
    const testResult = await connector.testConnection();
    if (!testResult.success) {
      throw new ConnectionError(
        testResult.message,
        testResult.details
      );
    }
    this.connectors.set(id, connector);
  }
  /**
   * Remove a data source
   */
  async removeDataSource(id) {
    const connector = this.connectors.get(id);
    if (!connector) {
      throw new ConnectorError(
        `Data source '${id}' not found`,
        "DATASOURCE_NOT_FOUND"
      );
    }
    if (id === this.defaultConnectorId) {
      throw new ConnectorError(
        "Cannot remove the default data source",
        "CANNOT_REMOVE_DEFAULT"
      );
    }
    await connector.disconnect();
    this.connectors.delete(id);
  }
  /**
   * Get a connector by ID
   */
  async getConnector(id) {
    const connectorId = id || this.defaultConnectorId;
    const connector = this.connectors.get(connectorId);
    if (!connector) {
      throw new ConnectorError(
        `Data source '${connectorId}' not found`,
        "DATASOURCE_NOT_FOUND",
        { availableDataSources: Array.from(this.connectors.keys()) }
      );
    }
    if (!connector.isConnected()) {
      throw new ConnectionError(
        `Data source '${connectorId}' is not connected`
      );
    }
    return connector;
  }
  /**
   * Get all active data sources
   */
  getDataSources() {
    const sources = [];
    this.connectors.forEach((connector, id) => {
      const metadata = connector.getMetadata();
      const capabilities = connector.getCapabilities();
      sources.push({
        id,
        name: metadata.name,
        type: metadata.name.toLowerCase(),
        connected: connector.isConnected(),
        capabilities
      });
    });
    return sources;
  }
  /**
   * Test a data source connection
   */
  async testDataSource(id) {
    const connector = await this.getConnector(id);
    return connector.testConnection();
  }
  /**
   * Execute a query on a specific data source
   */
  async query(dataSourceId, request) {
    const connector = await this.getConnector(dataSourceId);
    return connector.query(request);
  }
  /**
   * Get schema for a data source
   */
  async getSchema(dataSourceId) {
    const connector = await this.getConnector(dataSourceId);
    return connector.getSchema();
  }
  /**
   * Get tables for a data source
   */
  async getTables(dataSourceId) {
    const connector = await this.getConnector(dataSourceId);
    return connector.getTables();
  }
  /**
   * Get table schema for a specific table
   */
  async getTableSchema(dataSourceId, tableName) {
    const connector = await this.getConnector(dataSourceId);
    return connector.getTableSchema(tableName);
  }
  /**
   * Set the default data source
   */
  setDefaultDataSource(id) {
    if (!this.connectors.has(id)) {
      throw new ConnectorError(
        `Data source '${id}' not found`,
        "DATASOURCE_NOT_FOUND"
      );
    }
    this.defaultConnectorId = id;
  }
  /**
   * Get the default data source ID
   */
  getDefaultDataSourceId() {
    return this.defaultConnectorId;
  }
  /**
   * Cleanup all connections
   */
  async shutdown() {
    const disconnectPromises = [];
    this.connectors.forEach((connector) => {
      if (connector.isConnected()) {
        disconnectPromises.push(connector.disconnect());
      }
    });
    await Promise.all(disconnectPromises);
    this.connectors.clear();
  }
  /**
   * Register built-in connector types
   */
  registerBuiltInConnectors() {
    this.registerConnectorType("memory", MemoryConnector, {
      name: "memory",
      displayName: "In-Memory Storage",
      description: "Store data in application memory",
      version: "1.0.0",
      author: "System",
      icon: "database",
      configSchema: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" }
        },
        required: ["id", "name"]
      }
    });
    this.registerConnectorType("csv", CSVConnector, {
      name: "csv",
      displayName: "CSV File Connector",
      description: "Load and query CSV files with SQL",
      version: "1.0.0",
      author: "System",
      icon: "file-text",
      configSchema: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          filePath: { type: "string", description: "Optional initial CSV file path" }
        },
        required: ["id", "name"]
      }
    });
    this.registerConnectorType("rest-api", RestAPIConnector, {
      name: "rest-api",
      displayName: "REST API Connector",
      description: "Connect to any REST API and query data with SQL",
      version: "1.0.0",
      author: "System",
      icon: "cloud",
      configSchema: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          baseUrl: { type: "string", description: "Base URL of the REST API" },
          auth: {
            type: "object",
            properties: {
              type: { type: "string", enum: ["basic", "bearer", "apiKey", "oauth2"] },
              credentials: { type: "object" }
            }
          },
          headers: { type: "object", description: "Additional headers to send with requests" },
          rateLimit: {
            type: "object",
            properties: {
              requests: { type: "number" },
              interval: { type: "number" }
            }
          }
        },
        required: ["id", "name", "baseUrl"]
      }
    });
  }
};
var dataSourceManager = DataSourceManager.getInstance();

// server/routes/datasources.ts
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path2 from "path";
import { promises as fs } from "fs";
var router = Router();
var UPLOAD_DIR = path2.join(process.cwd(), "uploads", "csv");
fs.mkdir(UPLOAD_DIR, { recursive: true }).catch(console.error);
var storage2 = multer.diskStorage({
  destination: async (req, file, cb) => {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
var upload = multer({
  storage: storage2,
  fileFilter: (req, file, cb) => {
    const ext = path2.extname(file.originalname).toLowerCase();
    if (ext !== ".csv") {
      return cb(new Error("Only CSV files are allowed"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 50 * 1024 * 1024
    // 50MB limit
  }
});
router.get("/datasources", async (req, res) => {
  try {
    const dataSources = dataSourceManager.getDataSources();
    res.json({
      success: true,
      data: dataSources
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
router.get("/datasources/types", async (req, res) => {
  try {
    const types = dataSourceManager.getAvailableConnectorTypes();
    res.json({
      success: true,
      data: types
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
router.post("/datasources", async (req, res) => {
  try {
    const { id, name, type, config } = req.body;
    if (!id || !name || !type) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: id, name, type"
      });
    }
    const fullConfig = {
      id,
      name,
      type,
      description: config?.description,
      ...config
    };
    await dataSourceManager.addDataSource(fullConfig);
    res.json({
      success: true,
      data: { id, name, type }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});
router.post("/datasources/:id/upload", upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    const { tableName } = req.body;
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded"
      });
    }
    const connector = await dataSourceManager.getConnector(id);
    if (!(connector instanceof CSVConnector)) {
      await fs.unlink(req.file.path).catch(() => {
      });
      return res.status(400).json({
        success: false,
        error: "Data source is not a CSV connector"
      });
    }
    const name = tableName || path2.basename(req.file.originalname, ".csv");
    await connector.addCSVFile(req.file.path, name);
    const schema = await connector.getTableSchema(name);
    res.json({
      success: true,
      data: {
        tableName: name,
        filePath: req.file.path,
        rowCount: schema.rowCount || 0,
        columns: schema.columns || []
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});
router.get("/datasources/:id/schema", async (req, res) => {
  try {
    const { id } = req.params;
    const schema = await dataSourceManager.getSchema(id);
    res.json({
      success: true,
      data: schema
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});
router.post("/datasources/:id/query", async (req, res) => {
  try {
    const { id } = req.params;
    const queryRequest = req.body;
    if (!queryRequest.sql && !queryRequest.table) {
      return res.status(400).json({
        success: false,
        error: "Either sql or table must be specified"
      });
    }
    if (queryRequest.sql) {
      const dangerousKeywords = ["DROP", "DELETE", "TRUNCATE", "UPDATE", "INSERT", "ALTER", "CREATE"];
      const upperSQL = queryRequest.sql.toUpperCase();
      for (const keyword of dangerousKeywords) {
        if (upperSQL.includes(keyword)) {
          return res.status(403).json({
            success: false,
            error: `Dangerous SQL keyword detected: ${keyword}`
          });
        }
      }
    }
    const result = await dataSourceManager.query(id, queryRequest);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});
router.get("/datasources/:id/tables", async (req, res) => {
  try {
    const { id } = req.params;
    const tables = await dataSourceManager.getTables(id);
    res.json({
      success: true,
      data: tables.map((table) => ({
        name: table.name,
        rowCount: table.rowCount,
        columnCount: table.columns?.length || 0
      }))
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});
router.get("/datasources/:id/tables/:table", async (req, res) => {
  try {
    const { id, table } = req.params;
    const schema = await dataSourceManager.getTableSchema(id, table);
    res.json({
      success: true,
      data: schema
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});
router.get("/datasources/:id/preview/:table", async (req, res) => {
  try {
    const { id, table } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    const result = await dataSourceManager.query(id, {
      table,
      limit
    });
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});
router.delete("/datasources/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (id === dataSourceManager.getDefaultDataSourceId()) {
      return res.status(403).json({
        success: false,
        error: "Cannot remove the default data source"
      });
    }
    await dataSourceManager.removeDataSource(id);
    res.json({
      success: true,
      message: `Data source '${id}' removed successfully`
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});
router.post("/datasources/:id/test", async (req, res) => {
  try {
    const { id } = req.params;
    const testResult = await dataSourceManager.testDataSource(id);
    res.json({
      success: true,
      data: testResult
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});
router.post("/datasources/:id/refresh", async (req, res) => {
  try {
    const { id } = req.params;
    const { table } = req.body;
    const connector = await dataSourceManager.getConnector(id);
    if (connector instanceof CSVConnector && table) {
      await connector.refreshTable(table);
      res.json({
        success: true,
        message: `Table '${table}' refreshed successfully`
      });
    } else {
      await connector.disconnect();
      await connector.connect(connector.getMetadata());
      res.json({
        success: true,
        message: "Data source refreshed successfully"
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});
router.post("/datasources/:id/validate", async (req, res) => {
  try {
    const { id } = req.params;
    const { sql } = req.body;
    if (!sql) {
      return res.status(400).json({
        success: false,
        error: "SQL query is required"
      });
    }
    try {
      const testQuery = {
        sql: sql + " LIMIT 0",
        // Add LIMIT 0 to prevent data retrieval
        maxRows: 0
      };
      await dataSourceManager.query(id, testQuery);
      res.json({
        success: true,
        valid: true,
        message: "Query is valid"
      });
    } catch (queryError) {
      res.json({
        success: true,
        valid: false,
        error: queryError.message
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});
router.get("/datasources/:id/stream/:table", async (req, res) => {
  try {
    const { id, table } = req.params;
    const limit = parseInt(req.query.limit) || 1e3;
    const connector = await dataSourceManager.getConnector(id);
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    let count = 0;
    const stream = connector.queryStream({ table, limit });
    for await (const row of stream) {
      res.write(`data: ${JSON.stringify(row)}

`);
      count++;
      if (count % 100 === 0) {
        res.flush();
      }
    }
    res.write(`event: complete
data: {"rowCount": ${count}}

`);
    res.end();
  } catch (error) {
    res.write(`event: error
data: ${JSON.stringify({ error: error.message })}

`);
    res.end();
  }
});
router.post("/datasources/:id/endpoints", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, path: path5, method, params, body, tableName, transform, pagination } = req.body;
    if (!name || !path5) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: name, path"
      });
    }
    const connector = await dataSourceManager.getConnector(id);
    if (!(connector instanceof RestAPIConnector)) {
      return res.status(400).json({
        success: false,
        error: "Data source is not a REST API connector"
      });
    }
    connector.addEndpoint(name, {
      path: path5,
      method: method || "GET",
      params,
      body,
      tableName: tableName || name,
      transform,
      pagination
    });
    res.json({
      success: true,
      data: { name, path: path5, method: method || "GET" }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});
router.get("/datasources/:id/endpoints", async (req, res) => {
  try {
    const { id } = req.params;
    const connector = await dataSourceManager.getConnector(id);
    if (!(connector instanceof RestAPIConnector)) {
      return res.status(400).json({
        success: false,
        error: "Data source is not a REST API connector"
      });
    }
    const schema = await connector.getSchema();
    const endpoints = schema.tables.map((table) => ({
      name: table.name,
      rowCount: table.rowCount || 0,
      columnCount: table.columns?.length || 0
    }));
    res.json({
      success: true,
      data: endpoints
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});
router.post("/datasources/:id/test-endpoint", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, path: path5, method, params, body } = req.body;
    if (!path5) {
      return res.status(400).json({
        success: false,
        error: "Missing required field: path"
      });
    }
    const connector = await dataSourceManager.getConnector(id);
    if (!(connector instanceof RestAPIConnector)) {
      return res.status(400).json({
        success: false,
        error: "Data source is not a REST API connector"
      });
    }
    const testName = `test_${Date.now()}`;
    connector.addEndpoint(testName, {
      path: path5,
      method: method || "GET",
      params,
      body,
      tableName: testName
    });
    try {
      const result = await dataSourceManager.query(id, {
        table: testName,
        limit: 5
      });
      res.json({
        success: true,
        data: {
          sampleData: result.data,
          rowCount: result.metadata?.rowCount || 0,
          executionTime: result.metadata?.executionTime || 0
        }
      });
    } catch (testError) {
      res.status(400).json({
        success: false,
        error: `Endpoint test failed: ${testError.message}`
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});
router.get("/datasources/templates", async (req, res) => {
  try {
    const templates = {
      github: {
        name: "GitHub API",
        baseUrl: "https://api.github.com",
        auth: {
          type: "bearer",
          credentials: {
            token: "YOUR_GITHUB_TOKEN"
          }
        },
        endpoints: [
          {
            name: "repositories",
            path: "/user/repos",
            pagination: {
              type: "page",
              pageParam: "page",
              limitParam: "per_page"
            }
          },
          {
            name: "issues",
            path: "/issues",
            pagination: {
              type: "page",
              pageParam: "page",
              limitParam: "per_page"
            }
          }
        ]
      },
      stripe: {
        name: "Stripe API",
        baseUrl: "https://api.stripe.com",
        auth: {
          type: "bearer",
          credentials: {
            token: "YOUR_STRIPE_SECRET_KEY"
          }
        },
        endpoints: [
          {
            name: "customers",
            path: "/v1/customers",
            pagination: {
              type: "cursor",
              cursorParam: "starting_after",
              limitParam: "limit",
              dataPath: "data"
            }
          },
          {
            name: "charges",
            path: "/v1/charges",
            pagination: {
              type: "cursor",
              cursorParam: "starting_after",
              limitParam: "limit",
              dataPath: "data"
            }
          }
        ]
      },
      shopify: {
        name: "Shopify API",
        baseUrl: "https://your-shop.myshopify.com",
        auth: {
          type: "apiKey",
          credentials: {
            apiKey: "YOUR_API_KEY",
            apiKeyHeader: "X-Shopify-Access-Token"
          }
        },
        endpoints: [
          {
            name: "products",
            path: "/admin/api/2023-10/products.json",
            pagination: {
              type: "link",
              nextLinkPath: "link",
              dataPath: "products"
            }
          },
          {
            name: "orders",
            path: "/admin/api/2023-10/orders.json",
            pagination: {
              type: "link",
              nextLinkPath: "link",
              dataPath: "orders"
            }
          }
        ]
      },
      custom: {
        name: "Custom REST API",
        baseUrl: "https://api.example.com",
        auth: {
          type: "bearer",
          credentials: {
            token: "YOUR_API_TOKEN"
          }
        },
        rateLimit: {
          requests: 100,
          interval: 6e4
        },
        pagination: {
          type: "page",
          pageParam: "page",
          limitParam: "limit"
        },
        endpoints: [
          {
            name: "data",
            path: "/api/data",
            method: "GET"
          }
        ]
      }
    };
    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
var datasources_default = router;

// server/routes.ts
async function registerRoutes(app2) {
  app2.use("/api", datasources_default);
  app2.get("/api/health", healthCheck);
  app2.get("/api/dashboard-data", getDashboardData);
  app2.get("/api/dashboard-data/subset", getDashboardDataSubset);
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
      let transactions;
      if (location) {
        transactions = await storage.getTransactionsByLocation(location);
      } else if (brand) {
        transactions = await storage.getTransactionsByBrand(brand);
      } else if (category) {
        transactions = await storage.getTransactionsByCategory(category);
      } else {
        transactions = await storage.getAllTransactions();
      }
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });
  app2.get("/api/consumers", async (req, res) => {
    try {
      const consumers = await storage.getAllConsumers();
      res.json(consumers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch consumers" });
    }
  });
  app2.get("/api/brands/:brandName/performance", async (req, res) => {
    try {
      const { brandName } = req.params;
      const { period = "30d" } = req.query;
      const transactions = await storage.getTransactionsByBrand(brandName);
      const totalValue = transactions.reduce((sum, t) => sum + parseFloat(t.pesoValue), 0);
      const avgTransaction = totalValue / transactions.length || 0;
      const growth = calculateGrowth(transactions, period);
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
  app2.get("/api/locations/:location/analytics", async (req, res) => {
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
  app2.get("/api/consumers/segments", async (req, res) => {
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
  app2.post("/api/dashboard/refresh", async (req, res) => {
    try {
      const refreshedData = {
        kpi: await storage.getKPIMetrics(),
        brands: await storage.getBrandData(),
        trends: await storage.getTrendData(),
        insights: await storage.getAIInsights(),
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      res.json(refreshedData);
    } catch (error) {
      res.status(500).json({ error: "Failed to refresh dashboard data" });
    }
  });
  app2.post("/api/dashboard/filter", async (req, res) => {
    try {
      const { dateRange, location, brand, category } = req.body;
      let transactions = await storage.getAllTransactions();
      if (dateRange) {
        transactions = filterByDateRange(transactions, dateRange);
      }
      if (location && location !== "All Locations") {
        transactions = transactions.filter((t) => t.location === location);
      }
      if (brand && brand !== "All Brands") {
        transactions = transactions.filter((t) => t.brand === brand);
      }
      if (category && category !== "All Categories") {
        transactions = transactions.filter((t) => t.category === category);
      }
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
  app2.get("/api/export/csv", async (req, res) => {
    try {
      const { type = "transactions" } = req.query;
      let data = [];
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
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.send(csv);
    } catch (error) {
      res.status(500).json({ error: "Failed to export data" });
    }
  });
  app2.post("/api/reports/generate", async (req, res) => {
    try {
      const { reportType, filters, format = "json" } = req.body;
      const reportData = {
        title: `${reportType} Report`,
        generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        filters,
        summary: await generateReportSummary(reportType, filters),
        data: await getReportData(reportType, filters)
      };
      if (format === "pdf") {
        res.status(501).json({ error: "PDF generation not yet implemented" });
      } else {
        res.json(reportData);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to generate report" });
    }
  });
  app2.get("/api/compare", async (req, res) => {
    try {
      const { brands, period = "30d" } = req.query;
      const brandList = brands?.split(",") || [];
      const comparisons = await Promise.all(
        brandList.map(async (brand) => {
          const transactions = await storage.getTransactionsByBrand(brand);
          return {
            brand,
            metrics: calculateBrandMetrics(transactions, period)
          };
        })
      );
      res.json({ comparisons, period });
    } catch (error) {
      res.status(500).json({ error: "Failed to compare brands" });
    }
  });
  app2.get("/api/analytics/predict", async (req, res) => {
    try {
      const { brand, metric = "sales" } = req.query;
      const transactions = brand ? await storage.getTransactionsByBrand(brand) : await storage.getAllTransactions();
      const prediction = {
        metric,
        brand: brand || "all",
        currentValue: calculateCurrentValue(transactions, metric),
        predictedValue: calculatePrediction(transactions, metric),
        confidence: 0.75,
        factors: ["Historical trends", "Seasonal patterns", "Market conditions"]
      };
      res.json(prediction);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate predictions" });
    }
  });
  app2.get("/api/alerts", async (req, res) => {
    try {
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
  app2.post("/api/alerts", async (req, res) => {
    try {
      const alert = req.body;
      res.json({ ...alert, id: Date.now().toString() });
    } catch (error) {
      res.status(500).json({ error: "Failed to create alert" });
    }
  });
  app2.get("/api/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.json({ results: [] });
      }
      const query = q.toLowerCase();
      const [brands, locations, categories] = await Promise.all([
        storage.getBrandData(),
        storage.getLocationData(),
        storage.getCategoryData()
      ]);
      const results = {
        brands: brands.filter((b) => b.brand.toLowerCase().includes(query)),
        locations: locations.filter((l) => l.location.toLowerCase().includes(query)),
        categories: categories.filter((c) => c.category.toLowerCase().includes(query))
      };
      res.json({ query: q, results });
    } catch (error) {
      res.status(500).json({ error: "Failed to search" });
    }
  });
  app2.get("/api/preferences", async (req, res) => {
    try {
      const preferences = {
        defaultView: "overview",
        refreshInterval: 3e4,
        chartType: "line",
        colorScheme: "default"
      };
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch preferences" });
    }
  });
  app2.put("/api/preferences", async (req, res) => {
    try {
      const preferences = req.body;
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ error: "Failed to update preferences" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}
function calculateGrowth(transactions, period) {
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const cutoffDate = /* @__PURE__ */ new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const recentTransactions = transactions.filter((t) => new Date(t.date) >= cutoffDate);
  const previousTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return date < cutoffDate && date >= new Date(cutoffDate.getTime() - days * 24 * 60 * 60 * 1e3);
  });
  const recentValue = recentTransactions.reduce((sum, t) => sum + parseFloat(t.pesoValue), 0);
  const previousValue = previousTransactions.reduce((sum, t) => sum + parseFloat(t.pesoValue), 0);
  return previousValue > 0 ? (recentValue - previousValue) / previousValue * 100 : 0;
}
function segmentByAge(consumers) {
  const segments = {
    "18-25": 0,
    "26-35": 0,
    "36-45": 0,
    "46+": 0
  };
  consumers.forEach((c) => {
    if (c.age <= 25) segments["18-25"]++;
    else if (c.age <= 35) segments["26-35"]++;
    else if (c.age <= 45) segments["36-45"]++;
    else segments["46+"]++;
  });
  return segments;
}
function segmentByGender(consumers) {
  return consumers.reduce((acc, c) => {
    acc[c.gender] = (acc[c.gender] || 0) + 1;
    return acc;
  }, {});
}
function segmentByLocation(consumers) {
  return consumers.reduce((acc, c) => {
    acc[c.location] = (acc[c.location] || 0) + 1;
    return acc;
  }, {});
}
function filterByDateRange(transactions, dateRange) {
  const now = /* @__PURE__ */ new Date();
  let startDate = /* @__PURE__ */ new Date();
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
  return transactions.filter((t) => new Date(t.date) >= startDate);
}
function calculateTrends(transactions) {
  const grouped = transactions.reduce((acc, t) => {
    if (!acc[t.date]) {
      acc[t.date] = { transactions: 0, pesoValue: 0 };
    }
    acc[t.date].transactions++;
    acc[t.date].pesoValue += parseFloat(t.pesoValue);
    return acc;
  }, {});
  return Object.entries(grouped).map(([period, data]) => ({ period, ...data })).sort((a, b) => a.period.localeCompare(b.period));
}
function convertToCSV(data) {
  if (data.length === 0) return "";
  const headers = Object.keys(data[0]);
  const rows = data.map(
    (item) => headers.map((header) => JSON.stringify(item[header] || "")).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}
async function generateReportSummary(reportType, filters) {
  return {
    type: reportType,
    generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    filters,
    keyFindings: [
      "Brand performance shows positive trend",
      "Regional markets expanding",
      "Category diversification successful"
    ]
  };
}
async function getReportData(reportType, filters) {
  return {
    type: reportType,
    data: []
  };
}
function calculateBrandMetrics(transactions, period) {
  const totalValue = transactions.reduce((sum, t) => sum + parseFloat(t.pesoValue), 0);
  const avgTransaction = totalValue / transactions.length || 0;
  return {
    totalValue,
    transactionCount: transactions.length,
    averageTransaction: avgTransaction,
    growth: calculateGrowth(transactions, period)
  };
}
function calculateCurrentValue(transactions, metric) {
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
function calculatePrediction(transactions, metric) {
  const currentValue = calculateCurrentValue(transactions, metric);
  const growthRate = 0.05;
  return currentValue * (1 + growthRate);
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path4 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path3 from "path";
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
      "@": path3.resolve(import.meta.dirname, "client", "src"),
      "@shared": path3.resolve(import.meta.dirname, "shared"),
      "@assets": path3.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path3.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path3.resolve(import.meta.dirname, "dist/public"),
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
      const clientTemplate = path4.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
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
  const distPath = path4.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path4.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
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
  await dataSourceManager.initialize();
  log("Data source manager initialized");
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
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
var index_default = app;
export {
  index_default as default
};
