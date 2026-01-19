export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id');
        const pool = getPool();

        const completeOrder = await pool.query(
            `SELECT o.*, 
                    json_agg(
                        json_build_object(
                            'product_id', oi.product_id,
                            'quantity', oi.quantity,
                            'unit_price', oi.unit_price,
                            'subtotal', oi.subtotal,
                            'product_name', p.name
                        )
                    ) as items
             FROM orders o
             LEFT JOIN order_items oi ON o.order_id = oi.order_id
             LEFT JOIN products p ON oi.product_id = p.product_id
             WHERE o.order_id = $1
             GROUP BY o.order_id`,
            [id]
        );

        if (completeOrder.rows.length === 0) {
            throw createError({ statusCode: 404, statusMessage: 'Order not found' });
        }

        return completeOrder.rows[0];
    } catch (e: any) {
        throw createError({
            statusCode: e.statusCode || 500,
            statusMessage: e.statusMessage || "Internal server error",
            data: process.env.NODE_ENV === 'development' ? e.message : undefined
        });
    }
});
