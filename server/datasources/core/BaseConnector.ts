import {
  IDataConnector,
  ConnectionConfig,
  ConnectionTestResult,
  QueryRequest,
  QueryResult,
  DatabaseSchema,
  TableInfo,
  ConnectorCapabilities,
  ConnectorMetadata,
  ConnectionError,
  QueryError,
  DataType,
  FieldInfo
} from './types';

/**
 * Base connector class that all data connectors inherit from
 */
export abstract class BaseConnector implements IDataConnector {
  protected config: ConnectionConfig;
  protected connected: boolean = false;
  protected connectionStartTime?: Date;

  constructor(config: ConnectionConfig) {
    this.config = config;
  }

  // Abstract methods that must be implemented by subclasses
  abstract connect(config: ConnectionConfig): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract query<T = any>(request: QueryRequest): Promise<QueryResult<T>>;
  abstract getSchema(): Promise<DatabaseSchema>;
  abstract getTables(): Promise<TableInfo[]>;
  abstract getTableSchema(tableName: string): Promise<TableInfo>;
  abstract getCapabilities(): ConnectorCapabilities;
  abstract getMetadata(): ConnectorMetadata;

  // Common implementation methods
  isConnected(): boolean {
    return this.connected;
  }

  async testConnection(): Promise<ConnectionTestResult> {
    const startTime = Date.now();
    
    try {
      // If not connected, try to connect
      if (!this.connected) {
        await this.connect(this.config);
      }

      // Run a simple test query
      const testResult = await this.runTestQuery();
      
      const latency = Date.now() - startTime;

      return {
        success: true,
        message: 'Connection successful',
        details: {
          latency,
          ...testResult
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Connection failed: ${error.message}`,
        error: error as Error
      };
    }
  }

  // Default streaming implementation - can be overridden for better performance
  async *queryStream<T = any>(request: QueryRequest): AsyncIterableIterator<T> {
    const result = await this.query<T>(request);
    for (const row of result.rows) {
      yield row;
    }
  }

  // Helper methods for subclasses
  protected async runTestQuery(): Promise<any> {
    // Default test query - subclasses can override
    try {
      const result = await this.query({
        sql: 'SELECT 1 as test'
      });
      return { rows: result.rowCount };
    } catch {
      // If SELECT 1 fails, just return success
      return { connected: true };
    }
  }

  protected validateConnection(): void {
    if (!this.connected) {
      throw new ConnectionError('Not connected to data source');
    }
  }

  protected async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    retryDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on certain errors
        if (this.isNonRetryableError(error)) {
          throw error;
        }

        if (attempt < maxRetries) {
          await this.delay(retryDelay * Math.pow(2, attempt - 1));
        }
      }
    }

    throw lastError!;
  }

  protected isNonRetryableError(error: any): boolean {
    // Syntax errors, permission errors, etc. shouldn't be retried
    const nonRetryableMessages = [
      'syntax error',
      'permission denied',
      'access denied',
      'authentication failed',
      'invalid query'
    ];

    const errorMessage = error?.message?.toLowerCase() || '';
    return nonRetryableMessages.some(msg => errorMessage.includes(msg));
  }

  protected delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  protected buildQueryFromRequest(request: QueryRequest): string {
    if (request.sql) {
      return request.sql;
    }

    // Build SQL from structured query
    let query = this.buildSelect(request);
    query += this.buildFrom(request);
    query += this.buildJoins(request);
    query += this.buildWhere(request);
    query += this.buildGroupBy(request);
    query += this.buildHaving(request);
    query += this.buildOrderBy(request);
    query += this.buildLimit(request);

    return query;
  }

  protected buildSelect(request: QueryRequest): string {
    const columns = request.select?.join(', ') || '*';
    return `SELECT ${columns}`;
  }

  protected buildFrom(request: QueryRequest): string {
    if (!request.table) {
      throw new QueryError('Table name is required');
    }
    return ` FROM ${request.table}`;
  }

  protected buildJoins(request: QueryRequest): string {
    if (!request.joins || request.joins.length === 0) {
      return '';
    }

    return request.joins.map(join => {
      return ` ${join.type} JOIN ${join.table} ON ${join.on.leftField} ${join.on.operator} ${join.on.rightField}`;
    }).join('');
  }

  protected buildWhere(request: QueryRequest): string {
    if (!request.where || request.where.length === 0) {
      return '';
    }

    const conditions = this.buildConditions(request.where);
    return ` WHERE ${conditions}`;
  }

  protected buildConditions(clauses: any[]): string {
    return clauses.map(clause => {
      if (clause.and) {
        return `(${this.buildConditions(clause.and).split(' AND ').join(' AND ')})`;
      }
      if (clause.or) {
        return `(${this.buildConditions(clause.or).split(' OR ').join(' OR ')})`;
      }

      const value = this.formatValue(clause.value, clause.operator);
      return `${clause.field} ${clause.operator} ${value}`;
    }).join(' AND ');
  }

  protected formatValue(value: any, operator: string): string {
    if (operator === 'IS NULL' || operator === 'IS NOT NULL') {
      return '';
    }

    if (operator === 'IN' || operator === 'NOT IN') {
      if (Array.isArray(value)) {
        return `(${value.map(v => this.escapeValue(v)).join(', ')})`;
      }
      return `(${this.escapeValue(value)})`;
    }

    if (operator === 'BETWEEN' || operator === 'NOT BETWEEN') {
      if (Array.isArray(value) && value.length === 2) {
        return `${this.escapeValue(value[0])} AND ${this.escapeValue(value[1])}`;
      }
      throw new QueryError('BETWEEN operator requires array with 2 values');
    }

    return this.escapeValue(value);
  }

  protected escapeValue(value: any): string {
    if (value === null || value === undefined) {
      return 'NULL';
    }

    if (typeof value === 'string') {
      // Basic SQL injection prevention - subclasses should use proper parameterization
      return `'${value.replace(/'/g, "''")}'`;
    }

    if (typeof value === 'boolean') {
      return value ? 'TRUE' : 'FALSE';
    }

    if (value instanceof Date) {
      return `'${value.toISOString()}'`;
    }

    return String(value);
  }

