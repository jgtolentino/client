import { Router, Request, Response } from 'express';
import { dataSourceManager } from '../datasources';
import { CSVConnector, RestAPIConnector } from '../datasources';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { promises as fs } from 'fs';

const router = Router();

// Ensure upload directory exists
const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'csv');
fs.mkdir(UPLOAD_DIR, { recursive: true }).catch(console.error);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.csv') {
      return cb(new Error('Only CSV files are allowed'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// GET /api/datasources - List all data sources
router.get('/datasources', async (req: Request, res: Response) => {
  try {
    const dataSources = dataSourceManager.getDataSources();
    res.json({
      success: true,
      data: dataSources
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/datasources/types - Get available connector types
router.get('/datasources/types', async (req: Request, res: Response) => {
  try {
    const types = dataSourceManager.getAvailableConnectorTypes();
    res.json({
      success: true,
      data: types
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/datasources - Create new data source
router.post('/datasources', async (req: Request, res: Response) => {
  try {
    const { id, name, type, config } = req.body;

    if (!id || !name || !type) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: id, name, type'
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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/datasources/:id/upload - Upload CSV file
router.post('/datasources/:id/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tableName } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const connector = await dataSourceManager.getConnector(id);
    if (!(connector instanceof CSVConnector)) {
      // Clean up uploaded file
      await fs.unlink(req.file.path).catch(() => {});
      
      return res.status(400).json({
        success: false,
        error: 'Data source is not a CSV connector'
      });
    }

    const name = tableName || path.basename(req.file.originalname, '.csv');
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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/datasources/:id/schema - Get data source schema
router.get('/datasources/:id/schema', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const schema = await dataSourceManager.getSchema(id);

    res.json({
      success: true,
      data: schema
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/datasources/:id/query - Execute query
router.post('/datasources/:id/query', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const queryRequest = req.body;

    // Validate query request
    if (!queryRequest.sql && !queryRequest.table) {
      return res.status(400).json({
        success: false,
        error: 'Either sql or table must be specified'
      });
    }

    // Security: Basic SQL injection prevention (enhance this in production)
    if (queryRequest.sql) {
      const dangerousKeywords = ['DROP', 'DELETE', 'TRUNCATE', 'UPDATE', 'INSERT', 'ALTER', 'CREATE'];
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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/datasources/:id/tables - List tables in data source
router.get('/datasources/:id/tables', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tables = await dataSourceManager.getTables(id);

    res.json({
      success: true,
      data: tables.map(table => ({
        name: table.name,
        rowCount: table.rowCount,
        columnCount: table.columns?.length || 0
      }))
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/datasources/:id/tables/:table - Get table schema
router.get('/datasources/:id/tables/:table', async (req: Request, res: Response) => {
  try {
    const { id, table } = req.params;
    const schema = await dataSourceManager.getTableSchema(id, table);

    res.json({
      success: true,
      data: schema
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/datasources/:id/preview/:table - Preview data from a table
router.get('/datasources/:id/preview/:table', async (req: Request, res: Response) => {
  try {
    const { id, table } = req.params;
    const limit = parseInt(req.query.limit as string) || 100;

    const result = await dataSourceManager.query(id, {
      table,
      limit
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/datasources/:id - Remove data source
router.delete('/datasources/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (id === dataSourceManager.getDefaultDataSourceId()) {
      return res.status(403).json({
        success: false,
        error: 'Cannot remove the default data source'
      });
    }

    await dataSourceManager.removeDataSource(id);

    res.json({
      success: true,
      message: `Data source '${id}' removed successfully`
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/datasources/:id/test - Test connection
router.post('/datasources/:id/test', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const testResult = await dataSourceManager.testDataSource(id);

    res.json({
      success: true,
      data: testResult
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/datasources/:id/refresh - Refresh data source
router.post('/datasources/:id/refresh', async (req: Request, res: Response) => {
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
      // For other connectors, disconnect and reconnect
      await connector.disconnect();
      await connector.connect(connector.getMetadata());
      
      res.json({
        success: true,
        message: 'Data source refreshed successfully'
      });
    }
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/datasources/:id/validate - Validate a query
router.post('/datasources/:id/validate', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { sql } = req.body;

    if (!sql) {
      return res.status(400).json({
        success: false,
        error: 'SQL query is required'
      });
    }

    // Try to parse the query without executing
    try {
      // This is a simple validation - enhance with proper SQL parser
      const testQuery = {
        sql: sql + ' LIMIT 0',  // Add LIMIT 0 to prevent data retrieval
        maxRows: 0
      };
      
      await dataSourceManager.query(id, testQuery);
      
      res.json({
        success: true,
        valid: true,
        message: 'Query is valid'
      });
    } catch (queryError: any) {
      res.json({
        success: true,
        valid: false,
        error: queryError.message
      });
    }
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/datasources/:id/stream/:table - Stream data from a table
router.get('/datasources/:id/stream/:table', async (req: Request, res: Response) => {
  try {
    const { id, table } = req.params;
    const limit = parseInt(req.query.limit as string) || 1000;

    const connector = await dataSourceManager.getConnector(id);
    
    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let count = 0;
    const stream = connector.queryStream({ table, limit });
    
    for await (const row of stream) {
      res.write(`data: ${JSON.stringify(row)}\n\n`);
      count++;
      
      // Flush every 100 rows
      if (count % 100 === 0) {
        res.flush();
      }
    }
    
    res.write(`event: complete\ndata: {"rowCount": ${count}}\n\n`);
    res.end();
  } catch (error: any) {
    res.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// REST API Connector specific endpoints

// POST /api/datasources/:id/endpoints - Add REST API endpoint
router.post('/datasources/:id/endpoints', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, path, method, params, body, tableName, transform, pagination } = req.body;

    if (!name || !path) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, path'
      });
    }

    const connector = await dataSourceManager.getConnector(id);
    if (!(connector instanceof RestAPIConnector)) {
      return res.status(400).json({
        success: false,
        error: 'Data source is not a REST API connector'
      });
    }

    connector.addEndpoint(name, {
      path,
      method: method || 'GET',
      params,
      body,
      tableName: tableName || name,
      transform,
      pagination
    });

    res.json({
      success: true,
      data: { name, path, method: method || 'GET' }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/datasources/:id/endpoints - List REST API endpoints
router.get('/datasources/:id/endpoints', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const connector = await dataSourceManager.getConnector(id);
    if (!(connector instanceof RestAPIConnector)) {
      return res.status(400).json({
        success: false,
        error: 'Data source is not a REST API connector'
      });
    }

    // Get schema which includes endpoint information
    const schema = await connector.getSchema();
    const endpoints = schema.tables.map(table => ({
      name: table.name,
      rowCount: table.rowCount || 0,
      columnCount: table.columns?.length || 0
    }));

    res.json({
      success: true,
      data: endpoints
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/datasources/:id/test-endpoint - Test a specific endpoint
router.post('/datasources/:id/test-endpoint', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, path, method, params, body } = req.body;

    if (!path) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: path'
      });
    }

    const connector = await dataSourceManager.getConnector(id);
    if (!(connector instanceof RestAPIConnector)) {
      return res.status(400).json({
        success: false,
        error: 'Data source is not a REST API connector'
      });
    }

    // Temporarily add endpoint for testing
    const testName = `test_${Date.now()}`;
    connector.addEndpoint(testName, {
      path,
      method: method || 'GET',
      params,
      body,
      tableName: testName
    });

    try {
      // Query a small sample
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
    } catch (testError: any) {
      res.status(400).json({
        success: false,
        error: `Endpoint test failed: ${testError.message}`
      });
    }
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/datasources/templates - Get REST API templates
router.get('/datasources/templates', async (req: Request, res: Response) => {
  try {
    const templates = {
      github: {
        name: 'GitHub API',
        baseUrl: 'https://api.github.com',
        auth: {
          type: 'bearer',
          credentials: {
            token: 'YOUR_GITHUB_TOKEN'
          }
        },
        endpoints: [
          {
            name: 'repositories',
            path: '/user/repos',
            pagination: {
              type: 'page',
              pageParam: 'page',
              limitParam: 'per_page'
            }
          },
          {
            name: 'issues',
            path: '/issues',
            pagination: {
              type: 'page',
              pageParam: 'page',
              limitParam: 'per_page'
            }
          }
        ]
      },
      stripe: {
        name: 'Stripe API',
        baseUrl: 'https://api.stripe.com',
        auth: {
          type: 'bearer',
          credentials: {
            token: 'YOUR_STRIPE_SECRET_KEY'
          }
        },
        endpoints: [
          {
            name: 'customers',
            path: '/v1/customers',
            pagination: {
              type: 'cursor',
              cursorParam: 'starting_after',
              limitParam: 'limit',
              dataPath: 'data'
            }
          },
          {
            name: 'charges',
            path: '/v1/charges',
            pagination: {
              type: 'cursor',
              cursorParam: 'starting_after',
              limitParam: 'limit',
              dataPath: 'data'
            }
          }
        ]
      },
      shopify: {
        name: 'Shopify API',
        baseUrl: 'https://your-shop.myshopify.com',
        auth: {
          type: 'apiKey',
          credentials: {
            apiKey: 'YOUR_API_KEY',
            apiKeyHeader: 'X-Shopify-Access-Token'
          }
        },
        endpoints: [
          {
            name: 'products',
            path: '/admin/api/2023-10/products.json',
            pagination: {
              type: 'link',
              nextLinkPath: 'link',
              dataPath: 'products'
            }
          },
          {
            name: 'orders',
            path: '/admin/api/2023-10/orders.json',
            pagination: {
              type: 'link',
              nextLinkPath: 'link',
              dataPath: 'orders'
            }
          }
        ]
      },
      custom: {
        name: 'Custom REST API',
        baseUrl: 'https://api.example.com',
        auth: {
          type: 'bearer',
          credentials: {
            token: 'YOUR_API_TOKEN'
          }
        },
        rateLimit: {
          requests: 100,
          interval: 60000
        },
        pagination: {
          type: 'page',
          pageParam: 'page',
          limitParam: 'limit'
        },
        endpoints: [
          {
            name: 'data',
            path: '/api/data',
            method: 'GET'
          }
        ]
      }
    };

    res.json({
      success: true,
      data: templates
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;