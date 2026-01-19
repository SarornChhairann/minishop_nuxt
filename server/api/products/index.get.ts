import { getPool } from '../../utils/db';

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);
        const status = query.status as string;
        const search = query.search as string;

        // Build WHERE conditions dynamically
        const conditions: string[] = [];
        const params: any[] = [];
        let paramIndex = 1;

        // Status filter - if not provided, show all
        if (status && status.toLowerCase() !== 'all') {
            conditions.push(`status = $${paramIndex}`);
            params.push(status.toUpperCase());
            paramIndex++;
        }

        // Search by name or description
        if (search) {
            conditions.push(`(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
            params.push(`%${search}%`);
            paramIndex++;
        }

        // Build the SQL query
        let whereClause = '';
        if (conditions.length > 0) {
            whereClause = `WHERE ${conditions.join(' AND ')}`;
        }

        const sql = `
          SELECT * FROM products 
          ${whereClause}
          ORDER BY product_id
        `;

        const pool = getPool();
        const result = await pool.query(sql, params);
        return result.rows;

    } catch (err: any) {
        console.error('❌ Error fetching products:', err);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error',
            data: err.message
        });
    }
});
