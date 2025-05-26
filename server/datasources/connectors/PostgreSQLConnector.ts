import { BaseConnector } from '../core/BaseConnector';
import type { 
  QueryRequest, 
  QueryResult, 
  ConnectionConfig, 
  ConnectorMetadata,
  SchemaInfo,
  TableSchema
} from '../core/types';
import { Pool, PoolClient, QueryResultRow } from 'pg';
import QueryStream from 'pg-query-stream';
import { Readable } from 'stream';

interface PostgreSQLConfig extends ConnectionConfig {
  host: string;
  port?: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean | {
    rejectUnauthorized?: boolean;
    ca?: string;
    cert?: string;
    key?: string;
  };
  connectionTimeoutMillis?: number;
  idleTimeoutMillis?: number;
  max?: number;
}

export class PostgreSQLConnector extends BaseConnector {
  private pool: Pool | null = null;
  private config: PostgreSQLConfig | null = null;

  constructor(metadata: ConnectorMetadata) {
    super(metadata);
  }

  async connect(config: PostgreSQLConfig): Promise<void> {
    try {
      this.config = config;
      
      this.pool = new Pool({
        host: config.host,
        port: config.port || 5432,
        database: config.database,
        user: config.user,
        password: config.password,
        ssl: config.ssl,
        connectionTimeoutMillis: config.connectionTimeoutMillis || 30000,
        idleTimeoutMillis: config.idleTimeoutMillis || 30000,
        max: config.max || 20
      });

      // Test connection
      const client = await this.pool.connect();
      await client.query('SELECT 1');
      client.release();

      this._connected = true;
    } catch (error) {
      throw new Error(`Failed to connect to PostgreSQL: ${error.message}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
    this._connected = false;
  }

  async query(request: QueryRequest): Promise<QueryResult> {
    if (!this._connected || !this.pool) {
      throw new Error('Not connected to database');
    }

    const startTime = Date.now();
    let sql = request.sql || '';
    const params: any[] = [];

    // Build SQL if not provided
    if (!sql && request.table) {
      sql = this.buildParameterizedSQL(request, params);
    }

    // Add query timeout if specified
    const queryConfig = {
      text: sql,
      values: params,
      query_timeout: request.timeout || 60000
    };

    let client: PoolClient | null = null;
    
    try {
      client = await this.pool.connect();
      
      // Set statement timeout
      if (request.timeout) {
        await client.query(`SET statement_timeout = ${request.timeout}`);
      }

      const result = await client.query(queryConfig);
      const executionTime = Date.now() - startTime;

      return {
        data: result.rows,
        metadata: {
          rowCount: result.rowCount || 0,
          executionTime,
          sql,
          affectedRows: result.rowCount
        }
      };
    } catch (error) {
      throw new Error(`Query failed: ${error.message}`);
    } finally {
      if (client) client.release();
    }
  }

  async queryStream(request: QueryRequest): AsyncIterable<any> {
    if (!this._connected || !this.pool) {
      throw new Error('Not connected to database');
    }

    const sql = this.buildSQL(request);
    const client = await this.pool.connect();
    
    const queryStream = new QueryStream(sql);
    const stream = client.query(queryStream);

    // Convert Node.js stream to async iterable
    async function* streamToAsyncIterator(stream: Readable) {
      for await (const chunk of stream) {
        yield chunk;
      }
      client.release();
    }

    return streamToAsyncIterator(stream);
  }

  async getSchema(): Promise<SchemaInfo> {
    if (!this._connected || !this.pool) {
      throw new Error('Not connected to database');
    }

    const tablesQuery = `
      SELECT 
        schemaname,
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
        n_live_tup as estimated_rows
      FROM pg_tables t
      LEFT JOIN pg_stat_user_tables s ON t.tablename = s.relname
      WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
      ORDER BY schemaname, tablename
    `;

    const result = await this.pool.query(tablesQuery);
    const tables: TableSchema[] = [];

    for (const row of result.rows) {
      const schema = await this.getTableSchema(row.tablename, row.schemaname);
      tables.push(schema);
    }

    return {
      connectorType: 'postgresql',
      connectorVersion: '1.0.0',
      capabilities: {
        sql: true,
        joins: true,
        aggregations: true,
        transactions: true,
        streaming: true,
        schemas: true,
        views: true,
        procedures: true,
        triggers: true
      },
      tables
    };
  }

  async getTableSchema(tableName: string, schemaName: string = 'public'): Promise<TableSchema> {
    if (!this._connected || !this.pool) {
      throw new Error('Not connected to database');
    }

    // Get column information
    const columnsQuery = `
      SELECT 
        column_name,
        data_type,
        character_maximum_length,
        numeric_precision,
        numeric_scale,
        is_nullable,
        column_default,
        is_identity,
        identity_generation
      FROM information_schema.columns
      WHERE table_schema = $1 AND table_name = $2
      ORDER BY ordinal_position
    `;

    const columnsResult = await this.pool.query(columnsQuery, [schemaName, tableName]);

    const columns = columnsResult.rows.map(col => ({
      name: col.column_name,
      type: this.mapPostgreSQLType(col.data_type),
      nullable: col.is_nullable === 'YES',
      primaryKey: false, // Will be updated below
      defaultValue: col.column_default,
      maxLength: col.character_maximum_length,
      precision: col.numeric_precision,
      scale: col.numeric_scale,
      identity: col.is_identity === 'YES',
      identityGeneration: col.identity_generation
    }));

    // Get primary key information
    const pkQuery = `
      SELECT a.attname
      FROM pg_index i
      JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
      WHERE i.indrelid = ($1 || '.' || $2)::regclass AND i.indisprimary
    `;

    const pkResult = await this.pool.query(pkQuery, [schemaName, tableName]);
    const primaryKeys = new Set(pkResult.rows.map(row => row.attname));

    // Update primary key flags
    columns.forEach(col => {
      col.primaryKey = primaryKeys.has(col.name);
    });

    // Get indexes
    const indexQuery = `
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = $1 AND tablename = $2
    `;

    const indexResult = await this.pool.query(indexQuery, [schemaName, tableName]);

    // Get foreign keys
    const fkQuery = `
      SELECT
        tc.constraint_name,
        kcu.column_name,
        ccu.table_schema AS foreign_table_schema,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_schema = $1
        AND tc.table_name = $2
    `;

    const fkResult = await this.pool.query(fkQuery, [schemaName, tableName]);

    // Get row count (estimate for large tables)
    const countQuery = `
      SELECT n_live_tup as count
      FROM pg_stat_user_tables
      WHERE schemaname = $1 AND relname = $2
    `;

    const countResult = await this.pool.query(countQuery, [schemaName, tableName]);
    const rowCount = countResult.rows[0]?.count || 0;

    // Get sample data
    const sampleResult = await this.pool.query(
      `SELECT * FROM ${schemaName}.${tableName} LIMIT 5`
    );

    return {
      name: tableName,
      schema: schemaName,
      columns,
      rowCount,
      indexes: indexResult.rows.map(idx => ({
        name: idx.indexname,
        definition: idx.indexdef
      })),
      foreignKeys: fkResult.rows.map(fk => ({
        constraint: fk.constraint_name,
        column: fk.column_name,
        referencedTable: `${fk.foreign_table_schema}.${fk.foreign_table_name}`,
        referencedColumn: fk.foreign_column_name
      })),
      sampleData: sampleResult.rows
    };
  }

  // Advanced PostgreSQL features

  async executeTransaction(queries: string[]): Promise<QueryResult[]> {
    if (!this._connected || !this.pool) {
      throw new Error('Not connected to database');
    }

    const client = await this.pool.connect();
    const results: QueryResult[] = [];

    try {
      await client.query('BEGIN');

      for (const query of queries) {
        const result = await client.query(query);
        results.push({
          data: result.rows,
          metadata: {
            rowCount: result.rowCount || 0,
            affectedRows: result.rowCount
          }
        });
      }

      await client.query('COMMIT');
      return results;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Transaction failed: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async createMaterializedView(viewName: string, query: string, refresh?: boolean): Promise<void> {
    if (!this._connected || !this.pool) {
      throw new Error('Not connected to database');
    }

    const sql = `CREATE MATERIALIZED VIEW ${viewName} AS ${query}`;
    await this.pool.query(sql);

    if (refresh) {
      await this.pool.query(`REFRESH MATERIALIZED VIEW ${viewName}`);
    }
  }

  async refreshMaterializedView(viewName: string, concurrent?: boolean): Promise<void> {
    if (!this._connected || !this.pool) {
      throw new Error('Not connected to database');
    }

    const sql = `REFRESH MATERIALIZED VIEW ${concurrent ? 'CONCURRENTLY' : ''} ${viewName}`;
    await this.pool.query(sql);
  }

  async explain(query: string, analyze?: boolean): Promise<any> {
    if (!this._connected || !this.pool) {
      throw new Error('Not connected to database');
    }

    const sql = `EXPLAIN ${analyze ? 'ANALYZE' : ''} ${query}`;
    const result = await this.pool.query(sql);
    
    return {
      plan: result.rows.map(row => row['QUERY PLAN']),
      raw: result.rows
    };
  }

  async vacuum(tableName?: string, analyze?: boolean): Promise<void> {
    if (!this._connected || !this.pool) {
      throw new Error('Not connected to database');
    }

    const sql = `VACUUM ${analyze ? 'ANALYZE' : ''} ${tableName || ''}`;
    await this.pool.query(sql);
  }

  async copyFromCSV(tableName: string, csvData: string, options?: {
    delimiter?: string;
    header?: boolean;
    columns?: string[];
  }): Promise<number> {
    if (!this._connected || !this.pool) {
      throw new Error('Not connected to database');
    }

    const client = await this.pool.connect();
    
    try {
      const copyOptions = [];
      if (options?.delimiter) copyOptions.push(`DELIMITER '${options.delimiter}'`);
      if (options?.header) copyOptions.push('HEADER');
      
      const columns = options?.columns ? `(${options.columns.join(', ')})` : '';
      const sql = `COPY ${tableName}${columns} FROM STDIN ${copyOptions.length ? `WITH (${copyOptions.join(', ')})` : ''}`;
      
      const stream = client.query(sql);
      stream.write(csvData);
      stream.end();
      
      await new Promise((resolve, reject) => {
        stream.on('finish', resolve);
        stream.on('error', reject);
      });
      
      // Get the number of rows copied
      const countResult = await client.query(`SELECT COUNT(*) FROM ${tableName}`);
      return parseInt(countResult.rows[0].count);
    } finally {
      client.release();
    }
  }

  async listen(channel: string, callback: (payload: string) => void): Promise<void> {
    if (!this._connected || !this.pool) {
      throw new Error('Not connected to database');
    }

    const client = await this.pool.connect();
    
    client.on('notification', (msg) => {
      if (msg.channel === channel) {
        callback(msg.payload || '');
      }
    });
    
    await client.query(`LISTEN ${channel}`);
  }

  async notify(channel: string, payload?: string): Promise<void> {
    if (!this._connected || !this.pool) {
      throw new Error('Not connected to database');
    }

    const sql = payload 
      ? `NOTIFY ${channel}, '${payload}'`
      : `NOTIFY ${channel}`;
    
    await this.pool.query(sql);
  }

  private buildParameterizedSQL(request: QueryRequest, params: any[]): string {
    let paramIndex = 1;
    const conditions: string[] = [];

    if (request.filters) {
      request.filters.forEach(filter => {
        conditions.push(`${filter.column} ${filter.operator} $${paramIndex}`);
        params.push(filter.value);
        paramIndex++;
      });
    }

    const orderBy = request.orderBy?.map(o => 
      `${o.column} ${o.direction || 'ASC'}`
    ).join(', ');

    let sql = `SELECT ${request.columns?.join(', ') || '*'} 
               FROM ${request.table}
               ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}
               ${request.groupBy ? `GROUP BY ${request.groupBy.join(', ')}` : ''}
               ${orderBy ? `ORDER BY ${orderBy}` : ''}`;

    if (request.limit) {
      sql += ` LIMIT ${request.limit}`;
    }
    if (request.offset) {
      sql += ` OFFSET ${request.offset}`;
    }

    return sql;
  }

  private buildSQL(request: QueryRequest): string {
    if (request.sql) return request.sql;

    const conditions = request.filters?.map(f => 
      `${f.column} ${f.operator} '${f.value}'`
    ).join(' AND ');

    const orderBy = request.orderBy?.map(o => 
      `${o.column} ${o.direction || 'ASC'}`
    ).join(', ');

    return `SELECT ${request.columns?.join(', ') || '*'} 
           FROM ${request.table}
           ${conditions ? `WHERE ${conditions}` : ''}
           ${request.groupBy ? `GROUP BY ${request.groupBy.join(', ')}` : ''}
           ${orderBy ? `ORDER BY ${orderBy}` : ''}
           ${request.limit ? `LIMIT ${request.limit}` : ''}
           ${request.offset ? `OFFSET ${request.offset}` : ''}`;
  }

  private mapPostgreSQLType(pgType: string): string {
    const typeMap: Record<string, string> = {
      'integer': 'integer',
      'bigint': 'bigint',
      'smallint': 'integer',
      'numeric': 'decimal',
      'decimal': 'decimal',
      'real': 'float',
      'double precision': 'float',
      'character varying': 'string',
      'varchar': 'string',
      'character': 'string',
      'char': 'string',
      'text': 'string',
      'boolean': 'boolean',
      'date': 'date',
      'timestamp': 'timestamp',
      'timestamp without time zone': 'timestamp',
      'timestamp with time zone': 'timestamp',
      'time': 'time',
      'json': 'json',
      'jsonb': 'json',
      'uuid': 'uuid',
      'bytea': 'binary',
      'ARRAY': 'array'
    };

    return typeMap[pgType.toLowerCase()] || 'string';
  }
}