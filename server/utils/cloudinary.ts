import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Initialize Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (fileBuffer: Buffer, fileName?: string, options = {}) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'products',
                public_id: fileName ? undefined : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                resource_type: 'auto',
                overwrite: false,
                ...options
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );

        const stream = Readable.from(fileBuffer);
        stream.pipe(uploadStream);
    });
};

export const deleteFromCloudinary = async (imageUrl: string) => {
    try {
        if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
            console.log('Not a Cloudinary URL, skipping deletion');
            return true;
        }

        // Extract public_id from Cloudinary URL
        const regex = /\/upload\/(?:v\d+\/)?(.+?)\.(?:jpg|png|gif|webp|jpeg)/;
        const match = imageUrl.match(regex);

        if (!match || !match[1]) {
            console.error('Could not extract public_id from URL:', imageUrl);
            return false;
        }

        const publicId = match[1];
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === 'ok') {
            console.log(`Deleted image: ${publicId}`);
            return true;
        } else {
            console.error('Failed to delete image:', result);
            return false;
        }
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        return false;
    }
};

export { cloudinary };
