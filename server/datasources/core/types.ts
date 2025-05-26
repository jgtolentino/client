/**
 * Core types for the data abstraction layer
 */

// Connection configuration types
export interface ConnectionConfig {
  id: string;
  name: string;
  type: string;
  description?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SQLConnectionConfig extends ConnectionConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
  poolSize?: number;
  connectionTimeout?: number;
}

export interface FileConnectionConfig extends ConnectionConfig {
  filePath: string;  // Can be local path or URL
  encoding?: string;
  delimiter?: string;  // For CSV
  sheet?: string;      // For Excel
}

export interface APIConnectionConfig extends ConnectionConfig {
  baseUrl: string;
  auth: AuthConfig;
  headers?: Record<string, string>;
  timeout?: number;
  retryConfig?: RetryConfig;
}

// Authentication types
export type AuthConfig = 
  | { type: 'none' }
  | { type: 'basic'; username: string; password: string }
  | { type: 'bearer'; token: string }
  | { type: 'apikey'; key: string; headerName?: string }
  | { type: 'oauth2'; clientId: string; clientSecret: string; tokenUrl: string };

export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier?: number;
}

// Query types
export interface QueryRequest {
  // Raw SQL query (highest priority)
  sql?: string;
  
  // Table-based query building
  table?: string;
  select?: string[];
  where?: WhereClause[];
  joins?: JoinClause[];
  groupBy?: string[];
  having?: WhereClause[];
  orderBy?: OrderClause[];
  limit?: number;
  offset?: number;
  
  // Additional options
  parameters?: any[];
  timeout?: number;
  maxRows?: number;
}

export interface WhereClause {
  field: string;
  operator: ComparisonOperator;
  value: any;
  and?: WhereClause[];
  or?: WhereClause[];
}

export type ComparisonOperator = 
  | '=' | '!=' | '<' | '<=' | '>' | '>=' 
  | 'LIKE' | 'NOT LIKE' | 'IN' | 'NOT IN' 
  | 'IS NULL' | 'IS NOT NULL'
  | 'BETWEEN' | 'NOT BETWEEN';

export interface JoinClause {
  type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
  table: string;
  on: {
    leftField: string;
    operator: ComparisonOperator;
    rightField: string;
  };
}

export interface OrderClause {
  column: string;
  direction: 'ASC' | 'DESC';
}

// Query result types
export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
  fields: FieldInfo[];
  executionTime: number;
  affectedRows?: number;
  metadata?: Record<string, any>;
}

export interface FieldInfo {
  name: string;
  type: DataType;
  nullable: boolean;
  primaryKey?: boolean;
  foreignKey?: boolean;
  maxLength?: number;
  precision?: number;
  scale?: number;
}

export enum DataType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Date = 'date',
  DateTime = 'datetime',
  Time = 'time',
  JSON = 'json',
  Binary = 'binary',
  Unknown = 'unknown'
}

// Schema discovery types
export interface DatabaseSchema {
  name: string;
  tables: TableInfo[];
  relationships: RelationshipInfo[];
  views?: ViewInfo[];
  procedures?: ProcedureInfo[];
}

export interface TableInfo {
  name: string;
  schema?: string;
  columns: ColumnInfo[];
  primaryKey?: string[];
  indexes?: IndexInfo[];
  rowCount?: number;
}

export interface ColumnInfo {
  name: string;
  type: DataType;
  nativeType: string;
  nullable: boolean;
  defaultValue?: any;
  primaryKey?: boolean;
  foreignKey?: ForeignKeyInfo;
  autoIncrement?: boolean;
  unique?: boolean;
}

export interface ForeignKeyInfo {
  constraintName: string;
  referencedTable: string;
  referencedColumn: string;
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
  onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
}

