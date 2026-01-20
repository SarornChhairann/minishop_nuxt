import { Pool } from 'pg';

let pool: Pool | null = null;

export const getPool = () => {
    if (!pool) {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
            console.error('❌ DATABASE_URL is missing in environment variables');
            throw new Error('DATABASE_URL is not defined');
        }

        pool = new Pool({
            connectionString: connectionString.replace('sslmode=require', 'sslmode=verify-full'),
            max: 1,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000
        });
        console.log('Connected to Neon DB');
    }
    return pool;
};
