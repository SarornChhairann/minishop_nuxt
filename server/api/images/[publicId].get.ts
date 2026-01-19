import { cloudinary } from '../../utils/cloudinary';

export default defineEventHandler(async (event) => {
    try {
        let publicId = getRouterParam(event, 'publicId');
        const query = getQuery(event);

        // Decode URL-encoded public_id
        if (publicId) {
            publicId = decodeURIComponent(publicId);
        }

        if (!publicId) {
            throw createError({ statusCode: 400, statusMessage: 'Public ID is required' });
        }

        // Generate Cloudinary URL with transformations
        const defaultOptions: any = {
            width: query.width || 800,
            height: query.height || null,
            crop: query.crop || 'limit',
            quality: query.quality || 'auto',
            format: query.format || 'auto',
            fetch_format: query.fetch_format || 'auto',
            ...query
        };

        // Remove null/undefined options
        Object.keys(defaultOptions).forEach(key => {
            if (defaultOptions[key] === null || defaultOptions[key] === undefined) {
                delete defaultOptions[key];
            }
        });

        // Generate image URL
        const imageUrl = cloudinary.url(publicId, {
            ...defaultOptions,
            secure: true,
            sign_url: process.env.NODE_ENV === 'production'
        });

        return sendRedirect(event, imageUrl, 302);

    } catch (error: any) {
        console.error('Error generating Cloudinary URL:', error);
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Failed to generate image URL',
            data: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
