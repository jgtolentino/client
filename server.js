import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || "8080", 10);

// TBWA Dashboard Data
const tbwaData = {
  kpis: {
    totalRevenue: 2500000,
    totalOrders: 150,
    activeBrands: 5,
    growthRate: 98
  },
  transactions: [
    { id: 1, brand: "Alaska Milk", location: "Manila", amount: 1250, date: "2025-05-26", category: "Dairy" },
    { id: 2, brand: "Oishi Ridges", location: "Cebu", amount: 850, date: "2025-05-26", category: "Snacks" },
    { id: 3, brand: "Del Monte", location: "Davao", amount: 2100, date: "2025-05-25", category: "Canned Goods" },
    { id: 4, brand: "Alaska Milk", location: "Quezon City", amount: 1800, date: "2025-05-25", category: "Dairy" },
    { id: 5, brand: "Oishi Prawn Crackers", location: "Manila", amount: 650, date: "2025-05-24", category: "Snacks" },
    { id: 6, brand: "Del Monte Corned Beef", location: "Cebu", amount: 1950, date: "2025-05-24", category: "Canned Goods" },
    { id: 7, brand: "Alaska Condensada", location: "Davao", amount: 1100, date: "2025-05-23", category: "Dairy" },
    { id: 8, brand: "Oishi Potato Chips", location: "Manila", amount: 750, date: "2025-05-23", category: "Snacks" },
    { id: 9, brand: "Del Monte Pineapple", location: "Quezon City", amount: 1400, date: "2025-05-22", category: "Canned Goods" },
    { id: 10, brand: "Alaska Crema", location: "Cebu", amount: 1300, date: "2025-05-22", category: "Dairy" }
  ],
  brandPerformance: [
    { brand: "Alaska", revenue: 5450, orders: 45 },
    { brand: "Oishi", revenue: 2250, orders: 35 },
    { brand: "Del Monte", revenue: 5450, orders: 40 },
    { brand: "Nestle", revenue: 3200, orders: 25 },
    { brand: "Unilever", revenue: 2800, orders: 30 }
  ]
};

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'TBWA Dashboard'
  });
});

// Dashboard data endpoint
app.get('/api/dashboard', (req, res) => {
  res.json(tbwaData);
});

// KPI endpoint
app.get('/api/kpis', (req, res) => {
  res.json(tbwaData.kpis);
});

// Transactions endpoint
app.get('/api/transactions', (req, res) => {
  res.json(tbwaData.transactions);
});

// Brand performance endpoint
app.get('/api/brands', (req, res) => {
  res.json(tbwaData.brandPerformance);
});

// Serve dashboard for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Start server
console.log('🚀 TBWA Dashboard Starting...');
console.log(`📍 Environment: ${process.env.NODE_ENV || 'production'}`);
console.log(`🔌 Port: ${port}`);

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ TBWA Dashboard LIVE on http://0.0.0.0:${port}`);
  console.log(`🏥 Health: http://0.0.0.0:${port}/api/health`);
  console.log(`📊 Dashboard: http://0.0.0.0:${port}`);
});
