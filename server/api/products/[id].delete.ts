export default defineEventHandler(async (event) => {
    const pool = getPool();
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        const id = getRouterParam(event, 'id');

        const orderItem = await client.query(
            'SELECT * FROM order_items WHERE product_id = $1',
            [id]
        );

        if (orderItem.rows.length > 0) {
            await client.query('ROLLBACK');
            throw createError({ statusCode: 400, statusMessage: 'Product cannot be deleted as it is in an order' });
        }

        const result = await client.query(
            'DELETE FROM products WHERE product_id = $1 RETURNING product_id, image_url',
            [id]
        );

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            throw createError({ statusCode: 404, statusMessage: 'Product not found' });
        }

        const imageUrl = result.rows[0].image_url;
        if(imageUrl){
            await deleteFromCloudinary(imageUrl);
        }

        await client.query('COMMIT');
        setResponseStatus(event, 204);
        return null;
    } catch (err: any) {
        await client.query('ROLLBACK');
        console.error('❌ Error deleting product:', err);
        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || 'Internal server error'
        });
    } finally {
        client.release();
    }
});
