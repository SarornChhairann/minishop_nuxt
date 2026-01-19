import { Pool } from 'pg';

let pool: Pool | null = null;

export const getPool = () => {
    if (!pool) {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            max: 1,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000
        });
    }
    return pool;
};
