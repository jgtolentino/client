# 🚀 TBWA Dashboard - Modern Frontend Branch

This branch contains the integrated modern React frontend from retail-insight-pilot-project combined with the Express backend.

## ✨ Features

- Modern React 18 with TypeScript
- Shadcn/ui components
- TanStack Query for data fetching
- Recharts for data visualization
- Automatic API refresh every 30 seconds
- Philippine Peso (PHP) formatting
- 6 KPIs including Market Share & Store Presence
- Responsive design

## 🏗️ Structure

```
client/
├── client/              # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── services/    # API services
│   │   └── pages/       # Page components
│   └── index.html
├── server/              # Backend (Express)
│   └── index.ts         # API endpoints
├── package.json         # Combined dependencies
└── vite.config.ts       # Vite configuration
```

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Development Mode
```bash
npm run dev
# Frontend: http://localhost:5173
# Backend: http://localhost:8080
```

### Production Build
```bash
npm run build
npm start
# Visit: http://localhost:8080
```

## 🔌 API Endpoints

- `GET /api/health` - Health check
- `GET /api/dashboard` - All dashboard data
- `GET /api/kpis` - Key performance indicators
- `GET /api/transactions` - Recent transactions
- `GET /api/brands` - Brand performance

## 🎯 Environment Variables

Create `client/.env` file:
```env
# Use Express backend (default)
VITE_API_URL=/api
VITE_USE_AZURE_SQL=false

# OR use Azure SQL (optional)
VITE_USE_AZURE_SQL=true
VITE_AZURE_FUNCTIONS_URL=https://your-functions.azurewebsites.net/api
VITE_AZURE_FUNCTION_KEY=your-key
```

## 📦 Deployment

### Azure App Service
```bash
npm run deploy:azure
```

### Manual Deployment
1. Build: `npm run build`
2. Deploy `dist/` folder and `server/` to your hosting
3. Set NODE_ENV=production
4. Run: `npm start`

## 🔄 Switching Between Backends

The frontend supports both Express (mock data) and Azure SQL backends:

1. **Express Backend** (default) - Uses mock TBWA data
2. **Azure SQL** - Set `VITE_USE_AZURE_SQL=true` in `.env`

## 📊 Sample Data

The backend serves mock data for TBWA brands:
- Alaska (Dairy products)
- Oishi (Snacks)
- Del Monte (Canned goods)
- And more...

---

To merge this to main when ready:
```bash
git checkout main
git merge feat/modern-frontend
```