  protected buildGroupBy(request: QueryRequest): string {
    if (!request.groupBy || request.groupBy.length === 0) {
      return '';
    }
    return ` GROUP BY ${request.groupBy.join(', ')}`;
  }

  protected buildHaving(request: QueryRequest): string {
    if (!request.having || request.having.length === 0) {
      return '';
    }
    const conditions = this.buildConditions(request.having);
    return ` HAVING ${conditions}`;
  }

  protected buildOrderBy(request: QueryRequest): string {
    if (!request.orderBy || request.orderBy.length === 0) {
      return '';
    }
    const orderClauses = request.orderBy.map(
      order => `${order.column} ${order.direction}`
    ).join(', ');
    return ` ORDER BY ${orderClauses}`;
  }

  protected buildLimit(request: QueryRequest): string {
    if (!request.limit) {
      return '';
    }
    
    let limitClause = ` LIMIT ${request.limit}`;
    if (request.offset) {
      limitClause += ` OFFSET ${request.offset}`;
    }
    
    return limitClause;
  }

  // Helper to map native database types to common DataType enum
  protected mapNativeTypeToDataType(nativeType: string): DataType {
    const typeMap: Record<string, DataType> = {
      // String types
      'varchar': DataType.String,
      'char': DataType.String,
      'text': DataType.String,
      'nvarchar': DataType.String,
      'nchar': DataType.String,
      'string': DataType.String,
      
      // Number types
      'int': DataType.Number,
      'integer': DataType.Number,
      'bigint': DataType.Number,
      'smallint': DataType.Number,
      'tinyint': DataType.Number,
      'decimal': DataType.Number,
      'numeric': DataType.Number,
      'float': DataType.Number,
      'double': DataType.Number,
      'real': DataType.Number,
      'number': DataType.Number,
      
      // Boolean types
      'boolean': DataType.Boolean,
      'bool': DataType.Boolean,
      'bit': DataType.Boolean,
      
      // Date/Time types
      'date': DataType.Date,
      'datetime': DataType.DateTime,
      'timestamp': DataType.DateTime,
      'time': DataType.Time,
      
      // JSON types
      'json': DataType.JSON,
      'jsonb': DataType.JSON,
      
      // Binary types
      'binary': DataType.Binary,
      'varbinary': DataType.Binary,
      'blob': DataType.Binary,
      'bytea': DataType.Binary
    };

    const normalizedType = nativeType.toLowerCase();
    
    // Check exact match first
    if (typeMap[normalizedType]) {
      return typeMap[normalizedType];
    }

    // Check if type contains known patterns
    for (const [pattern, dataType] of Object.entries(typeMap)) {
      if (normalizedType.includes(pattern)) {
        return dataType;
      }
    }

    return DataType.Unknown;
  }

  // Helper to extract field info from result metadata
  protected extractFieldInfo(fields: any[]): FieldInfo[] {
    return fields.map(field => ({
      name: field.name || field.column_name || 'unknown',
      type: this.mapNativeTypeToDataType(field.type || field.data_type || ''),
      nullable: field.nullable ?? true,
      maxLength: field.max_length || field.character_maximum_length,
      precision: field.precision || field.numeric_precision,
      scale: field.scale || field.numeric_scale
    }));
  }

  // Helper to format query result consistently
  protected formatQueryResult<T>(
    rows: T[],
    fields: any[],
    executionTime: number
  ): QueryResult<T> {
    return {
      rows,
      rowCount: rows.length,
      fields: this.extractFieldInfo(fields),
      executionTime
    };
  }
}