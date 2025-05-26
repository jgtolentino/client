# 🔌 Data Connector Architecture Design

## Overview
A flexible, extensible connector system that enables the Brand Performance Dashboard to connect to any data source while maintaining type safety and performance.

---

## Core Architecture Principles

### 1. **Plugin-Based Design**
- Each connector is a self-contained plugin
- Connectors implement a common interface
- Hot-swappable without system restart
- Independent versioning and updates

### 2. **Type Safety**
- Full TypeScript support
- Schema validation at runtime
- Type inference from data sources
- Compile-time query validation where possible

### 3. **Performance First**
- Connection pooling by default
- Query result streaming for large datasets
- Intelligent caching strategies
- Parallel query execution

### 4. **Security by Design**
- Encrypted credential storage
- Query sanitization at connector level
- Row-level security support
- Audit logging built-in

---

## Connector Interface Hierarchy

```typescript
// Base interface all connectors must implement
interface IDataConnector {
  // Lifecycle
  connect(config: ConnectionConfig): Promise<void>;
  disconnect(): Promise<void>;
  testConnection(): Promise<ConnectionTestResult>;
  
  // Query execution
  query<T = any>(request: QueryRequest): Promise<QueryResult<T>>;
  queryStream<T = any>(request: QueryRequest): AsyncIterator<T>;
  
  // Schema discovery
  getSchema(): Promise<DatabaseSchema>;
  getTables(): Promise<TableInfo[]>;
  getTableSchema(tableName: string): Promise<TableSchema>;
  
  // Metadata
  getCapabilities(): ConnectorCapabilities;
  getMetadata(): ConnectorMetadata;
}

// Extended interfaces for specific connector types
interface ISQLConnector extends IDataConnector {
  executeRaw(sql: string, params?: any[]): Promise<any>;
  beginTransaction(): Promise<Transaction>;
  supportsTransactions(): boolean;
}

interface IFileConnector extends IDataConnector {
  supportedFormats(): FileFormat[];
  parseFile(file: Buffer, format: FileFormat): Promise<any[]>;
  watchFile(path: string, callback: FileChangeCallback): void;
}

interface IAPIConnector extends IDataConnector {
  setAuthentication(auth: AuthConfig): void;
  mapEndpoints(mapping: EndpointMapping): void;
  handlePagination(config: PaginationConfig): void;
}
```

---

## Connector Type Specifications

### 1. SQL Database Connectors

```typescript
abstract class BaseSQLConnector implements ISQLConnector {
  protected pool: any;
  protected config: SQLConnectionConfig;
  protected queryBuilder: QueryBuilder;
  
  constructor(config: SQLConnectionConfig) {
    this.config = config;
    this.queryBuilder = new QueryBuilder(this.getDialect());
  }
  
  abstract getDialect(): SQLDialect;
  
  async query<T>(request: QueryRequest): Promise<QueryResult<T>> {
    const sql = this.queryBuilder.build(request);
    const result = await this.executeRaw(sql, request.parameters);
    
    return {
      rows: result.rows as T[],
      rowCount: result.rowCount,
      fields: this.mapFields(result.fields),
      executionTime: result.executionTime
    };
  }
  
  protected async createPool(): Promise<void> {
    // Connection pooling logic
  }
  
  protected mapFields(fields: any[]): FieldInfo[] {
    // Map database-specific types to common types
  }
}

// Specific implementations
class PostgreSQLConnector extends BaseSQLConnector {
  getDialect(): SQLDialect {
    return SQLDialect.PostgreSQL;
  }
  
  async connect() {
    const { Pool } = require('pg');
    this.pool = new Pool({
      host: this.config.host,
      port: this.config.port,
      database: this.config.database,
      user: this.config.user,
      password: await this.decryptPassword(this.config.password),
      max: this.config.poolSize || 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
}

class MySQLConnector extends BaseSQLConnector {
  getDialect(): SQLDialect {
    return SQLDialect.MySQL;
  }
  
  async connect() {
    const mysql = require('mysql2/promise');
    this.pool = await mysql.createPool({
      host: this.config.host,
      port: this.config.port,
      database: this.config.database,
      user: this.config.user,
      password: await this.decryptPassword(this.config.password),
      waitForConnections: true,
      connectionLimit: this.config.poolSize || 10,
      queueLimit: 0
    });
  }
}

class SQLServerConnector extends BaseSQLConnector {
  getDialect(): SQLDialect {
    return SQLDialect.SQLServer;
  }
  
  async connect() {
    const sql = require('mssql');
    this.pool = await sql.connect({
      server: this.config.host,
      port: this.config.port,
      database: this.config.database,
      user: this.config.user,
      password: await this.decryptPassword(this.config.password),
      pool: {
        max: this.config.poolSize || 10,
        min: 0,
        idleTimeoutMillis: 30000
      },
      options: {
        encrypt: true,
        trustServerCertificate: false
      }
    });
  }
}
```

