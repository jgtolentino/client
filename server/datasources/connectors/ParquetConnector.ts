import { BaseConnector } from '../core/BaseConnector';
import type { 
  QueryRequest, 
  QueryResult, 
  ConnectionConfig, 
  ConnectorMetadata,
  SchemaInfo,
  TableSchema
} from '../core/types';
import * as duckdb from 'duckdb';
import { promises as fs } from 'fs';
import path from 'path';
import { Readable } from 'stream';

interface ParquetConfig extends ConnectionConfig {
  filePath?: string;
  storageUrl?: string;
  storageType?: 'local' | 'azure' | 's3';
  connectionString?: string;
  azureConnectionString?: string;
  azureContainerName?: string;
  s3Bucket?: string;
  s3Region?: string;
  s3AccessKeyId?: string;
  s3SecretAccessKey?: string;
}

interface ParquetTable {
  name: string;
  path: string;
  rowCount?: number;
  size?: number;
  lastModified?: Date;
}

export class ParquetConnector extends BaseConnector {
  private db: duckdb.Database | null = null;
  private connection: duckdb.Connection | null = null;
  private tables: Map<string, ParquetTable> = new Map();
  private config: ParquetConfig = {};

  constructor(metadata: ConnectorMetadata) {
    super(metadata);
  }

