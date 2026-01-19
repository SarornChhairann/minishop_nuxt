import { getPool } from '../../utils/db';

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id');
        const pool = getPool();
        const result = await pool.query('SELECT * FROM products WHERE product_id = $1 ', [id]);
        
        if (result.rows.length === 0) {
            throw createError({ statusCode: 404, statusMessage: 'Product not found' });
        }
        
        return result.rows[0];
    } catch (err: any) {
        console.error(err);
        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || 'Internal server error'
        });
    }
});
