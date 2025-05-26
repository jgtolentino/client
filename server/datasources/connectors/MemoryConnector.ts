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
  QueryError
} from '../core/types';
import type { Transaction, Consumer } from '@shared/schema';
import alasql from 'alasql';

/**
 * Memory connector that wraps the existing storage implementation
 * This allows the current system to work through the new abstraction layer
 */
export class MemoryConnector extends BaseConnector {
  private transactions: Transaction[] = [];
  private consumers: Consumer[] = [];
  private brands: any[] = [];
  private locations: any[] = [];
  private categories: any[] = [];

  async connect(): Promise<void> {
    try {
      // For now, we'll initialize with sample data directly
      // In production, this would connect to the actual storage
      this.initializeSampleData();
      
      this.connected = true;
      this.connectionStartTime = new Date();
    } catch (error) {
      throw new Error(`Failed to connect to memory storage: ${error.message}`);
    }
  }

  private initializeSampleData(): void {
    // Generate sample Philippine brand data
    const brandData = [
      // TBWA Clients
      { brand: "Del Monte Tomato Sauce & Ketchup", category: "Sauce", baseValue: 2400000, isTBWA: true },
      { brand: "Del Monte Spaghetti Sauce", category: "Sauce", baseValue: 1950000, isTBWA: true },
      { brand: "Del Monte Fruit Cocktail", category: "Canned Goods", baseValue: 1600000, isTBWA: true },
      { brand: "Alaska Evaporated Milk", category: "Dairy", baseValue: 1900000, isTBWA: true },
      { brand: "Oishi Prawn Crackers", category: "Snacks", baseValue: 1200000, isTBWA: true },
      { brand: "Champion Detergent", category: "Home Care", baseValue: 1300000, isTBWA: true },
      { brand: "Winston", category: "Tobacco", baseValue: 2400000, isTBWA: true },
      // Competitors
      { brand: "UFC Tomato Sauce", category: "Sauce", baseValue: 400000, isTBWA: false },
      { brand: "Bear Brand Milk", category: "Dairy", baseValue: 300000, isTBWA: false },
      { brand: "Piattos", category: "Snacks", baseValue: 250000, isTBWA: false }
    ];

    const locations = ["Manila", "Cebu", "Davao", "Iloilo", "Cagayan de Oro"];
    const barangays = ["Makati", "BGC", "Ortigas", "Alabang", "IT Park"];

    // Generate transactions
    let transactionId = 1;
    for (let i = 0; i < 500; i++) {
      const brand = brandData[Math.floor(Math.random() * brandData.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const barangay = barangays[Math.floor(Math.random() * barangays.length)];
      
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      const variance = 0.3 + Math.random() * 0.4;
      const pesoValue = Math.floor(brand.baseValue * variance);
      
      this.transactions.push({
        id: transactionId++,
        date: date.toISOString().split('T')[0],
        volume: Math.floor(1000 + Math.random() * 2000),
        pesoValue: pesoValue.toString(),
        duration: Math.floor(15 + Math.random() * 40),
        units: Math.floor(200 + Math.random() * 600),
        brand: brand.brand,
        category: brand.category,
        location: location,
        barangay: barangay
      });
    }

    // Generate consumers
    const genders = ['Male', 'Female'];
    for (let i = 1; i <= 50; i++) {
      this.consumers.push({
        id: i,
        gender: genders[Math.floor(Math.random() * genders.length)],
        age: 18 + Math.floor(Math.random() * 50),
        location: locations[Math.floor(Math.random() * locations.length)]
      });
    }

    // Aggregate brand data
    const brandMap = new Map<string, any>();
    this.transactions.forEach(t => {
      const existing = brandMap.get(t.brand) || {
        brand: t.brand,
        value: 0,
        transactions: 0,
        isTBWAClient: brandData.find(b => b.brand === t.brand)?.isTBWA || false
      };
      existing.value += parseFloat(t.pesoValue);
      existing.transactions += 1;
      brandMap.set(t.brand, existing);
    });
    
    this.brands = Array.from(brandMap.values()).map(b => ({
      ...b,
      averageTransaction: b.value / b.transactions,
      growth: (Math.random() - 0.5) * 20, // Random growth -10% to +10%
      marketShare: 0 // Will be calculated
    }));

    // Calculate market share
    const totalValue = this.brands.reduce((sum, b) => sum + b.value, 0);
    this.brands.forEach(b => {
      b.marketShare = (b.value / totalValue) * 100;
    });

    // Aggregate location data
    const locationMap = new Map<string, any>();
    this.transactions.forEach(t => {
      const existing = locationMap.get(t.location) || {
        location: t.location,
        transactions: 0,
        value: 0
      };
      existing.value += parseFloat(t.pesoValue);
      existing.transactions += 1;
      locationMap.set(t.location, existing);
    });

    this.locations = Array.from(locationMap.values()).map(l => ({
      ...l,
      averageTransaction: l.value / l.transactions,
      topBrand: this.brands[0]?.brand // Simplified
    }));

    // Aggregate category data
    const categoryMap = new Map<string, any>();
    this.transactions.forEach(t => {
      const existing = categoryMap.get(t.category) || {
        category: t.category,
        value: 0,
        transactions: 0
      };
      existing.value += parseFloat(t.pesoValue);
      existing.transactions += 1;
      categoryMap.set(t.category, existing);
    });

    this.categories = Array.from(categoryMap.values()).map(c => ({
      ...c,
      topBrand: this.brands.find(b => b.category === c.category)?.brand,
      growth: (Math.random() - 0.5) * 15
    }));
  }

  async disconnect(): Promise<void> {
    // Clear memory
    this.transactions = [];
    this.consumers = [];
    this.brands = [];
    this.locations = [];
    this.categories = [];
    
    this.connected = false;
  }

  async query<T = any>(request: QueryRequest): Promise<QueryResult<T>> {
    this.validateConnection();
    const startTime = Date.now();

    try {
      let result: any;

      // If raw SQL is provided, use alasql
      if (request.sql) {
        result = await this.executeSql(request.sql, request.parameters);
      } else if (request.table) {
        // Handle table-based queries
        result = await this.executeTableQuery(request);
      } else {
        throw new QueryError('Either sql or table must be provided');
      }

      const executionTime = Date.now() - startTime;

      return {
        rows: result.rows || result,
        rowCount: result.length || result.rows?.length || 0,
        fields: this.inferFields(result.rows || result),
        executionTime
      };
    } catch (error) {
      throw new QueryError(
        `Query execution failed: ${error.message}`,
        request.sql || this.buildQueryFromRequest(request)
      );
    }
  }

  private async executeSql(sql: string, parameters?: any[]): Promise<any> {
    // Register tables with alasql
    alasql.tables.transactions = { data: this.transactions };
    alasql.tables.consumers = { data: this.consumers };
    alasql.tables.brands = { data: this.brands };
    alasql.tables.locations = { data: this.locations };
    alasql.tables.categories = { data: this.categories };

    // Execute SQL using alasql
    try {
      const result = alasql(sql, parameters);
      return result;
    } catch (error) {
      throw new QueryError(`SQL execution error: ${error.message}`, sql);
    }
  }

  private async executeTableQuery(request: QueryRequest): Promise<any> {
    const table = request.table!.toLowerCase();
    let data: any[];

    // Get the appropriate data set
    switch (table) {
      case 'transactions':
        data = this.transactions;
        break;
      case 'consumers':
        data = this.consumers;
        break;
      case 'brands':
        data = this.brands;
        break;
      case 'locations':
        data = this.locations;
        break;
      case 'categories':
        data = this.categories;
        break;
      default:
        throw new QueryError(`Unknown table: ${table}`);
    }

    // Apply filters
    if (request.where && request.where.length > 0) {
      data = this.applyFilters(data, request.where);
    }

    // Apply grouping
    if (request.groupBy && request.groupBy.length > 0) {
      data = this.applyGrouping(data, request);
    }

    // Apply ordering
    if (request.orderBy && request.orderBy.length > 0) {
      data = this.applyOrdering(data, request.orderBy);
    }

    // Apply limit and offset
    if (request.limit || request.offset) {
      const offset = request.offset || 0;
      const limit = request.limit || data.length;
      data = data.slice(offset, offset + limit);
    }

    // Select specific columns
    if (request.select && request.select.length > 0) {
      data = this.selectColumns(data, request.select);
    }

    return data;
  }

  private applyFilters(data: any[], where: any[]): any[] {
    return data.filter(row => {
      return where.every(clause => this.evaluateWhereClause(row, clause));
    });
  }

  private evaluateWhereClause(row: any, clause: any): boolean {
    if (clause.and) {
      return clause.and.every((c: any) => this.evaluateWhereClause(row, c));
    }
    if (clause.or) {
      return clause.or.some((c: any) => this.evaluateWhereClause(row, c));
    }

    const fieldValue = row[clause.field];
    const compareValue = clause.value;

    switch (clause.operator) {
      case '=':
        return fieldValue == compareValue;
      case '!=':
        return fieldValue != compareValue;
      case '<':
        return fieldValue < compareValue;
      case '<=':
        return fieldValue <= compareValue;
      case '>':
        return fieldValue > compareValue;
      case '>=':
        return fieldValue >= compareValue;
      case 'LIKE':
        return String(fieldValue).toLowerCase().includes(String(compareValue).toLowerCase());
      case 'NOT LIKE':
        return !String(fieldValue).toLowerCase().includes(String(compareValue).toLowerCase());
      case 'IN':
        return Array.isArray(compareValue) ? compareValue.includes(fieldValue) : fieldValue == compareValue;
      case 'NOT IN':
        return Array.isArray(compareValue) ? !compareValue.includes(fieldValue) : fieldValue != compareValue;
      case 'IS NULL':
        return fieldValue == null;
      case 'IS NOT NULL':
        return fieldValue != null;
      case 'BETWEEN':
        return fieldValue >= compareValue[0] && fieldValue <= compareValue[1];
      case 'NOT BETWEEN':
        return fieldValue < compareValue[0] || fieldValue > compareValue[1];
      default:
        throw new QueryError(`Unknown operator: ${clause.operator}`);
    }
  }

  private applyGrouping(data: any[], request: QueryRequest): any[] {
    // For complex grouping, use alasql
    const sql = this.buildQueryFromRequest(request);
    return alasql(sql, [data]);
  }

  private applyOrdering(data: any[], orderBy: any[]): any[] {
    return data.sort((a, b) => {
      for (const order of orderBy) {
        const aVal = a[order.column];
        const bVal = b[order.column];
        
        if (aVal < bVal) return order.direction === 'ASC' ? -1 : 1;
        if (aVal > bVal) return order.direction === 'ASC' ? 1 : -1;
      }
      return 0;
    });
  }

  private selectColumns(data: any[], columns: string[]): any[] {
    return data.map(row => {
      const newRow: any = {};
      columns.forEach(col => {
        if (col.includes(' as ')) {
          // Handle column aliases
          const [expr, alias] = col.split(' as ');
          newRow[alias.trim()] = row[expr.trim()];
        } else {
          newRow[col] = row[col];
        }
      });
      return newRow;
    });
  }

  private inferFields(data: any[]): any[] {
    if (!data || data.length === 0) return [];

    const firstRow = data[0];
    return Object.keys(firstRow).map(key => ({
      name: key,
      type: this.inferType(firstRow[key]),
      nullable: data.some(row => row[key] == null)
    }));
  }

  private inferType(value: any): DataType {
    if (value == null) return DataType.Unknown;
    if (typeof value === 'string') return DataType.String;
    if (typeof value === 'number') return DataType.Number;
    if (typeof value === 'boolean') return DataType.Boolean;
    if (value instanceof Date) return DataType.DateTime;
    if (typeof value === 'object') return DataType.JSON;
    return DataType.Unknown;
  }

  async getSchema(): Promise<DatabaseSchema> {
    this.validateConnection();

    return {
      name: 'memory',
      tables: await this.getTables(),
      relationships: [
        {
          name: 'transaction_brand',
          fromTable: 'transactions',
          fromColumn: 'brand',
          toTable: 'brands',
          toColumn: 'brand',
          type: 'many-to-one'
        },
        {
          name: 'transaction_location',
          fromTable: 'transactions',
          fromColumn: 'location',
          toTable: 'locations',
          toColumn: 'location',
          type: 'many-to-one'
        }
      ]
    };
  }

  async getTables(): Promise<TableInfo[]> {
    this.validateConnection();

    return [
      {
        name: 'transactions',
        columns: this.getTransactionColumns(),
        rowCount: this.transactions.length
      },
      {
        name: 'consumers',
        columns: this.getConsumerColumns(),
        rowCount: this.consumers.length
      },
      {
        name: 'brands',
        columns: this.getBrandColumns(),
        rowCount: this.brands.length
      },
      {
        name: 'locations',
        columns: this.getLocationColumns(),
        rowCount: this.locations.length
      },
      {
        name: 'categories',
        columns: this.getCategoryColumns(),
        rowCount: this.categories.length
      }
    ];
  }

  async getTableSchema(tableName: string): Promise<TableInfo> {
    const tables = await this.getTables();
    const table = tables.find(t => t.name === tableName.toLowerCase());
    
    if (!table) {
      throw new Error(`Table '${tableName}' not found`);
    }
    
    return table;
  }

  private getTransactionColumns(): ColumnInfo[] {
    return [
      { name: 'id', type: DataType.Number, nativeType: 'integer', nullable: false, primaryKey: true },
      { name: 'date', type: DataType.Date, nativeType: 'date', nullable: false },
      { name: 'volume', type: DataType.Number, nativeType: 'integer', nullable: false },
      { name: 'pesoValue', type: DataType.String, nativeType: 'varchar', nullable: false },
      { name: 'duration', type: DataType.Number, nativeType: 'integer', nullable: false },
      { name: 'units', type: DataType.Number, nativeType: 'integer', nullable: false },
      { name: 'brand', type: DataType.String, nativeType: 'varchar', nullable: false },
      { name: 'category', type: DataType.String, nativeType: 'varchar', nullable: false },
      { name: 'location', type: DataType.String, nativeType: 'varchar', nullable: false },
      { name: 'barangay', type: DataType.String, nativeType: 'varchar', nullable: false }
    ];
  }

  private getConsumerColumns(): ColumnInfo[] {
    return [
      { name: 'id', type: DataType.Number, nativeType: 'integer', nullable: false, primaryKey: true },
      { name: 'gender', type: DataType.String, nativeType: 'varchar', nullable: false },
      { name: 'age', type: DataType.Number, nativeType: 'integer', nullable: false },
      { name: 'location', type: DataType.String, nativeType: 'varchar', nullable: false }
    ];
  }

  private getBrandColumns(): ColumnInfo[] {
    return [
      { name: 'brand', type: DataType.String, nativeType: 'varchar', nullable: false, primaryKey: true },
      { name: 'value', type: DataType.Number, nativeType: 'decimal', nullable: false },
      { name: 'transactions', type: DataType.Number, nativeType: 'integer', nullable: false },
      { name: 'averageTransaction', type: DataType.Number, nativeType: 'decimal', nullable: false },
      { name: 'growth', type: DataType.Number, nativeType: 'decimal', nullable: true },
      { name: 'marketShare', type: DataType.Number, nativeType: 'decimal', nullable: true },
      { name: 'isTBWAClient', type: DataType.Boolean, nativeType: 'boolean', nullable: false }
    ];
  }

  private getLocationColumns(): ColumnInfo[] {
    return [
      { name: 'location', type: DataType.String, nativeType: 'varchar', nullable: false, primaryKey: true },
      { name: 'transactions', type: DataType.Number, nativeType: 'integer', nullable: false },
      { name: 'value', type: DataType.Number, nativeType: 'decimal', nullable: false },
      { name: 'averageTransaction', type: DataType.Number, nativeType: 'decimal', nullable: false },
      { name: 'topBrand', type: DataType.String, nativeType: 'varchar', nullable: true }
    ];
  }

  private getCategoryColumns(): ColumnInfo[] {
    return [
      { name: 'category', type: DataType.String, nativeType: 'varchar', nullable: false, primaryKey: true },
      { name: 'value', type: DataType.Number, nativeType: 'decimal', nullable: false },
      { name: 'transactions', type: DataType.Number, nativeType: 'integer', nullable: false },
      { name: 'topBrand', type: DataType.String, nativeType: 'varchar', nullable: true },
      { name: 'growth', type: DataType.Number, nativeType: 'decimal', nullable: true }
    ];
  }

  getCapabilities(): ConnectorCapabilities {
    return {
      supportsStreaming: true,
      supportsTransactions: false,
      supportsBatchOperations: true,
      supportsSchemaDiscovery: true,
      supportsStoredProcedures: false,
      supportsViews: false,
      maxQuerySize: 1000000,  // 1MB
      maxResultSize: 10000000  // 10MB
    };
  }

  getMetadata(): ConnectorMetadata {
    return {
      name: 'memory',
      displayName: 'In-Memory Storage',
      description: 'Fast in-memory storage for development and testing',
      version: '1.0.0',
      author: 'System',
      icon: 'database',
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
          }
        },
        required: ['id', 'name']
      }
    };
  }

  // Override streaming for better performance
  async *queryStream<T = any>(request: QueryRequest): AsyncIterableIterator<T> {
    this.validateConnection();
    
    // For memory connector, we can optimize by yielding chunks
    const result = await this.query<T>(request);
    const chunkSize = 100;
    
    for (let i = 0; i < result.rows.length; i += chunkSize) {
      const chunk = result.rows.slice(i, i + chunkSize);
      for (const row of chunk) {
        yield row;
      }
    }
  }
}