  async connect(config: ParquetConfig): Promise<void> {
    try {
      this.config = config;
      
      // Initialize DuckDB in-memory database
      this.db = new duckdb.Database(':memory:');
      this.connection = this.db.connect();

      // Configure DuckDB extensions
      await this.executeDuckDB("INSTALL parquet");
      await this.executeDuckDB("LOAD parquet");

      // Configure cloud storage if needed
      if (config.storageType === 'azure' && config.azureConnectionString) {
        await this.executeDuckDB("INSTALL azure");
        await this.executeDuckDB("LOAD azure");
        await this.executeDuckDB(`SET azure_storage_connection_string='${config.azureConnectionString}'`);
      } else if (config.storageType === 's3' && config.s3AccessKeyId && config.s3SecretAccessKey) {
        await this.executeDuckDB("INSTALL httpfs");
        await this.executeDuckDB("LOAD httpfs");
        await this.executeDuckDB(`SET s3_region='${config.s3Region || 'us-east-1'}'`);
        await this.executeDuckDB(`SET s3_access_key_id='${config.s3AccessKeyId}'`);
        await this.executeDuckDB(`SET s3_secret_access_key='${config.s3SecretAccessKey}'`);
      }

      // Load initial Parquet files
      if (config.filePath) {
        await this.loadParquetFile(config.filePath);
      }

      this._connected = true;
    } catch (error) {
      throw new Error(`Failed to connect to Parquet: ${error.message}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
    if (this.db) {
      this.db.close();
      this.db = null;
    }
    this.tables.clear();
    this._connected = false;
  }

  async query(request: QueryRequest): Promise<QueryResult> {
    if (!this._connected || !this.connection) {
      throw new Error('Not connected to database');
    }

    const startTime = Date.now();
    let sql = request.sql || '';

    // Build SQL if not provided
    if (!sql && request.table) {
      const conditions = request.filters?.map(f => 
        `${f.column} ${f.operator} '${f.value}'`
      ).join(' AND ');

      const orderBy = request.orderBy?.map(o => 
        `${o.column} ${o.direction || 'ASC'}`
      ).join(', ');

      sql = `SELECT ${request.columns?.join(', ') || '*'} 
             FROM ${request.table}
             ${conditions ? `WHERE ${conditions}` : ''}
             ${request.groupBy ? `GROUP BY ${request.groupBy.join(', ')}` : ''}
             ${orderBy ? `ORDER BY ${orderBy}` : ''}
             ${request.limit ? `LIMIT ${request.limit}` : ''}
             ${request.offset ? `OFFSET ${request.offset}` : ''}`;
    }

    try {
      const result = await this.executeDuckDB(sql);
      const executionTime = Date.now() - startTime;

      return {
        data: result.rows || [],
        metadata: {
          rowCount: result.rows?.length || 0,
          executionTime,
          sql
        }
      };
    } catch (error) {
      throw new Error(`Query failed: ${error.message}`);
    }
  }

  async queryStream(request: QueryRequest): AsyncIterable<any> {
    if (!this._connected || !this.connection) {
      throw new Error('Not connected to database');
    }

    const sql = this.buildSQL(request);
    
    // DuckDB doesn't have native streaming, so we'll implement pagination
    const pageSize = 1000;
    let offset = 0;
    
    async function* streamResults(connector: ParquetConnector) {
      while (true) {
        const pagedSQL = `${sql} LIMIT ${pageSize} OFFSET ${offset}`;
        const result = await connector.executeDuckDB(pagedSQL);
        
        if (!result.rows || result.rows.length === 0) break;
        
        for (const row of result.rows) {
          yield row;
        }
        
        if (result.rows.length < pageSize) break;
        offset += pageSize;
      }
    }

    return streamResults(this);
  }

  async getSchema(): Promise<SchemaInfo> {
    if (!this._connected) {
      throw new Error('Not connected to database');
    }

    const tables: TableSchema[] = [];

    for (const [name, table] of this.tables) {
      const schema = await this.getTableSchema(name);
      tables.push(schema);
    }

    return {
      connectorType: 'parquet',
      connectorVersion: '1.0.0',
      capabilities: {
        sql: true,
        joins: true,
        aggregations: true,
        transactions: false,
        streaming: true
      },
      tables
    };
  }

  async getTableSchema(tableName: string): Promise<TableSchema> {
    if (!this._connected || !this.connection) {
      throw new Error('Not connected to database');
    }

    const table = this.tables.get(tableName);
    if (!table) {
      throw new Error(`Table '${tableName}' not found`);
    }

    try {
      // Get column information
      const columnsResult = await this.executeDuckDB(
        `SELECT column_name, data_type 
         FROM information_schema.columns 
         WHERE table_name = '${tableName}'`
      );

      const columns = columnsResult.rows?.map(row => ({
        name: row.column_name,
        type: this.mapDuckDBType(row.data_type),
        nullable: true
      })) || [];

      // Get row count
      const countResult = await this.executeDuckDB(
        `SELECT COUNT(*) as count FROM ${tableName}`
      );
      const rowCount = countResult.rows?.[0]?.count || 0;

      // Get sample data
      const sampleResult = await this.executeDuckDB(
        `SELECT * FROM ${tableName} LIMIT 5`
      );

      return {
        name: tableName,
        columns,
        rowCount,
        sampleData: sampleResult.rows || [],
        metadata: {
          filePath: table.path,
          fileSize: table.size,
          lastModified: table.lastModified
        }
      };
    } catch (error) {
      throw new Error(`Failed to get schema for table '${tableName}': ${error.message}`);
    }
  }

  async loadParquetFile(filePath: string, tableName?: string): Promise<void> {
    if (!this._connected || !this.connection) {
      throw new Error('Not connected to database');
    }

    const name = tableName || path.basename(filePath, '.parquet');
    
    try {
      // Get file stats
      let stats;
      if (this.config.storageType === 'local') {
        stats = await fs.stat(filePath);
      }

      // Create table from Parquet file
      await this.executeDuckDB(
        `CREATE TABLE ${name} AS SELECT * FROM read_parquet('${filePath}')`
      );

      // Store table metadata
      this.tables.set(name, {
        name,
        path: filePath,
        size: stats?.size,
        lastModified: stats?.mtime
      });

    } catch (error) {
      throw new Error(`Failed to load Parquet file '${filePath}': ${error.message}`);
    }
  }

  async loadMultipleParquetFiles(pattern: string, tableName: string): Promise<void> {
    if (!this._connected || !this.connection) {
      throw new Error('Not connected to database');
    }

    try {
      // DuckDB supports glob patterns for reading multiple files
      await this.executeDuckDB(
        `CREATE TABLE ${tableName} AS SELECT * FROM read_parquet('${pattern}')`
      );

      this.tables.set(tableName, {
        name: tableName,
        path: pattern
      });

    } catch (error) {
      throw new Error(`Failed to load Parquet files with pattern '${pattern}': ${error.message}`);
    }
  }

  async exportToParquet(tableName: string, outputPath: string): Promise<void> {
    if (!this._connected || !this.connection) {
      throw new Error('Not connected to database');
    }

    try {
      await this.executeDuckDB(
        `COPY ${tableName} TO '${outputPath}' (FORMAT PARQUET)`
      );
    } catch (error) {
      throw new Error(`Failed to export table '${tableName}' to Parquet: ${error.message}`);
    }
  }

  async createView(viewName: string, sql: string): Promise<void> {
    if (!this._connected || !this.connection) {
      throw new Error('Not connected to database');
    }

    try {
      await this.executeDuckDB(`CREATE VIEW ${viewName} AS ${sql}`);
      
      // Add view to tables list
      this.tables.set(viewName, {
        name: viewName,
        path: 'VIEW'
      });
    } catch (error) {
      throw new Error(`Failed to create view '${viewName}': ${error.message}`);
    }
  }

  async analyzeTable(tableName: string): Promise<any> {
    if (!this._connected || !this.connection) {
      throw new Error('Not connected to database');
    }

    try {
      // Get basic statistics
      const statsResult = await this.executeDuckDB(
        `SELECT 
          COUNT(*) as row_count,
          COUNT(DISTINCT *) as unique_rows,
          pg_size_pretty(SUM(pg_column_size(*))) as total_size
        FROM ${tableName}`
      );

      // Get column statistics
      const schema = await this.getTableSchema(tableName);
      const columnStats = [];

      for (const column of schema.columns) {
        const colStatsResult = await this.executeDuckDB(
          `SELECT 
            COUNT(DISTINCT ${column.name}) as distinct_values,
            COUNT(*) - COUNT(${column.name}) as null_count,
            MIN(${column.name})::VARCHAR as min_value,
            MAX(${column.name})::VARCHAR as max_value
          FROM ${tableName}`
        );
        
        columnStats.push({
          column: column.name,
          type: column.type,
          ...colStatsResult.rows?.[0]
        });
      }

      return {
        table: tableName,
        ...statsResult.rows?.[0],
        columns: columnStats
      };
    } catch (error) {
      throw new Error(`Failed to analyze table '${tableName}': ${error.message}`);
    }
  }

  private async executeDuckDB(sql: string): Promise<{ rows: any[] }> {
    return new Promise((resolve, reject) => {
      if (!this.connection) {
        reject(new Error('No database connection'));
        return;
      }

      this.connection.all(sql, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve({ rows: result || [] });
        }
      });
    });
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

  private mapDuckDBType(duckdbType: string): string {
    const typeMap: Record<string, string> = {
      'INTEGER': 'integer',
      'BIGINT': 'bigint',
      'DOUBLE': 'float',
      'DECIMAL': 'decimal',
      'VARCHAR': 'string',
      'DATE': 'date',
      'TIMESTAMP': 'timestamp',
      'BOOLEAN': 'boolean',
      'BLOB': 'binary',
      'LIST': 'array',
      'STRUCT': 'object'
    };

    return typeMap[duckdbType.toUpperCase()] || 'string';
  }

  // Advanced features

  async joinTables(config: {
    leftTable: string;
    rightTable: string;
    joinType: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
    on: string;
    resultTable: string;
  }): Promise<void> {
    const { leftTable, rightTable, joinType, on, resultTable } = config;
    
    const sql = `CREATE TABLE ${resultTable} AS 
                 SELECT * FROM ${leftTable} 
                 ${joinType} JOIN ${rightTable} ON ${on}`;
    
    await this.executeDuckDB(sql);
    
    this.tables.set(resultTable, {
      name: resultTable,
      path: 'JOIN_RESULT'
    });
  }

  async pivot(config: {
    table: string;
    rowColumns: string[];
    pivotColumn: string;
    valueColumn: string;
    aggregation: 'SUM' | 'AVG' | 'COUNT' | 'MAX' | 'MIN';
    resultTable: string;
  }): Promise<void> {
    const { table, rowColumns, pivotColumn, valueColumn, aggregation, resultTable } = config;
    
    // Get unique pivot values
    const pivotValuesResult = await this.executeDuckDB(
      `SELECT DISTINCT ${pivotColumn} FROM ${table} ORDER BY ${pivotColumn}`
    );
    
    const pivotValues = pivotValuesResult.rows?.map(r => r[pivotColumn]) || [];
    
    // Build pivot query
    const pivotCases = pivotValues.map(val => 
      `${aggregation}(CASE WHEN ${pivotColumn} = '${val}' THEN ${valueColumn} END) AS "${val}"`
    ).join(', ');
    
    const sql = `CREATE TABLE ${resultTable} AS 
                 SELECT ${rowColumns.join(', ')}, ${pivotCases}
                 FROM ${table}
                 GROUP BY ${rowColumns.join(', ')}`;
    
    await this.executeDuckDB(sql);
    
    this.tables.set(resultTable, {
      name: resultTable,
      path: 'PIVOT_RESULT'
    });
  }
}