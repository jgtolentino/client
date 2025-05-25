// Azure Functions Custom Handler adapter
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Import your Express server
const createServer = require('../dist/index.js');

// Create the Express app
const app = express();

// Mount your Express app
app.use('/', createServer);

// Export for Azure Functions
module.exports = app;