### 2. File-Based Connectors

```typescript
abstract class BaseFileConnector implements IFileConnector {
  protected filePath: string;
  protected fileContent: Buffer;
  protected parsedData: any[];
  protected schema: TableSchema;
  
  async connect(config: FileConnectionConfig) {
    this.filePath = config.filePath;
    await this.loadFile();
    await this.parseContent();
    this.schema = await this.inferSchema();
  }
  
  abstract parseContent(): Promise<void>;
  abstract supportedFormats(): FileFormat[];
  
  protected async loadFile(): Promise<void> {
    if (this.filePath.startsWith('http')) {
      // Download from URL
      const response = await axios.get(this.filePath, { 
        responseType: 'arraybuffer' 
      });
      this.fileContent = Buffer.from(response.data);
    } else {
      // Read from filesystem
      this.fileContent = await fs.readFile(this.filePath);
    }
  }
  
  protected inferSchema(): TableSchema {
    // Analyze data to infer types
    const sample = this.parsedData.slice(0, 100);
    const columns = Object.keys(sample[0] || {}).map(key => ({
      name: key,
      type: this.inferColumnType(sample, key),
      nullable: this.checkNullable(sample, key)
    }));
    
    return {
      name: path.basename(this.filePath, path.extname(this.filePath)),
      columns
    };
  }
  
  async query<T>(request: QueryRequest): Promise<QueryResult<T>> {
    // Use in-memory SQL engine
    const alasql = require('alasql');
    const result = alasql(request.sql || this.buildSQL(request), [this.parsedData]);
    
    return {
      rows: result as T[],
      rowCount: result.length,
      fields: this.getFieldsFromResult(result),
      executionTime: 0
    };
  }
}

class CSVConnector extends BaseFileConnector {
  supportedFormats(): FileFormat[] {
    return [FileFormat.CSV, FileFormat.TSV];
  }
  
  async parseContent(): Promise<void> {
    const Papa = require('papaparse');
    const result = Papa.parse(this.fileContent.toString(), {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true
    });
    
    this.parsedData = result.data;
  }
}

class ExcelConnector extends BaseFileConnector {
  supportedFormats(): FileFormat[] {
    return [FileFormat.XLSX, FileFormat.XLS];
  }
  
  async parseContent(): Promise<void> {
    const XLSX = require('xlsx');
    const workbook = XLSX.read(this.fileContent, { type: 'buffer' });
    
    // Use first sheet by default
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    this.parsedData = XLSX.utils.sheet_to_json(worksheet);
  }
}

class JSONConnector extends BaseFileConnector {
  supportedFormats(): FileFormat[] {
    return [FileFormat.JSON, FileFormat.JSONL];
  }
  
  async parseContent(): Promise<void> {
    const content = this.fileContent.toString();
    
    if (this.filePath.endsWith('.jsonl')) {
      // JSON Lines format
      this.parsedData = content
        .split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line));
    } else {
      // Regular JSON
      const parsed = JSON.parse(content);
      this.parsedData = Array.isArray(parsed) ? parsed : [parsed];
    }
  }
}
```

### 3. API Connectors

