// Temporary stub for database to allow server to start without DATABASE_URL
import * as schema from "@shared/schema";

export const pool = {
  query: async () => ({ rows: [] }),
  connect: async () => ({}),
  end: async () => {},
};

export const db = {
  select: () => ({
    from: () => ({
      where: () => Promise.resolve([]),
    }),
  }),
  insert: () => ({
    values: () => ({
      returning: () => Promise.resolve([]),
    }),
  }),
  update: () => ({
    set: () => ({
      where: () => ({
        returning: () => Promise.resolve([]),
      }),
    }),
  }),
  delete: () => ({
    where: () => Promise.resolve([]),
  }),
};

export const getPool = async () => pool;
export const getDb = async () => db;