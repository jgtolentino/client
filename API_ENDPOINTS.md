# Brand Performance Dashboard API Documentation

## Overview
The dashboard provides 21 RESTful API endpoints organized into several categories. All endpoints return JSON unless otherwise specified.

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-domain.com/api`

## API Endpoints Summary

### Core Dashboard Endpoints (9 existing)
1. **GET /api/dashboard/kpi** - KPI metrics
2. **GET /api/dashboard/locations** - Location data  
3. **GET /api/dashboard/categories** - Category data
4. **GET /api/dashboard/brands** - Brand data
5. **GET /api/dashboard/trends** - Trend data
6. **GET /api/dashboard/insights** - AI insights
7. **GET /api/transactions** - Transaction data with filters
8. **GET /api/consumers** - Consumer data
9. **GET /api/health** - Health check

### Brand Analytics (1 new)
10. **GET /api/brands/:brandName/performance** - Detailed brand performance metrics

### Location Analytics (1 new)
11. **GET /api/locations/:location/analytics** - Location-specific analytics

### Consumer Analytics (1 new)
12. **GET /api/consumers/segments** - Consumer segmentation data

### Real-time Updates (2 new)
13. **POST /api/dashboard/refresh** - Refresh all dashboard data
14. **POST /api/dashboard/filter** - Apply filters and get filtered data

### Export & Reporting (2 new)
15. **GET /api/export/csv** - Export data as CSV
16. **POST /api/reports/generate** - Generate custom reports

### Comparison & Analytics (2 new)
17. **GET /api/compare** - Compare multiple brands
18. **GET /api/analytics/predict** - Predictive analytics

### Alerts & Monitoring (2 new)
19. **GET /api/alerts** - Get configured alerts
20. **POST /api/alerts** - Create new alert

### Search & Preferences (3 new)
21. **GET /api/search** - Search across brands, locations, categories
22. **GET /api/preferences** - Get user preferences
23. **PUT /api/preferences** - Update user preferences

---

## Detailed Endpoint Documentation

### 1. Brand Performance
```
GET /api/brands/:brandName/performance?period=30d
```
**Parameters:**
- `brandName` (path): Brand name (e.g., "Del Monte Tomato Sauce & Ketchup")
- `period` (query): Time period - "7d", "30d", "90d" (default: "30d")

**Response:**
```json
{
  "brand": "Del Monte Tomato Sauce & Ketchup",
  "period": "30d",
  "metrics": {
    "totalValue": 2400000,
    "transactionCount": 156,
    "averageTransaction": 15384.62,
    "growth": 12.5
  }
}
```

### 2. Location Analytics
```
GET /api/locations/:location/analytics
```
**Parameters:**
- `location` (path): Location name (e.g., "Manila", "Cebu")

**Response:**
```json
{
  "location": "Manila",
  "totalTransactions": 234,
  "totalValue": 4500000,
  "topBrands": [
    { "brand": "Del Monte", "value": 1200000, "transactions": 45 }
  ],
  "categoryBreakdown": [
    { "category": "Sauce", "value": 2000000 }
  ]
}
```

### 3. Consumer Segments
```
GET /api/consumers/segments
```
**Response:**
```json
{
  "byAge": {
    "18-25": 120,
    "26-35": 234,
    "36-45": 156,
    "46+": 89
  },
  "byGender": {
    "Male": 301,
    "Female": 298
  },
  "byLocation": {
    "Manila": 200,
    "Cebu": 150
  }
}
```

### 4. Dashboard Refresh
```
POST /api/dashboard/refresh
```
**Response:**
```json
{
  "kpi": { /* KPI metrics */ },
  "brands": [ /* Brand data */ ],
  "trends": [ /* Trend data */ ],
  "insights": [ /* AI insights */ ],
  "timestamp": "2025-05-26T10:30:00Z"
}
```

### 5. Dashboard Filter
```
POST /api/dashboard/filter
```
**Body:**
```json
{
  "dateRange": "Last 30 Days",
  "location": "Manila",
  "brand": "Del Monte",
  "category": "Sauce"
}
```

### 6. Export Data
```
GET /api/export/csv?type=transactions
```
**Parameters:**
- `type`: "transactions", "brands", "locations"

**Response:** CSV file download

### 7. Generate Report
```
POST /api/reports/generate
```
**Body:**
```json
{
  "reportType": "brand-performance",
  "filters": {
    "dateRange": "Last 30 Days",
    "brands": ["Del Monte", "Alaska"]
  },
  "format": "json"
}
```

### 8. Compare Brands
```
GET /api/compare?brands=Del Monte,Alaska&period=30d
```
**Parameters:**
- `brands`: Comma-separated brand names
- `period`: Time period

### 9. Predictive Analytics
```
GET /api/analytics/predict?brand=Del Monte&metric=sales
```
**Parameters:**
- `brand`: Brand name (optional, defaults to all)
- `metric`: "sales", "volume", "transactions"

**Response:**
```json
{
  "metric": "sales",
  "brand": "Del Monte",
  "currentValue": 2400000,
  "predictedValue": 2520000,
  "confidence": 0.75,
  "factors": ["Historical trends", "Seasonal patterns"]
}
```

### 10. Alerts
```
GET /api/alerts
POST /api/alerts
```

### 11. Search
```
GET /api/search?q=del
```
**Response:**
```json
{
  "query": "del",
  "results": {
    "brands": [/* matching brands */],
    "locations": [/* matching locations */],
    "categories": [/* matching categories */]
  }
}
```

### 12. Preferences
```
GET /api/preferences
PUT /api/preferences
```
**Body (PUT):**
```json
{
  "defaultView": "overview",
  "refreshInterval": 30000,
  "chartType": "line",
  "colorScheme": "default"
}
```

## Error Handling
All endpoints return standard HTTP status codes:
- `200 OK` - Success
- `400 Bad Request` - Invalid parameters
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

Error response format:
```json
{
  "error": "Error message description"
}
```

## Authentication
Currently no authentication is implemented. In production, add:
- API key authentication
- JWT tokens
- Rate limiting

## Rate Limiting
Recommended limits:
- 100 requests per minute for data endpoints
- 10 requests per minute for export/report endpoints
- 1000 requests per hour per IP