```typescript
abstract class BaseAPIConnector implements IAPIConnector {
  protected baseUrl: string;
  protected auth: AuthConfig;
  protected endpoints: Map<string, EndpointConfig> = new Map();
  protected client: AxiosInstance;
  
  constructor(config: APIConnectionConfig) {
    this.baseUrl = config.baseUrl;
    this.auth = config.auth;
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: config.timeout || 30000,
      headers: config.headers || {}
    });
    
    this.setupInterceptors();
  }
  
  protected setupInterceptors(): void {
    // Request interceptor for auth
    this.client.interceptors.request.use(async (config) => {
      const authHeaders = await this.getAuthHeaders();
      config.headers = { ...config.headers, ...authHeaders };
      return config;
    });
    
    // Response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => this.handleError(error)
    );
  }
  
  abstract getAuthHeaders(): Promise<Record<string, string>>;
  
  async query<T>(request: QueryRequest): Promise<QueryResult<T>> {
    const endpoint = this.mapQueryToEndpoint(request);
    const response = await this.client.request(endpoint);
    
    return {
      rows: this.extractRows(response.data) as T[],
      rowCount: this.countRows(response.data),
      fields: this.extractFields(response.data),
      executionTime: response.headers['x-response-time'] || 0
    };
  }
  
  protected mapQueryToEndpoint(request: QueryRequest): EndpointConfig {
    // Map SQL-like query to REST endpoint
    if (request.table) {
      return {
        method: 'GET',
        url: `/${request.table}`,
        params: this.buildQueryParams(request)
      };
    }
    
    // Custom endpoint mapping
    const customEndpoint = this.endpoints.get(request.sql || '');
    if (customEndpoint) {
      return customEndpoint;
    }
    
    throw new Error('Cannot map query to endpoint');
  }
}

class RESTConnector extends BaseAPIConnector {
  async getAuthHeaders(): Promise<Record<string, string>> {
    switch (this.auth.type) {
      case 'bearer':
        return { Authorization: `Bearer ${this.auth.token}` };
      case 'basic':
        const encoded = Buffer.from(`${this.auth.username}:${this.auth.password}`).toString('base64');
        return { Authorization: `Basic ${encoded}` };
      case 'apikey':
        return { [this.auth.headerName || 'X-API-Key']: this.auth.key };
      default:
        return {};
    }
  }
}

class GraphQLConnector extends BaseAPIConnector {
  async query<T>(request: QueryRequest): Promise<QueryResult<T>> {
    const query = this.buildGraphQLQuery(request);
    
    const response = await this.client.post('/graphql', {
      query,
      variables: request.parameters
    });
    
    return this.parseGraphQLResponse(response.data);
  }
  
  protected buildGraphQLQuery(request: QueryRequest): string {
    // Convert SQL-like request to GraphQL
    if (request.table) {
      const fields = request.select?.join('\n    ') || 'id\n    name';
      return `
        query {
          ${request.table} {
            ${fields}
          }
        }
      `;
    }
    
    return request.sql || '';
  }
}
```

### 4. NoSQL Connectors

```typescript
abstract class BaseNoSQLConnector implements IDataConnector {
  protected client: any;
  protected database: string;
  
  abstract mapQueryToNoSQL(request: QueryRequest): any;
  
  async query<T>(request: QueryRequest): Promise<QueryResult<T>> {
    const noSqlQuery = this.mapQueryToNoSQL(request);
    const result = await this.executeNoSQL(noSqlQuery);
    
    return {
      rows: result as T[],
      rowCount: result.length,
      fields: this.extractFields(result),
      executionTime: 0
    };
  }
  
  abstract executeNoSQL(query: any): Promise<any[]>;
}

class MongoDBConnector extends BaseNoSQLConnector {
  async connect(config: MongoConnectionConfig) {
    const { MongoClient } = require('mongodb');
    this.client = new MongoClient(config.connectionString);
    await this.client.connect();
    this.database = config.database;
  }
  
  mapQueryToNoSQL(request: QueryRequest): any {
    const query: any = {};
    
    // Map WHERE clause to MongoDB query
    if (request.where) {
      request.where.forEach(condition => {
        query[condition.field] = this.mapCondition(condition);
      });
    }
    
    return {
      collection: request.table,
      query,
      projection: request.select ? 
        request.select.reduce((acc, field) => ({ ...acc, [field]: 1 }), {}) : 
        undefined,
      limit: request.limit,
      skip: request.offset,
      sort: request.orderBy ? 
        request.orderBy.reduce((acc, order) => ({ 
          ...acc, 
          [order.column]: order.direction === 'ASC' ? 1 : -1 
        }), {}) : 
        undefined
    };
  }
  
  async executeNoSQL(query: any): Promise<any[]> {
    const db = this.client.db(this.database);
    const collection = db.collection(query.collection);
    
    let cursor = collection.find(query.query);
    
    if (query.projection) cursor = cursor.project(query.projection);
    if (query.sort) cursor = cursor.sort(query.sort);
    if (query.skip) cursor = cursor.skip(query.skip);
    if (query.limit) cursor = cursor.limit(query.limit);
    
    return cursor.toArray();
  }
}
```

