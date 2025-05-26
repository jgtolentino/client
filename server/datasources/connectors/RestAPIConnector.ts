import { BaseConnector } from '../core/BaseConnector';
import { 
  ConnectionConfig, 
  QueryRequest, 
  QueryResult, 
  DatabaseSchema,
  TableInfo,
  ColumnInfo,
  DataType,
  ConnectionTestResult,
  ConnectorCapabilities,
  ConnectorMetadata
} from '../core/types';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import alasql from 'alasql';
import { RateLimiter } from 'limiter';

interface RestAPIConfig extends ConnectionConfig {
  baseUrl: string;
  timeout?: number;
  auth?: {
    type: 'basic' | 'bearer' | 'apiKey' | 'oauth2';
    credentials?: {
      username?: string;
      password?: string;
      token?: string;
      apiKey?: string;
      apiKeyHeader?: string;
      clientId?: string;
      clientSecret?: string;
      refreshToken?: string;
    };
  };
  headers?: Record<string, string>;
  rateLimit?: {
    requests: number;
    interval: number; // in ms
  };
  pagination?: {
    type: 'offset' | 'cursor' | 'page' | 'link';
    pageParam?: string;
    limitParam?: string;
    offsetParam?: string;
    cursorParam?: string;
    nextLinkPath?: string;
    dataPath?: string;
    totalPath?: string;
  };
  transform?: {
    flatten?: boolean;
    pivot?: {
      arrayPath: string;
      keyPath?: string;
      valuePath?: string;
    };
    jsonPath?: string;
  };
}

interface EndpointConfig {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: Record<string, any>;
  body?: any;
  tableName: string;
  schema?: TableInfo;
  transform?: RestAPIConfig['transform'];
  pagination?: RestAPIConfig['pagination'];
}

export class RestAPIConnector extends BaseConnector {
  private client!: AxiosInstance;
  private limiter?: RateLimiter;
  private endpoints = new Map<string, EndpointConfig>();
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  async connect(config: RestAPIConfig): Promise<void> {
    this.config = config;
    
    // Create axios instance
    const axiosConfig: AxiosRequestConfig = {
      baseURL: config.baseUrl,
      headers: config.headers || {},
      timeout: config.timeout || 30000
    };

    // Setup authentication
    if (config.auth) {
      switch (config.auth.type) {
        case 'basic':
          axiosConfig.auth = {
            username: config.auth.credentials?.username || '',
            password: config.auth.credentials?.password || ''
          };
          break;
        case 'bearer':
                axiosConfig.headers!.Authorization = `Bearer ${config.auth.credentials?.token}`;
          break;
        case 'apiKey':
          const header = config.auth.credentials?.apiKeyHeader || 'X-API-Key';
          axiosConfig.headers![header] = config.auth.credentials?.apiKey || '';
          break;
        case 'oauth2':
          // OAuth2 would need more complex handling
          axiosConfig.headers!.Authorization = `Bearer ${config.auth.credentials?.token}`;
          break;
      }
    }

    this.client = axios.create(axiosConfig);

    // Setup rate limiter
    if (config.rateLimit) {
      this.limiter = new RateLimiter({
        tokensPerInterval: config.rateLimit.requests,
        interval: config.rateLimit.interval
      });
    }

    // Load common API templates if specified
    this.loadAPITemplate(config);
    
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.cache.clear();
    this.endpoints.clear();
    this.connected = false;
  }

  async query<T = any>(request: QueryRequest): Promise<QueryResult<T>> {
    const startTime = Date.now();
    
    if (request.sql) {
      return this.executeSQLQuery<T>(request.sql);
    }

    // For structured queries, map to endpoint
    const endpoint = this.endpoints.get(request.table || '');
    if (!endpoint) {
      throw new Error(`No endpoint configured for table: ${request.table}`);
    }

    const data = await this.fetchEndpointData(endpoint);
    
    // Apply filters if provided via where clauses
    let result = data;
    if (request.where && request.where.length > 0) {
      result = this.applyWhereFilters(result, request.where);
    }
    if (request.limit) {
      result = result.slice(0, request.limit);
    }

    return {
      rows: result as T[],
      rowCount: result.length,
      fields: this.getFieldsFromData(result),
      executionTime: Date.now() - startTime
    };
  }

