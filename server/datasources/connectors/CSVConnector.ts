import { BaseConnector } from '../core/BaseConnector';
import {
  ConnectionConfig,
  QueryRequest,
  QueryResult,
  DatabaseSchema,
  TableInfo,
  ConnectorCapabilities,
  ConnectorMetadata,
  DataType,
  ColumnInfo,
  QueryError,
  FileConnectionConfig
} from '../core/types';
import { promises as fs } from 'fs';
import path from 'path';
import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import alasql from 'alasql';

interface CSVFile {
  path: string;
  tableName: string;
}

/**
 * CSV Connector for loading and querying CSV files
 */
export class CSVConnector extends BaseConnector {
  private data: Map<string, any[]> = new Map();
  private schemas: Map<string, TableInfo> = new Map();
  private filePaths: Map<string, string> = new Map();

  async connect(config: FileConnectionConfig): Promise<void> {
    this.config = config;
    this.connected = true;
    this.connectionStartTime = new Date();

    // If config includes initial files, load them
    if (config.filePath) {
      const tableName = path.basename(config.filePath, '.csv');
      await this.loadCSVFile(config.filePath, tableName);
    }
  }

  async disconnect(): Promise<void> {
    this.data.clear();
    this.schemas.clear();
    this.filePaths.clear();
    this.connected = false;
  }

  async loadCSVFile(filePath: string, tableName: string): Promise<void> {
    const records: any[] = [];
    
    return new Promise((resolve, reject) => {
      const parser = parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
        cast: true,
        cast_date: true,
        relax_quotes: true,
        relax_column_count: true
      });

      const stream = createReadStream(filePath);
      
      stream.pipe(parser)
        .on('data', (data) => {
          records.push(data);
        })
        .on('end', () => {
          // Store data and path
          this.data.set(tableName, records);
          this.filePaths.set(tableName, filePath);
          
          // Generate schema
          const schema = this.generateSchemaFromData(tableName, records);
          this.schemas.set(tableName, schema);
          
          resolve();
        })
        .on('error', (error) => {
          reject(new Error(`Failed to parse CSV file: ${error.message}`));
        });
    });
  }

  private generateSchemaFromData(tableName: string, data: any[]): TableInfo {
    if (!data.length) {
      return {
        name: tableName,
        columns: [],
        rowCount: 0
      };
    }

    // Analyze first 100 rows to determine types
    const sampleSize = Math.min(data.length, 100);
    const sample = data.slice(0, sampleSize);
    const columns: ColumnInfo[] = Object.keys(data[0]).map(columnName => {
      const values = sample.map(row => row[columnName]).filter(v => v != null);
      
      return {
        name: columnName,
        type: this.inferDataType(values),
        nativeType: 'text',
        nullable: values.length < sample.length,
        primaryKey: false
      };
    });

    return {
      name: tableName,
      columns,
      rowCount: data.length
    };
  }

  private inferDataType(values: any[]): DataType {
    if (!values.length) return DataType.String;
    
    const types = new Set(values.map(v => {
      if (v instanceof Date) return DataType.DateTime;
      if (typeof v === 'number') {
        return DataType.Number;
      }
      if (typeof v === 'boolean') return DataType.Boolean;
      return DataType.String;
    }));

    // If mixed types, default to string
    if (types.size > 1) return DataType.String;
    
    const type = Array.from(types)[0];
    return type;
  }

  async query<T = any>(request: QueryRequest): Promise<QueryResult<T>> {
    this.validateConnection();
    const startTime = Date.now();

    try {
      let result: any[];

      if (request.sql) {
        // Register all tables with alasql
        for (const [tableName, tableData] of this.data.entries()) {
          alasql.tables[tableName] = { data: [...tableData] };
        }
        
        result = alasql(request.sql);
      } else if (request.table) {
        // Handle structured queries
        const tableData = this.data.get(request.table);
        if (!tableData) {
          throw new QueryError(`Table '${request.table}' not found`);
        }

        // Build SQL from structured query
        const sql = this.buildQueryFromRequest(request);
        alasql.tables[request.table] = { data: [...tableData] };
        result = alasql(sql);
      } else {
        throw new QueryError('Either sql or table must be specified in query request');
      }

      // Apply limit if not already in SQL
      if (request.limit && !request.sql?.toLowerCase().includes('limit')) {
        result = result.slice(0, request.limit);
      }

      const executionTime = Date.now() - startTime;

      return {
        rows: result as T[],
        rowCount: result.length,
        fields: this.extractFieldInfo(result),
        executionTime
      };
    } catch (error) {
      throw new QueryError(
        `CSV query failed: ${error.message}`,
        request.sql || this.buildQueryFromRequest(request)
      );
    }
  }

  async getSchema(): Promise<DatabaseSchema> {
    this.validateConnection();
    
    return {
      name: 'csv',
      tables: Array.from(this.schemas.values()),
      relationships: []
    };
  }

  async getTables(): Promise<TableInfo[]> {
    this.validateConnection();
    return Array.from(this.schemas.values());
  }

  async getTableSchema(tableName: string): Promise<TableInfo> {
    this.validateConnection();
    
    const schema = this.schemas.get(tableName);
    if (!schema) {
      throw new Error(`Table '${tableName}' not found`);
    }
    
    return schema;
  }

  getCapabilities(): ConnectorCapabilities {
    return {
      supportsStreaming: true,
      supportsTransactions: false,
      supportsBatchOperations: false,
      supportsSchemaDiscovery: true,
      supportsStoredProcedures: false,
      supportsViews: false,
      maxQuerySize: 1000000,  // 1MB
      maxResultSize: 50000000  // 50MB
    };
  }

  getMetadata(): ConnectorMetadata {
    return {
      name: 'csv',
      displayName: 'CSV File Connector',
      description: 'Load and query CSV files with SQL',
      version: '1.0.0',
      author: 'System',
      icon: 'file-text',
      configSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier for this data source'
          },
          name: {
            type: 'string',
            description: 'Display name for this data source'
          },
          filePath: {
            type: 'string',
            description: 'Path to CSV file (optional, can add files later)'
          }
        },
        required: ['id', 'name']
      }
    };
  }

  // Additional methods for CSV management
  async addCSVFile(filePath: string, tableName?: string): Promise<void> {
    const name = tableName || path.basename(filePath, '.csv');
    await this.loadCSVFile(filePath, name);
  }

  async removeTable(tableName: string): Promise<void> {
    this.data.delete(tableName);
    this.schemas.delete(tableName);
    this.filePaths.delete(tableName);
  }

  async refreshTable(tableName: string): Promise<void> {
    const filePath = this.filePaths.get(tableName);
    if (!filePath) {
      throw new Error(`No file path found for table '${tableName}'`);
    }
    await this.loadCSVFile(filePath, tableName);
  }


  getTableData(tableName: string): any[] | undefined {
    return this.data.get(tableName);
  }

  // Override streaming for CSV files
  async *queryStream<T = any>(request: QueryRequest): AsyncIterableIterator<T> {
    this.validateConnection();
    
    if (request.table && this.data.has(request.table)) {
      const tableData = this.data.get(request.table)!;
      const chunkSize = 1000;
      
      for (let i = 0; i < tableData.length; i += chunkSize) {
        const chunk = tableData.slice(i, i + chunkSize);
        for (const row of chunk) {
          yield row as T;
        }
      }
    } else {
      // Fall back to regular query for SQL
      yield* super.queryStream(request);
    }
  }
}