---

## Connector Registry & Factory

```typescript
class ConnectorRegistry {
  private static connectors = new Map<string, ConnectorConstructor>();
  
  static register(type: string, connector: ConnectorConstructor): void {
    this.connectors.set(type.toLowerCase(), connector);
  }
  
  static create(type: string, config: ConnectionConfig): IDataConnector {
    const ConnectorClass = this.connectors.get(type.toLowerCase());
    
    if (!ConnectorClass) {
      throw new Error(`Unknown connector type: ${type}`);
    }
    
    return new ConnectorClass(config);
  }
  
  static getAvailableTypes(): ConnectorInfo[] {
    return Array.from(this.connectors.entries()).map(([type, connector]) => ({
      type,
      name: connector.displayName,
      description: connector.description,
      configSchema: connector.configSchema,
      icon: connector.icon
    }));
  }
}

// Register all connectors
ConnectorRegistry.register('postgresql', PostgreSQLConnector);
ConnectorRegistry.register('mysql', MySQLConnector);
ConnectorRegistry.register('sqlserver', SQLServerConnector);
ConnectorRegistry.register('csv', CSVConnector);
ConnectorRegistry.register('excel', ExcelConnector);
ConnectorRegistry.register('json', JSONConnector);
ConnectorRegistry.register('rest', RESTConnector);
ConnectorRegistry.register('graphql', GraphQLConnector);
ConnectorRegistry.register('mongodb', MongoDBConnector);
```

---

## Connection Configuration Schemas

```typescript
// Base configuration all connectors share
interface ConnectionConfig {
  id: string;
  name: string;
  type: string;
  description?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// SQL databases
interface SQLConnectionConfig extends ConnectionConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
  poolSize?: number;
  connectionTimeout?: number;
}

// File-based
interface FileConnectionConfig extends ConnectionConfig {
  filePath: string;  // Can be local path or URL
  encoding?: string;
  delimiter?: string;  // For CSV
  sheet?: string;      // For Excel
}

// API-based
interface APIConnectionConfig extends ConnectionConfig {
  baseUrl: string;
  auth: AuthConfig;
  headers?: Record<string, string>;
  timeout?: number;
  retryConfig?: RetryConfig;
}

// NoSQL
interface MongoConnectionConfig extends ConnectionConfig {
  connectionString: string;
  database: string;
  authSource?: string;
  replicaSet?: string;
}

// Authentication configurations
type AuthConfig = 
  | { type: 'none' }
  | { type: 'basic'; username: string; password: string }
  | { type: 'bearer'; token: string }
  | { type: 'apikey'; key: string; headerName?: string }
  | { type: 'oauth2'; clientId: string; clientSecret: string; tokenUrl: string };
```

---

## Query Builder & Dialect Support

```typescript
enum SQLDialect {
  PostgreSQL = 'postgresql',
  MySQL = 'mysql',
  SQLServer = 'sqlserver',
  SQLite = 'sqlite',
  Oracle = 'oracle'
}

class QueryBuilder {
  constructor(private dialect: SQLDialect) {}
  
  build(request: QueryRequest): string {
    if (request.sql) {
      return request.sql;
    }
    
    let query = this.buildSelect(request);
    query += this.buildFrom(request);
    query += this.buildJoins(request);
    query += this.buildWhere(request);
    query += this.buildGroupBy(request);
    query += this.buildOrderBy(request);
    query += this.buildLimit(request);
    
    return query;
  }
  
  private buildSelect(request: QueryRequest): string {
    const columns = request.select?.join(', ') || '*';
    return `SELECT ${columns}`;
  }
  
  private buildLimit(request: QueryRequest): string {
    if (!request.limit) return '';
    
    switch (this.dialect) {
      case SQLDialect.PostgreSQL:
      case SQLDialect.MySQL:
      case SQLDialect.SQLite:
        return ` LIMIT ${request.limit}${request.offset ? ` OFFSET ${request.offset}` : ''}`;
      
      case SQLDialect.SQLServer:
        return ` OFFSET ${request.offset || 0} ROWS FETCH NEXT ${request.limit} ROWS ONLY`;
      
      case SQLDialect.Oracle:
        return ` FETCH FIRST ${request.limit} ROWS ONLY`;
      
      default:
        return '';
    }
  }
  
  // ... other builder methods
}
```

