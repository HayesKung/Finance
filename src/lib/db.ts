import { Pool } from "pg";

/**
 * Server-only Postgres access for the contract store.
 *
 * `src/lib/finpivot/contract-api.ts` dynamically imports `@/lib/db` and calls
 * `getSql().query<T>(sql, params?)`, which must resolve to the row array
 * itself (callers do `rows[0]` / `rows.filter(...)`), not a `{ rows }` wrapper.
 *
 * The connection string is read from the DATABASE_URL environment variable so
 * credentials never live in the repository.
 */

export type SqlQuery = <T = Record<string, unknown>>(
  text: string,
  params?: readonly unknown[],
) => Promise<T[]>;

export type Sql = {
  query: SqlQuery;
  transaction<T>(run: (query: SqlQuery) => Promise<T>): Promise<T>;
};

let pool: Pool | null = null;

function connection(): Pool {
  if (pool) return pool;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured");
  }
  pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });
  return pool;
}

export function getSql(): Sql {
  return {
    async query<T>(text: string, params: readonly unknown[] = []) {
      const result = await connection().query(text, params as unknown[]);
      return result.rows as T[];
    },
    async transaction<T>(run: (query: SqlQuery) => Promise<T>) {
      const client = await connection().connect();
      const query: SqlQuery = async <T,>(text: string, params: readonly unknown[] = []) => {
        const result = await client.query(text, params as unknown[]);
        return result.rows as T[];
      };
      try {
        await client.query("begin");
        const value = await run(query);
        await client.query("commit");
        return value;
      } catch (error) {
        await client.query("rollback");
        throw error;
      } finally {
        client.release();
      }
    },
  };
}
