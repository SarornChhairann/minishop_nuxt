import { getPool } from '../../utils/db';
import { uploadToCloudinary } from '../../utils/cloudinary';

export default defineEventHandler(async (event) => {
    try {
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
            throw createError({ statusCode: 400, statusMessage: 'Missing required fields: name, price, stock' });
        }

        let imageUrl = '';
        const imageFile = body.find(item => item.name === 'image');

        if (imageFile && imageFile.filename) {
             // Upload to cloud storage
             const uploadResult: any = await uploadToCloudinary(imageFile.data, imageFile.filename);
             imageUrl = uploadResult.secure_url;
        }

        const pool = getPool();
        const result = await pool.query(
            'INSERT INTO products (name, description, price, stock, image_url, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, description, parseFloat(price as string), parseInt(stock as string), imageUrl, status || 'ACTIVE']
        );

        setResponseStatus(event, 201);
        return result.rows[0];

    } catch (err: any) {
        console.error('Error creating product:', err);
        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || 'Internal server error',
            data: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});
