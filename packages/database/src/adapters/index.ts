import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

export interface RunResult {
  rowsAffected: number;
  lastInsertRowId?: number | bigint;
}

export interface DatabaseExecutor {
  query<T = any>(sqlStr: string, params?: unknown[]): Promise<T[]>;
  queryOne<T = any>(sqlStr: string, params?: unknown[]): Promise<T | null>;
  execute(sqlStr: string, params?: unknown[]): Promise<RunResult>;
  transaction<T>(fn: (tx: DatabaseExecutor) => Promise<T>): Promise<T>;
  close(): void;
}

export class BetterSqlite3Adapter implements DatabaseExecutor {
  private db: Database.Database;

  constructor(dbPath: string | Database.Database) {
    if (typeof dbPath === 'string') {
      const dir = path.dirname(dbPath);
      if (dir && !fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      this.db = new Database(dbPath);
      this.db.pragma('journal_mode = WAL');
      this.db.pragma('foreign_keys = ON');
      this.db.pragma('busy_timeout = 5000');
    } else {
      this.db = dbPath;
    }
  }

  public getRawDb(): Database.Database {
    return this.db;
  }

  async query<T = any>(sqlStr: string, params: unknown[] = []): Promise<T[]> {
    const stmt = this.db.prepare(sqlStr);
    return stmt.all(...params) as T[];
  }

  async queryOne<T = any>(sqlStr: string, params: unknown[] = []): Promise<T | null> {
    const stmt = this.db.prepare(sqlStr);
    const row = stmt.get(...params);
    return (row as T) ?? null;
  }

  async execute(sqlStr: string, params: unknown[] = []): Promise<RunResult> {
    const stmt = this.db.prepare(sqlStr);
    const info = stmt.run(...params);
    return {
      rowsAffected: info.changes,
      lastInsertRowId: info.lastInsertRowid,
    };
  }

  async transaction<T>(fn: (tx: DatabaseExecutor) => Promise<T>): Promise<T> {
    // BetterSqlite3 supports synchronous transaction wrapper
    // Because fn is async, we execute BEGIN/COMMIT/ROLLBACK explicitly to guarantee isolation
    this.db.exec('BEGIN IMMEDIATE');
    try {
      const result = await fn(this);
      this.db.exec('COMMIT');
      return result;
    } catch (err) {
      try {
        this.db.exec('ROLLBACK');
      } catch (rollbackErr) {
        // Rollback failed, possibly connection closed
      }
      throw err;
    }
  }

  close(): void {
    if (this.db && this.db.open) {
      this.db.close();
    }
  }
}

/**
 * Cloudflare D1 Database Adapter for Profile B (Commercial Edge Target)
 */
export class D1Adapter implements DatabaseExecutor {
  private d1: any;

  constructor(d1Binding: any) {
    this.d1 = d1Binding;
  }

  async query<T = any>(sqlStr: string, params: unknown[] = []): Promise<T[]> {
    const stmt = this.d1.prepare(sqlStr).bind(...params);
    const result = await stmt.all();
    return (result.results ?? []) as T[];
  }

  async queryOne<T = any>(sqlStr: string, params: unknown[] = []): Promise<T | null> {
    const stmt = this.d1.prepare(sqlStr).bind(...params);
    const row = await stmt.first();
    return (row as T) ?? null;
  }

  async execute(sqlStr: string, params: unknown[] = []): Promise<RunResult> {
    const stmt = this.d1.prepare(sqlStr).bind(...params);
    const result = await stmt.run();
    return {
      rowsAffected: result.meta?.changes ?? 0,
      lastInsertRowId: result.meta?.last_row_id,
    };
  }

  async transaction<T>(fn: (tx: DatabaseExecutor) => Promise<T>): Promise<T> {
    // D1 batch execution or simulated transaction boundary
    return await fn(this);
  }

  close(): void {
    // D1 bindings are managed by Cloudflare runtime
  }
}

export function createDatabaseAdapter(
  mode: string = process.env.DATABASE_MODE || 'local',
  dbPath: string = process.env.DATABASE_PATH || './data/momera.sqlite',
  d1Binding?: any
): DatabaseExecutor {
  if (mode === 'd1' && d1Binding) {
    return new D1Adapter(d1Binding);
  }
  return new BetterSqlite3Adapter(dbPath);
}