---

## Testing & Validation

```typescript
abstract class ConnectorTest {
  protected connector: IDataConnector;
  
  abstract createTestConfig(): ConnectionConfig;
  
  async runTests(): Promise<TestResults> {
    const results = new TestResults();
    
    // Connection tests
    results.add(await this.testConnect());
    results.add(await this.testDisconnect());
    results.add(await this.testReconnect());
    
    // Query tests
    results.add(await this.testSimpleQuery());
    results.add(await this.testComplexQuery());
    results.add(await this.testInvalidQuery());
    
    // Schema tests
    results.add(await this.testSchemaDiscovery());
    results.add(await this.testTableList());
    
    // Performance tests
    results.add(await this.testQueryPerformance());
    results.add(await this.testConcurrentQueries());
    
    return results;
  }
  
  protected async testConnect(): Promise<TestResult> {
    try {
      const config = this.createTestConfig();
      this.connector = ConnectorRegistry.create(config.type, config);
      await this.connector.connect(config);
      return TestResult.pass('Connection successful');
    } catch (error) {
      return TestResult.fail('Connection failed', error);
    }
  }
}

// Example test for PostgreSQL
class PostgreSQLConnectorTest extends ConnectorTest {
  createTestConfig(): ConnectionConfig {
    return {
      id: 'test-postgres',
      name: 'Test PostgreSQL',
      type: 'postgresql',
      host: process.env.TEST_PG_HOST || 'localhost',
      port: parseInt(process.env.TEST_PG_PORT || '5432'),
      database: process.env.TEST_PG_DB || 'testdb',
      user: process.env.TEST_PG_USER || 'testuser',
      password: process.env.TEST_PG_PASS || 'testpass'
    };
  }
}
```

---

## Usage Examples

```typescript
// 1. Create and connect to PostgreSQL
const pgConnector = ConnectorRegistry.create('postgresql', {
  id: 'main-db',
  name: 'Main Database',
  type: 'postgresql',
  host: 'db.example.com',
  port: 5432,
  database: 'production',
  user: 'app_user',
  password: 'secure_password'
});

await pgConnector.connect();

// 2. Execute a query
const result = await pgConnector.query({
  table: 'brands',
  select: ['brand_name', 'total_sales'],
  where: [
    { field: 'category', operator: '=', value: 'Electronics' },
    { field: 'total_sales', operator: '>', value: 1000000 }
  ],
  orderBy: [{ column: 'total_sales', direction: 'DESC' }],
  limit: 10
});

// 3. Connect to CSV file
const csvConnector = ConnectorRegistry.create('csv', {
  id: 'sales-csv',
  name: 'Sales Data CSV',
  type: 'csv',
  filePath: 'https://example.com/sales-data.csv'
});

await csvConnector.connect();

// 4. Query CSV data with SQL
const csvResult = await csvConnector.query({
  sql: `
    SELECT 
      Region, 
      SUM(Amount) as TotalSales,
      COUNT(*) as TransactionCount
    FROM data
    WHERE Date >= '2024-01-01'
    GROUP BY Region
    ORDER BY TotalSales DESC
  `
});

// 5. Connect to REST API
const apiConnector = ConnectorRegistry.create('rest', {
  id: 'crm-api',
  name: 'CRM System API',
  type: 'rest',
  baseUrl: 'https://api.crm.example.com/v2',
  auth: {
    type: 'bearer',
    token: process.env.CRM_API_TOKEN
  }
});

// Map endpoints
apiConnector.mapEndpoints([
  {
    name: 'customers',
    path: '/customers',
    method: 'GET',
    responseMapping: {
      rows: 'data.customers',
      total: 'data.total'
    }
  }
]);

// 6. Stream large results
const stream = pgConnector.queryStream({
  table: 'transactions',
  where: [{ field: 'date', operator: '>=', value: '2024-01-01' }]
});

for await (const row of stream) {
  // Process each row without loading all into memory
  await processTransaction(row);
}
```

---

## Summary

This connector architecture provides:

1. **Flexibility**: Easy to add new connector types
2. **Type Safety**: Full TypeScript support with generics
3. **Performance**: Connection pooling, streaming, caching
4. **Security**: Built-in credential encryption, query sanitization
5. **Testability**: Comprehensive test framework
6. **Extensibility**: Plugin-based architecture

The system can connect to virtually any data source while maintaining a consistent API for the dashboard application.