// Export all core components
export * from './core/types';
export { BaseConnector } from './core/BaseConnector';
export { DataSourceManager, dataSourceManager } from './core/DataSourceManager';

// Export connectors
export { MemoryConnector } from './connectors/MemoryConnector';
export { CSVConnector } from './connectors/CSVConnector';
export { RestAPIConnector } from './connectors/RestAPIConnector';

// Optional connectors - uncomment after installing dependencies
// export { ParquetConnector } from './connectors/ParquetConnector';  // REQUIRES: npm install duckdb
// export { PostgreSQLConnector } from './connectors/PostgreSQLConnector';  // REQUIRES: npm install pg pg-query-stream
// export { MongoDBConnector } from './connectors/MongoDBConnector';  // REQUIRES: npm install mongodb