import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.static(join(__dirname, "../dist/public")));

// Health check endpoint - CRITICAL for Azure
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Basic API endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "TBWA Dashboard API is running!" });
});

// Serve the React app for all other routes
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "../dist/public/index.html"));
});

// Azure-compatible port binding
const port = parseInt(process.env.PORT || "8080", 10);

// Enhanced startup logging
console.log("🚀 TBWA Dashboard - Minimal Server Starting...");
console.log(`📍 Environment: ${process.env.NODE_ENV || 'production'}`);
console.log(`🔌 Port: ${port} (from ${process.env.PORT ? 'Azure env' : 'default'})`);
console.log(`📁 Static files: ${join(__dirname, "../dist/public")}`);

app.listen(port, "0.0.0.0", () => {
  console.log(`✅ TBWA Dashboard LIVE on http://0.0.0.0:${port}`);
  console.log(`🏥 Health check: http://0.0.0.0:${port}/api/health`);
  console.log(`🎯 Dashboard: http://0.0.0.0:${port}`);
});

export default app;
