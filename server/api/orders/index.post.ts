export default defineEventHandler(async (event) => {
    const pool = getPool();
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const body = await readBody(event);
        const {
            customer_name,
            customer_email,
            customer_phone,
            shipping_address,
            items,
            total_amount
        } = body;

        if (!customer_name || !customer_email || !items || items.length === 0) {
            await client.query('ROLLBACK');
            throw createError({
                statusCode: 400, 
                statusMessage: 'Missing required fields: customer_name, customer_email, and at least one item is required'
            });
        }

        for (const item of items) {
            if (!item.product_id || !item.quantity || item.quantity <= 0) {
                await client.query('ROLLBACK');
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Each item must have a valid product_id and quantity greater than 0'
                });
            }

            const productCheck = await client.query(
                `SELECT p.product_id, p.name, p.price, p.stock, p.status 
                 FROM products p 
                 WHERE p.product_id = $1 
                 FOR UPDATE`,
                [item.product_id]
            );

            if (productCheck.rows.length === 0) {
                await client.query('ROLLBACK');
                throw createError({ statusCode: 404, statusMessage: `Product with ID ${item.product_id} not found` });
            }

            const product = productCheck.rows[0];

            if (product.status !== 'ACTIVE') {
                await client.query('ROLLBACK');
                throw createError({ statusCode: 400, statusMessage: `Product "${product.name}" is not available for purchase` });
            }

            if (product.stock < item.quantity) {
                await client.query('ROLLBACK');
                throw createError({ 
                    statusCode: 400, 
                    statusMessage: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}` 
                });
            }
        }

        const orderResult = await client.query(
            `INSERT INTO orders 
             (customer_name, customer_email, customer_phone, shipping_address, total_amount) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
            [customer_name, customer_email, customer_phone, shipping_address, total_amount]
        );

        const order = orderResult.rows[0];

        for (const item of items) {
            await client.query(
                `INSERT INTO order_items 
                 (order_id, product_id, quantity, unit_price, subtotal) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [order.order_id, item.product_id, item.quantity, item.price, item.subtotal]
            );

            await client.query(
                `UPDATE products 
                 SET stock = stock - $1 
                 WHERE product_id = $2`,
                [item.quantity, item.product_id]
            );
        }

        await client.query('COMMIT');
        setResponseStatus(event, 201);
        return order;

    } catch (err: any) {
        await client.query('ROLLBACK');
        console.error('Order creation error:', err);

        let status = 500;
        let message = 'Internal server error';

        if (err.statusCode) {
            status = err.statusCode;
            message = err.statusMessage;
        } else if (err.code === '23505') {
            status = 400;
            message = 'Duplicate order detected';
        } else if (err.code === '23503') {
            status = 400;
            message = 'Invalid product reference';
        } else if (err.code === '22003') {
            status = 400;
            message = 'Invalid numeric value';
        }

        throw createError({
            statusCode: status,
            statusMessage: message,
            data: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    } finally {
        client.release();
    }
});