  async getSchema(): Promise<DatabaseSchema> {
    const tables: TableInfo[] = [];

    for (const [name, endpoint] of Array.from(this.endpoints)) {
      if (endpoint.schema) {
        tables.push(endpoint.schema);
      } else {
        // Try to discover schema from sample data
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
      name: 'rest-api',
      tables,
      relationships: []
    };
  }

  async testConnection(): Promise<ConnectionTestResult> {
    try {
      // Test with a simple request
      const testEndpoint = this.endpoints.values().next().value;
      if (testEndpoint) {
        await this.fetchEndpointData(testEndpoint, { limit: 1 });
      } else {
        // Just test base URL
        await this.client.get('/');
      }
      return {
        success: true,
        message: 'Connection successful'
      };
    } catch (error) {
      console.error('Connection test failed:', error);
      return {
        success: false,
        message: `Connection failed: ${error instanceof Error ? error.message : String(error)}`,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  }

  async getTables(): Promise<TableInfo[]> {
    const schema = await this.getSchema();
    return schema.tables;
  }

  async getTableSchema(tableName: string): Promise<TableInfo> {
    const endpoint = this.endpoints.get(tableName);
    if (!endpoint) {
      throw new Error(`No endpoint configured for table: ${tableName}`);
    }

    if (endpoint.schema) {
      return endpoint.schema;
    }

    // Discover schema from sample data
    const sample = await this.fetchEndpointData(endpoint, { limit: 5 });
    const schema = this.discoverSchema(tableName, sample);
    endpoint.schema = schema;
    return schema;
  }

  getCapabilities(): ConnectorCapabilities {
    return {
      supportsStreaming: false,
      supportsTransactions: false,
      supportsBatchOperations: false,
      supportsSchemaDiscovery: true,
      supportsStoredProcedures: false,
      supportsViews: false,
      maxQuerySize: 1000000,
      maxResultSize: 10000000
    };
  }

  getMetadata(): ConnectorMetadata {
    return {
      name: 'rest-api',
      displayName: 'REST API Connector',
      description: 'Connect to any REST API and query data with SQL',
      version: '1.0.0',
      author: 'System',
      icon: 'cloud',
      configSchema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          baseUrl: { type: 'string' }
        },
        required: ['id', 'name', 'baseUrl']
      }
    };
  }

  // Add or update an endpoint
  addEndpoint(name: string, config: EndpointConfig): void {
    this.endpoints.set(name, { ...config, tableName: name });
    // Clear cache for this endpoint
    this.cache.delete(name);
  }

  // Fetch data from an endpoint with caching and pagination
  private async fetchEndpointData(
    endpoint: EndpointConfig, 
    options?: { limit?: number; offset?: number }
  ): Promise<any[]> {
    const cacheKey = JSON.stringify({ endpoint, options });
    
    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    // Rate limiting
    if (this.limiter) {
      await this.limiter.removeTokens(1);
    }

    const config = this.config as RestAPIConfig;
    let allData: any[] = [];
    let hasMore = true;
    let cursor: string | null = null;
    let page = 1;

    while (hasMore) {
      // Build request params
      const params: any = { ...endpoint.params };
      
      if (config.pagination) {
        switch (config.pagination.type) {
          case 'offset':
            params[config.pagination.limitParam || 'limit'] = options?.limit || 100;
            params[config.pagination.offsetParam || 'offset'] = 
              allData.length + (options?.offset || 0);
            break;
          case 'page':
            params[config.pagination.pageParam || 'page'] = page;
            params[config.pagination.limitParam || 'per_page'] = options?.limit || 100;
            break;
          case 'cursor':
            if (cursor) {
              params[config.pagination.cursorParam || 'cursor'] = cursor;
            }
            params[config.pagination.limitParam || 'limit'] = options?.limit || 100;
            break;
        }
      }

      // Make request
      const response = await this.client.request({
        method: endpoint.method || 'GET',
        url: endpoint.path,
        params,
        data: endpoint.body
      });

      // Extract data based on configuration
      let pageData = response.data;
      
      if (config.pagination?.dataPath) {
        pageData = this.getNestedValue(pageData, config.pagination.dataPath);
      }

      // Transform data if needed
      if (endpoint.transform || config.transform) {
        pageData = this.transformData(pageData, endpoint.transform || config.transform);
      }

      allData = allData.concat(Array.isArray(pageData) ? pageData : [pageData]);

      // Check if there's more data
      if (config.pagination) {
        switch (config.pagination.type) {
          case 'cursor':
            cursor = this.getNestedValue(response.data, config.pagination.nextLinkPath || 'next_cursor');
            hasMore = !!cursor;
            break;
          case 'page':
            const total = this.getNestedValue(response.data, config.pagination.totalPath || 'total');
            hasMore = page * (options?.limit || 100) < total;
            page++;
            break;
          case 'link':
            const nextLink = this.getNestedValue(response.data, config.pagination.nextLinkPath || 'next');
            hasMore = !!nextLink;
            if (nextLink) {
              endpoint.path = nextLink; // Update path for next request
            }
            break;
          default:
            hasMore = pageData.length === (options?.limit || 100);
        }
      } else {
        hasMore = false;
      }

      // Break if we have enough data
      if (options?.limit && allData.length >= options.limit) {
        allData = allData.slice(0, options.limit);
        break;
      }
    }

    // Cache the result
    this.cache.set(cacheKey, { data: allData, timestamp: Date.now() });
    
    return allData;
  }

  private transformData(data: any, transform: RestAPIConfig['transform']): any {
    if (!transform) return data;

    let result = data;

    // Apply JSON path first
    if (transform.jsonPath) {
      result = this.getNestedValue(result, transform.jsonPath);
    }

    // Flatten nested objects
    if (transform.flatten) {
      result = Array.isArray(result) 
        ? result.map(item => this.flattenObject(item))
        : this.flattenObject(result);
    }

    // Pivot array data
    if (transform.pivot && Array.isArray(result)) {
      const pivoted: any[] = [];
      for (const item of result) {
        const arrayData = this.getNestedValue(item, transform.pivot.arrayPath);
        if (Array.isArray(arrayData)) {
          for (const element of arrayData) {
            pivoted.push({
              ...item,
              [transform.pivot.keyPath || 'key']: element[transform.pivot.keyPath || 'key'],
              [transform.pivot.valuePath || 'value']: element[transform.pivot.valuePath || 'value']
            });
          }
        }
      }
      result = pivoted;
    }

    return result;
  }

  private flattenObject(obj: any, prefix = ''): any {
    const flattened: any = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}_${key}` : key;
        
        if (obj[key] === null || obj[key] === undefined) {
          flattened[newKey] = obj[key];
        } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          Object.assign(flattened, this.flattenObject(obj[key], newKey));
        } else {
          flattened[newKey] = obj[key];
        }
      }
    }
    
    return flattened;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((curr, prop) => curr?.[prop], obj);
  }

  private async executeSQLQuery<T>(sql: string): Promise<QueryResult<T>> {
    // Create temporary tables from all endpoints
    const tempTables: Record<string, any[]> = {};
    
    for (const [name, endpoint] of Array.from(this.endpoints)) {
      try {
        tempTables[name] = await this.fetchEndpointData(endpoint);
      } catch (error) {
        console.error(`Failed to fetch data for table ${name}:`, error);
      }
    }

    // Execute SQL with alasql
    const startTime = Date.now();
    const result = alasql(sql, tempTables);
    
    return {
      rows: Array.isArray(result) ? result : [result],
      rowCount: Array.isArray(result) ? result.length : 1,
      fields: this.getFieldsFromData(Array.isArray(result) ? result : [result]),
      executionTime: Date.now() - startTime
    };
  }

  private applyWhereFilters(data: any[], whereClause: any[]): any[] {
    return data.filter(item => {
      // Simple implementation for basic where clauses
      return whereClause.every(clause => {
        const fieldValue = item[clause.field];
        switch (clause.operator) {
          case '=':
            return fieldValue === clause.value;
          case '!=':
            return fieldValue !== clause.value;
          case '>':
            return fieldValue > clause.value;
          case '>=':
            return fieldValue >= clause.value;
          case '<':
            return fieldValue < clause.value;
          case '<=':
            return fieldValue <= clause.value;
          case 'LIKE':
            return String(fieldValue).includes(String(clause.value));
          default:
            return true;
        }
      });
    });
  }

  private getFieldsFromData(data: any[]): import('../core/types').FieldInfo[] {
    if (!data || data.length === 0) {
      return [];
    }

    const sample = data[0];
    const fields: import('../core/types').FieldInfo[] = [];

    for (const [key, value] of Object.entries(sample)) {
      fields.push({
        name: key,
        type: this.inferDataType(value),
        nullable: true
      });
    }

    return fields;
  }

  private discoverSchema(tableName: string, sampleData: any[]): TableInfo {
    if (!sampleData || sampleData.length === 0) {
      return {
        name: tableName,
        columns: []
      };
    }

    const columns: ColumnInfo[] = [];
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

  private inferDataType(value: any): DataType {
    if (value === null || value === undefined) return DataType.String;
    if (typeof value === 'number') return DataType.Number;
    if (typeof value === 'boolean') return DataType.Boolean;
    if (value instanceof Date) return DataType.DateTime;
    if (typeof value === 'string') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return DataType.Date;
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) return DataType.DateTime;
    }
    return DataType.String;
  }

  private loadAPITemplate(config: RestAPIConfig): void {
    // Load predefined templates based on base URL or config
    if (config.baseUrl.includes('github.com')) {
      this.loadGitHubTemplate();
    } else if (config.baseUrl.includes('stripe.com')) {
      this.loadStripeTemplate();
    } else if (config.baseUrl.includes('shopify.com')) {
      this.loadShopifyTemplate();
    }
  }

  private loadGitHubTemplate(): void {
    this.addEndpoint('repositories', {
      path: '/user/repos',
      tableName: 'repositories',
      pagination: {
        type: 'page',
        pageParam: 'page',
        limitParam: 'per_page'
      }
    });

    this.addEndpoint('issues', {
      path: '/issues',
      tableName: 'issues',
      pagination: {
        type: 'page',
        pageParam: 'page',
        limitParam: 'per_page'
      }
    });

    this.addEndpoint('pull_requests', {
      path: '/pulls',
      tableName: 'pull_requests',
      pagination: {
        type: 'page',
        pageParam: 'page',
        limitParam: 'per_page'
      }
    });
  }

  private loadStripeTemplate(): void {
    this.addEndpoint('customers', {
      path: '/v1/customers',
      tableName: 'customers',
      pagination: {
        type: 'cursor',
        cursorParam: 'starting_after',
        limitParam: 'limit',
        dataPath: 'data'
      }
    });

    this.addEndpoint('charges', {
      path: '/v1/charges',
      tableName: 'charges',
      pagination: {
        type: 'cursor',
        cursorParam: 'starting_after',
        limitParam: 'limit',
        dataPath: 'data'
      }
    });

    this.addEndpoint('subscriptions', {
      path: '/v1/subscriptions',
      tableName: 'subscriptions',
      pagination: {
        type: 'cursor',
        cursorParam: 'starting_after',
        limitParam: 'limit',
        dataPath: 'data'
      }
    });
  }

  private loadShopifyTemplate(): void {
    this.addEndpoint('products', {
      path: '/admin/api/2023-10/products.json',
      tableName: 'products',
      pagination: {
        type: 'link',
        nextLinkPath: 'link',
        dataPath: 'products'
      }
    });

    this.addEndpoint('orders', {
      path: '/admin/api/2023-10/orders.json',
      tableName: 'orders',
      pagination: {
        type: 'link',
        nextLinkPath: 'link',
        dataPath: 'orders'
      }
    });

    this.addEndpoint('customers', {
      path: '/admin/api/2023-10/customers.json',
      tableName: 'customers',
      pagination: {
        type: 'link',
        nextLinkPath: 'link',
        dataPath: 'customers'
      }
    });
  }
}