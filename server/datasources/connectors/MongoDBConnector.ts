import { BaseConnector } from '../core/BaseConnector';
import type { 
  QueryRequest, 
  QueryResult, 
  ConnectionConfig, 
  ConnectorMetadata,
  SchemaInfo,
  TableSchema
} from '../core/types';
import { MongoClient, Db, Collection, Document, Filter, FindOptions, AggregateOptions } from 'mongodb';

interface MongoDBConfig extends ConnectionConfig {
  connectionString?: string;
  host?: string;
  port?: number;
  database: string;
  username?: string;
  password?: string;
  authSource?: string;
  replicaSet?: string;
  ssl?: boolean;
  sslValidate?: boolean;
  sslCA?: string;
  sslCert?: string;
  sslKey?: string;
  poolSize?: number;
  serverSelectionTimeoutMS?: number;
}

interface MongoQueryRequest extends QueryRequest {
  collection?: string;
  pipeline?: any[];
  filter?: any;
  projection?: any;
  sort?: any;
  skip?: number;
}

export class MongoDBConnector extends BaseConnector {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private config: MongoDBConfig | null = null;

  constructor(metadata: ConnectorMetadata) {
    super(metadata);
  }

  async connect(config: MongoDBConfig): Promise<void> {
    try {
      this.config = config;
      
      // Build connection string if not provided
      let connectionString = config.connectionString;
      if (!connectionString) {
        const auth = config.username ? `${config.username}:${config.password}@` : '';
        const host = config.host || 'localhost';
        const port = config.port || 27017;
        connectionString = `mongodb://${auth}${host}:${port}/${config.database}`;
        
        const params = [];
        if (config.authSource) params.push(`authSource=${config.authSource}`);
        if (config.replicaSet) params.push(`replicaSet=${config.replicaSet}`);
        if (config.ssl) params.push('ssl=true');
        if (params.length > 0) connectionString += `?${params.join('&')}`;
      }

      // Create client with options
      this.client = new MongoClient(connectionString, {
        maxPoolSize: config.poolSize || 10,
        serverSelectionTimeoutMS: config.serverSelectionTimeoutMS || 30000,
        ssl: config.ssl,
        sslValidate: config.sslValidate,
        sslCA: config.sslCA,
        sslCert: config.sslCert,
        sslKey: config.sslKey
      });

      // Connect to MongoDB
      await this.client.connect();
      this.db = this.client.db(config.database);

      // Test connection
      await this.db.admin().ping();

      this._connected = true;
    } catch (error) {
      throw new Error(`Failed to connect to MongoDB: ${error.message}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
    }
    this._connected = false;
  }

  async query(request: MongoQueryRequest): Promise<QueryResult> {
    if (!this._connected || !this.db) {
      throw new Error('Not connected to database');
    }

    const startTime = Date.now();

    try {
      let data: any[] = [];
      let metadata: any = {};

      // Handle SQL-like queries by converting to MongoDB operations
      if (request.sql) {
        const mongoOp = this.sqlToMongoDB(request.sql);
        request = { ...request, ...mongoOp };
      }

      const collectionName = request.collection || request.table;
      if (!collectionName) {
        throw new Error('Collection name is required');
      }

      const collection = this.db.collection(collectionName);

      // Execute aggregation pipeline if provided
      if (request.pipeline) {
        const cursor = collection.aggregate(request.pipeline, {
          allowDiskUse: true
        });
        data = await cursor.toArray();
      } 
      // Execute find query
      else {
        const filter = request.filter || {};
        const options: FindOptions = {};

        if (request.projection) options.projection = request.projection;
        if (request.sort || request.orderBy) {
          options.sort = request.sort || this.buildSortFromOrderBy(request.orderBy);
        }
        if (request.limit) options.limit = request.limit;
        if (request.skip || request.offset) options.skip = request.skip || request.offset;

        const cursor = collection.find(filter, options);
        data = await cursor.toArray();
        
        // Get total count for pagination
        metadata.totalCount = await collection.countDocuments(filter);
      }

      const executionTime = Date.now() - startTime;

      return {
        data,
        metadata: {
          ...metadata,
          rowCount: data.length,
          executionTime,
          collection: collectionName
        }
      };
    } catch (error) {
      throw new Error(`Query failed: ${error.message}`);
    }
  }

  async queryStream(request: MongoQueryRequest): AsyncIterable<any> {
    if (!this._connected || !this.db) {
      throw new Error('Not connected to database');
    }

    const collectionName = request.collection || request.table;
    if (!collectionName) {
      throw new Error('Collection name is required');
    }

    const collection = this.db.collection(collectionName);

    // Create async generator for streaming
    async function* streamResults() {
      let cursor;

      if (request.pipeline) {
        cursor = collection.aggregate(request.pipeline, {
          allowDiskUse: true
        });
      } else {
        const filter = request.filter || {};
        const options: FindOptions = {};

        if (request.projection) options.projection = request.projection;
        if (request.sort || request.orderBy) {
          options.sort = request.sort || MongoDBConnector.prototype.buildSortFromOrderBy(request.orderBy);
        }

        cursor = collection.find(filter, options);
      }

      for await (const doc of cursor) {
        yield doc;
      }
    }

    return streamResults();
  }

  async getSchema(): Promise<SchemaInfo> {
    if (!this._connected || !this.db) {
      throw new Error('Not connected to database');
    }

    const collections = await this.db.listCollections().toArray();
    const tables: TableSchema[] = [];

    for (const collection of collections) {
      if (!collection.name.startsWith('system.')) {
        const schema = await this.getTableSchema(collection.name);
        tables.push(schema);
      }
    }

    return {
      connectorType: 'mongodb',
      connectorVersion: '1.0.0',
      capabilities: {
        sql: false,
        joins: false, // MongoDB doesn't support traditional joins
        aggregations: true,
        transactions: true,
        streaming: true,
        schemaless: true,
        nosql: true
      },
      tables
    };
  }

  async getTableSchema(collectionName: string): Promise<TableSchema> {
    if (!this._connected || !this.db) {
      throw new Error('Not connected to database');
    }

    const collection = this.db.collection(collectionName);
    
    // Get collection stats
    const stats = await collection.stats();
    
    // Sample documents to infer schema
    const sampleSize = 100;
    const samples = await collection.find({}).limit(sampleSize).toArray();
    
    // Infer schema from samples
    const schemaMap = new Map<string, Set<string>>();
    
    samples.forEach(doc => {
      this.extractSchema(doc, '', schemaMap);
    });

    // Convert schema map to columns
    const columns = Array.from(schemaMap.entries()).map(([path, types]) => ({
      name: path,
      type: types.size === 1 ? Array.from(types)[0] : 'mixed',
      nullable: true,
      mongoTypes: Array.from(types)
    }));

    // Get indexes
    const indexes = await collection.indexes();

    return {
      name: collectionName,
      columns,
      rowCount: stats.count,
      indexes: indexes.map(idx => ({
        name: idx.name,
        keys: idx.key,
        unique: idx.unique || false,
        sparse: idx.sparse || false
      })),
      sampleData: samples.slice(0, 5),
      metadata: {
        avgObjSize: stats.avgObjSize,
        storageSize: stats.storageSize,
        totalIndexSize: stats.totalIndexSize,
        capped: stats.capped
      }
    };
  }

  // MongoDB-specific operations

  async aggregate(collectionName: string, pipeline: any[], options?: AggregateOptions): Promise<any[]> {
    if (!this._connected || !this.db) {
      throw new Error('Not connected to database');
    }

    const collection = this.db.collection(collectionName);
    const cursor = collection.aggregate(pipeline, options);
    return cursor.toArray();
  }

  async bulkWrite(collectionName: string, operations: any[]): Promise<any> {
    if (!this._connected || !this.db) {
      throw new Error('Not connected to database');
    }

    const collection = this.db.collection(collectionName);
    return collection.bulkWrite(operations);
  }

  async createIndex(collectionName: string, keys: any, options?: any): Promise<string> {
    if (!this._connected || !this.db) {
      throw new Error('Not connected to database');
    }

    const collection = this.db.collection(collectionName);
    return collection.createIndex(keys, options);
  }

  async watch(collectionName?: string, pipeline?: any[], options?: any): Promise<any> {
    if (!this._connected || !this.db) {
      throw new Error('Not connected to database');
    }

    if (collectionName) {
      const collection = this.db.collection(collectionName);
      return collection.watch(pipeline, options);
    } else {
      return this.db.watch(pipeline, options);
    }
  }

  async mapReduce(collectionName: string, map: string | Function, reduce: string | Function, options: any): Promise<any> {
    if (!this._connected || !this.db) {
      throw new Error('Not connected to database');
    }

    const collection = this.db.collection(collectionName);
    
    // Build aggregation pipeline equivalent to map-reduce
    const pipeline = [
      {
        $group: {
          _id: null,
          value: { $push: '$$ROOT' }
        }
      },
      {
        $project: {
          _id: 0,
          result: {
            $function: {
              body: `function(docs) {
                const map = ${map.toString()};
                const reduce = ${reduce.toString()};
                const mapped = [];
                docs.forEach(doc => {
                  map.call(doc);
                });
                // Implement reduce logic
                return mapped;
              }`,
              args: ['$value'],
              lang: 'js'
            }
          }
        }
      }
    ];

    if (options.out) {
      pipeline.push({ $out: options.out });
    }

    return collection.aggregate(pipeline).toArray();
  }

  async explain(collectionName: string, operation: any): Promise<any> {
    if (!this._connected || !this.db) {
      throw new Error('Not connected to database');
    }

    const collection = this.db.collection(collectionName);
    
    if (operation.find) {
      return collection.find(operation.find.filter || {})
        .explain(operation.verbosity || 'executionStats');
    } else if (operation.aggregate) {
      return collection.aggregate(operation.aggregate.pipeline, {
        explain: operation.verbosity || 'executionStats'
      });
    }
    
    throw new Error('Unsupported operation for explain');
  }

  // Helper methods

  private extractSchema(obj: any, prefix: string, schemaMap: Map<string, Set<string>>): void {
    Object.entries(obj).forEach(([key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      
      if (!schemaMap.has(path)) {
        schemaMap.set(path, new Set());
      }
      
      const type = this.getMongoType(value);
      schemaMap.get(path)!.add(type);
      
      if (type === 'object' && value !== null && !Array.isArray(value)) {
        this.extractSchema(value, path, schemaMap);
      } else if (type === 'array' && Array.isArray(value) && value.length > 0) {
        // Sample first element of array
        if (typeof value[0] === 'object' && value[0] !== null) {
          this.extractSchema(value[0], `${path}[]`, schemaMap);
        }
      }
    });
  }

  private getMongoType(value: any): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (value instanceof Date) return 'date';
    if (value instanceof RegExp) return 'regex';
    if (Buffer.isBuffer(value)) return 'binary';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    return typeof value;
  }

  private buildSortFromOrderBy(orderBy?: Array<{ column: string; direction?: string }>): any {
    if (!orderBy || orderBy.length === 0) return undefined;
    
    const sort: any = {};
    orderBy.forEach(o => {
      sort[o.column] = o.direction?.toUpperCase() === 'DESC' ? -1 : 1;
    });
    return sort;
  }

  private sqlToMongoDB(sql: string): MongoQueryRequest {
    // Basic SQL to MongoDB conversion (simplified)
    // In production, use a proper SQL parser

    const selectMatch = sql.match(/SELECT\s+(.*?)\s+FROM\s+(\w+)/i);
    if (!selectMatch) {
      throw new Error('Invalid SQL query');
    }

    const [, fields, collection] = selectMatch;
    const result: MongoQueryRequest = { collection };

    // Parse fields
    if (fields.trim() !== '*') {
      const projection: any = {};
      fields.split(',').forEach(field => {
        projection[field.trim()] = 1;
      });
      result.projection = projection;
    }

    // Parse WHERE clause
    const whereMatch = sql.match(/WHERE\s+(.*?)(?:\s+ORDER\s+BY|\s+LIMIT|\s+OFFSET|$)/i);
    if (whereMatch) {
      result.filter = this.parseWhereClause(whereMatch[1]);
    }

    // Parse ORDER BY
    const orderMatch = sql.match(/ORDER\s+BY\s+(.*?)(?:\s+LIMIT|\s+OFFSET|$)/i);
    if (orderMatch) {
      const sort: any = {};
      orderMatch[1].split(',').forEach(part => {
        const [field, dir] = part.trim().split(/\s+/);
        sort[field] = dir?.toUpperCase() === 'DESC' ? -1 : 1;
      });
      result.sort = sort;
    }

    // Parse LIMIT
    const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      result.limit = parseInt(limitMatch[1]);
    }

    // Parse OFFSET
    const offsetMatch = sql.match(/OFFSET\s+(\d+)/i);
    if (offsetMatch) {
      result.skip = parseInt(offsetMatch[1]);
    }

    return result;
  }

  private parseWhereClause(where: string): any {
    // Very basic WHERE clause parsing
    const filter: any = {};
    
    // Handle simple equality
    const equalityMatch = where.match(/(\w+)\s*=\s*['"]?(.+?)['"]?$/);
    if (equalityMatch) {
      const [, field, value] = equalityMatch;
      filter[field] = isNaN(Number(value)) ? value : Number(value);
    }
    
    // Add more parsing logic as needed
    
    return filter;
  }
}