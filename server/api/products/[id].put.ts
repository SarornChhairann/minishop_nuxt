export default defineEventHandler(async (event) => {
    const pool = getPool();
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        const id = getRouterParam(event, 'id');
        
        // Read multipart form data
        const body = await readMultipartFormData(event);
        if (!body) {
             throw createError({ statusCode: 400, statusMessage: 'No data provided' });
        }

        const getField = (name: string) => {
            const field = body.find(item => item.name === name);
            return field ? field.data.toString() : undefined;
        };

        const name = getField('name');
        const description = getField('description');
        const price = getField('price');
        const stock = getField('stock');
        const status = getField('status');

        if (!name || !price || stock === undefined) {
            await client.query('ROLLBACK');
            throw createError({ statusCode: 400, statusMessage: 'Missing required fields: name, price, stock' });
        }

        // Get existing product
        const existingProduct = await client.query(
            'SELECT image_url FROM products WHERE product_id = $1',
            [id]
        );

        if (existingProduct.rows.length === 0) {
            await client.query('ROLLBACK');
            throw createError({ statusCode: 404, statusMessage: 'Product not found' });
        }

        let imageUrl = existingProduct.rows[0].image_url;
        const imageFile = body.find(item => item.name === 'image');

        if (imageFile && imageFile.filename) {
            // Delete old image if it exists
            if (imageUrl) {
                await deleteFromCloudinary(imageUrl);
            }

            // Upload new image to cloud storage
            const uploadResult: any = await uploadToCloudinary(imageFile.data, imageFile.filename);
            imageUrl = uploadResult.secure_url;
        }

        const result = await client.query(
            'UPDATE products SET name = $1, description = $2, price = $3, stock = $4, image_url = $5, status = $6 WHERE product_id = $7 RETURNING *',
            [name, description, parseFloat(price as string), parseInt(stock as string), imageUrl, status || 'ACTIVE', id]
        );

        await client.query('COMMIT');
        return result.rows[0];
    } catch (err: any) {
        await client.query('ROLLBACK');
        console.error('Error updating product:', err);
        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || 'Internal server error',
            data: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    } finally {
        client.release();
    }
});