export interface RelationshipInfo {
  name: string;
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

export interface IndexInfo {
  name: string;
  columns: string[];
  unique: boolean;
  type?: 'btree' | 'hash' | 'gin' | 'gist';
}

export interface ViewInfo {
  name: string;
  definition: string;
  columns: ColumnInfo[];
}

export interface ProcedureInfo {
  name: string;
  parameters: ParameterInfo[];
  returnType?: DataType;
}

export interface ParameterInfo {
  name: string;
  type: DataType;
  direction: 'IN' | 'OUT' | 'INOUT';
  defaultValue?: any;
}

// Connection test result
export interface ConnectionTestResult {
  success: boolean;
  message: string;
  details?: {
    version?: string;
    serverInfo?: Record<string, any>;
    latency?: number;
  };
  error?: Error;
}

// Connector capabilities
export interface ConnectorCapabilities {
  supportsStreaming: boolean;
  supportsTransactions: boolean;
  supportsBatchOperations: boolean;
  supportsSchemaDiscovery: boolean;
  supportsStoredProcedures: boolean;
  supportsViews: boolean;
  maxQuerySize?: number;
  maxResultSize?: number;
}

// Connector metadata
export interface ConnectorMetadata {
  name: string;
  displayName: string;
  description: string;
  version: string;
  author: string;
  icon?: string;
  configSchema: Record<string, any>;  // JSON Schema
}

// Base connector interface
export interface IDataConnector {
  // Lifecycle
  connect(config: ConnectionConfig): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  testConnection(): Promise<ConnectionTestResult>;
  
  // Query execution
  query<T = any>(request: QueryRequest): Promise<QueryResult<T>>;
  queryStream<T = any>(request: QueryRequest): AsyncIterableIterator<T>;
  
  // Schema discovery
  getSchema(): Promise<DatabaseSchema>;
  getTables(): Promise<TableInfo[]>;
  getTableSchema(tableName: string): Promise<TableInfo>;
  
  // Metadata
  getCapabilities(): ConnectorCapabilities;
  getMetadata(): ConnectorMetadata;
}

// SQL-specific connector interface
export interface ISQLConnector extends IDataConnector {
  executeRaw(sql: string, params?: any[]): Promise<any>;
  beginTransaction(): Promise<Transaction>;
  supportsTransactions(): boolean;
}

// Transaction interface
export interface Transaction {
  commit(): Promise<void>;
  rollback(): Promise<void>;
  query<T = any>(request: QueryRequest): Promise<QueryResult<T>>;
}

// File-specific connector interface
export interface IFileConnector extends IDataConnector {
  supportedFormats(): FileFormat[];
  parseFile(file: Buffer, format: FileFormat): Promise<any[]>;
  watchFile?(path: string, callback: FileChangeCallback): void;
}

export enum FileFormat {
  CSV = 'csv',
  TSV = 'tsv',
  JSON = 'json',
  JSONL = 'jsonl',
  XLSX = 'xlsx',
  XLS = 'xls',
  XML = 'xml',
  Parquet = 'parquet'
}

export type FileChangeCallback = (event: 'add' | 'change' | 'unlink', path: string) => void;

// API-specific connector interface
export interface IAPIConnector extends IDataConnector {
  setAuthentication(auth: AuthConfig): void;
  mapEndpoints(mapping: EndpointMapping[]): void;
  handlePagination(config: PaginationConfig): void;
}

export interface EndpointMapping {
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  parameters?: ParameterMapping[];
  responseMapping?: ResponseMapping;
}

export interface ParameterMapping {
  from: string;
  to: string;
  type: 'query' | 'path' | 'body' | 'header';
}

export interface ResponseMapping {
  rows: string;  // JSON path to data array
  total?: string;  // JSON path to total count
  nextPage?: string;  // JSON path to next page token
}

export interface PaginationConfig {
  type: 'offset' | 'cursor' | 'page';
  pageSize: number;
  pageSizeParam?: string;
  pageParam?: string;
  offsetParam?: string;
  cursorParam?: string;
}

// Error types
export class ConnectorError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ConnectorError';
  }
}

export class ConnectionError extends ConnectorError {
  constructor(message: string, details?: any) {
    super(message, 'CONNECTION_ERROR', details);
    this.name = 'ConnectionError';
  }
}

export class QueryError extends ConnectorError {
  constructor(message: string, public query?: string, details?: any) {
    super(message, 'QUERY_ERROR', details);
    this.name = 'QueryError';
  }
}

export class SchemaError extends ConnectorError {
  constructor(message: string, details?: any) {
    super(message, 'SCHEMA_ERROR', details);
    this.name = 'SchemaError';
  }
}