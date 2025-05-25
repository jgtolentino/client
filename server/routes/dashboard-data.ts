import { Request, Response } from 'express';

// Azure Blob Storage configuration
const AZURE_STORAGE_URL = process.env.AZURE_STORAGE_URL || 'https://your-account.blob.core.windows.net';
const CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME || 'dashboard-data';
const USE_PARQUET = process.env.USE_PARQUET === 'true';

// Cache configuration
let cachedData: any = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getDashboardData(req: Request, res: Response) {
  try {
    // Check cache
    const now = Date.now();
    if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
      return res.json(cachedData);
    }

    // In production, fetch from Azure Blob Storage
    if (process.env.NODE_ENV === 'production' && process.env.AZURE_STORAGE_URL) {
      const response = await fetch(`${AZURE_STORAGE_URL}/${CONTAINER_NAME}/dashboard-data.json`);
      if (!response.ok) {
        throw new Error('Failed to fetch data from Azure');
      }
      cachedData = await response.json();
      cacheTimestamp = now;
      return res.json(cachedData);
    }

    // In development, use local sample data
    const sampleData = await import('../../client/public/data/dashboard_data.json');
    return res.json(sampleData.default);

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch dashboard data',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Endpoint to get specific data subsets (more efficient)
export async function getDashboardDataSubset(req: Request, res: Response) {
  const { subset, limit = 100, offset = 0 } = req.query;
  
  try {
    // Get full data (from cache or Azure)
    const fullData = await getDashboardDataInternal();
    
    if (!subset || typeof subset !== 'string') {
      return res.status(400).json({ error: 'Subset parameter required' });
    }

    // Return requested subset with pagination
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
    console.error('Error fetching data subset:', error);
    res.status(500).json({ error: 'Failed to fetch data subset' });
  }
}

async function getDashboardDataInternal() {
  // Implementation would fetch from Azure Blob Storage
  // For now, return sample data structure
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