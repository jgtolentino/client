import { BaseConnector } from '../core/BaseConnector';
import type { QueryRequest, QueryResult, TableInfo } from '../types';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import * as parquet from 'parquetjs';
import alasql from 'alasql';

interface ParquetConfig {
  storageType: 'azure-blob' | 'local';
  containerName?: string;
  connectionString?: string;
  localPath?: string;
}

export class ParquetConnector extends BaseConnector {
  private blobClient?: BlobServiceClient;
  private containerClient?: ContainerClient;
  private data: Map<string, any[]> = new Map();
  private config: ParquetConfig;

  constructor(id: string, name: string, config: ParquetConfig) {
    super(id, name, 'parquet');
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      if (this.config.storageType === 'azure-blob') {
        if (!this.config.connectionString || !this.config.containerName) {
          throw new Error('Azure Blob storage requires connectionString and containerName');
        }

        this.blobClient = BlobServiceClient.fromConnectionString(this.config.connectionString);
        this.containerClient = this.blobClient.getContainerClient(this.config.containerName);

        // Load all Parquet files from the container
        await this.loadParquetFilesFromAzure();
      } else {
        // Load from local path (for development)
        await this.loadParquetFilesFromLocal();
      }

      this.connected = true;
      console.log(`✅ Connected to Parquet data source: ${this.name}`);
    } catch (error) {
      console.error(`❌ Failed to connect to Parquet data source: ${error}`);
      throw error;
    }
  }

  private async loadParquetFilesFromAzure(): Promise<void> {
    if (!this.containerClient) throw new Error('Container client not initialized');

    try {
      for await (const blob of this.containerClient.listBlobsFlat()) {
        if (blob.name.endsWith('.parquet')) {
          console.log(`📄 Loading Parquet file: ${blob.name}`);
          await this.loadParquetFile(blob.name);
        }
      }
    } catch (error) {
      console.error(`Failed to load Parquet files from Azure: ${error}`);
      throw error;
    }
  }

  private async loadParquetFilesFromLocal(): Promise<void> {
    // For local development - load from file system
    const fs = await import('fs');
    const path = await import('path');
    
    if (!this.config.localPath) return;

    try {
      const files = fs.readdirSync(this.config.localPath);
      for (const file of files) {
        if (file.endsWith('.parquet')) {
          console.log(`📄 Loading local Parquet file: ${file}`);
          const filePath = path.join(this.config.localPath, file);
          const buffer = fs.readFileSync(filePath);
          await this.parseParquetBuffer(buffer, file);
        }
      }
    } catch (error) {
      console.error(`Failed to load local Parquet files: ${error}`);
      throw error;
    }
  }

  private async loadParquetFile(blobName: string): Promise<void> {
    if (!this.containerClient) throw new Error('Container client not initialized');

    try {
      const blobClient = this.containerClient.getBlobClient(blobName);
      const downloadResponse = await blobClient.download();
      
      if (!downloadResponse.readableStreamBody) {
        throw new Error(`Failed to download blob: ${blobName}`);
      }

      const buffer = await this.streamToBuffer(downloadResponse.readableStreamBody);
      await this.parseParquetBuffer(buffer, blobName);
    } catch (error) {
      console.error(`Failed to load Parquet file ${blobName}: ${error}`);
      throw error;
    }
  }

  private async parseParquetBuffer(buffer: Buffer, fileName: string): Promise<void> {
    try {
      const reader = await parquet.ParquetReader.openBuffer(buffer);
      const cursor = reader.getCursor();
      const data: any[] = [];

      let record;
      while ((record = await cursor.next())) {
        data.push(record);
      }

      await reader.close();

      // Store data by table name (filename without extension)
      const tableName = fileName.replace('.parquet', '').replace(/[^a-zA-Z0-9_]/g, '_');
      this.data.set(tableName, data);
      
      console.log(`✅ Loaded ${data.length} records from ${fileName} as table '${tableName}'`);
    } catch (error) {
      console.error(`Failed to parse Parquet file ${fileName}: ${error}`);
      throw error;
    }
  }

  private async streamToBuffer(readableStream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      readableStream.on('data', (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      readableStream.on('error', reject);
    });
  }

  async disconnect(): Promise<void> {
    this.data.clear();
    this.connected = false;
    console.log(`🔌 Disconnected from Parquet data source: ${this.name}`);
  }

  async query(request: QueryRequest): Promise<QueryResult> {
    if (!this.connected) {
      throw new Error('Not connected to Parquet data source');
    }

    try {
      const startTime = Date.now();

      // Create tables object for alasql
      const tables: Record<string, any[]> = {};
      for (const [tableName, tableData] of this.data.entries()) {
        tables[tableName] = tableData;
      }

      // Execute SQL query using alasql
      const result = alasql(request.sql, [tables]);
      const executionTime = Date.now() - startTime;

      return {
        rows: Array.isArray(result) ? result : [result],
        rowCount: Array.isArray(result) ? result.length : 1,
        executionTime,
        metadata: {
          availableTables: Array.from(this.data.keys()),
          totalRecords: Array.from(this.data.values()).reduce((sum, table) => sum + table.length, 0)
        }
      };
    } catch (error) {
      throw new Error(`Query execution failed: ${error}`);
    }
  }

  async getTables(): Promise<TableInfo[]> {
    const tables: TableInfo[] = [];

    for (const [tableName, tableData] of this.data.entries()) {
      if (tableData.length === 0) continue;

      // Get column info from first record
      const sampleRecord = tableData[0];
      const columns = Object.keys(sampleRecord).map(key => ({
        name: key,
        type: typeof sampleRecord[key] === 'number' ? 'numeric' : 
              sampleRecord[key] instanceof Date ? 'datetime' : 'text',
        nullable: true
      }));

      tables.push({
        name: tableName,
        schema: 'public',
        columns,
        rowCount: tableData.length
      });
    }

    return tables;
  }

  async getTableData(tableName: string, limit: number = 100): Promise<any[]> {
    const tableData = this.data.get(tableName);
    if (!tableData) {
      throw new Error(`Table '${tableName}' not found`);
    }

    return tableData.slice(0, limit);
  }

  // Helper method to get all available data for dashboard
  getAllData(): Map<string, any[]> {
    return new Map(this.data);
  }

  // Helper method to get specific table data
  getTableDataSync(tableName: string): any[] | undefined {
    return this.data.get(tableName);
  }
}