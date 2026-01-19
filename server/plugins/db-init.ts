import { getPool } from '../utils/db';

declare function defineNitroPlugin(fn: (nitroApp: any) => any): any;

export default defineNitroPlugin(async (nitroApp) => {
    const pool = getPool();
    const client = await pool.connect();

    // SQL schema
    const schemaSQL = `
    -- Products table
    CREATE TABLE IF NOT EXISTS products (
        product_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description VARCHAR(500),
        price DECIMAL(10,2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        image_url VARCHAR(255),
        status VARCHAR(10) DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Orders table
    CREATE TABLE IF NOT EXISTS orders (
        order_id SERIAL PRIMARY KEY,
        customer_name VARCHAR(100) NOT NULL,
        customer_email VARCHAR(100) NOT NULL,
        customer_phone VARCHAR(20),
        shipping_address VARCHAR(255) NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Order items table
    CREATE TABLE IF NOT EXISTS order_items (
        order_item_id SERIAL PRIMARY KEY,
        order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
        product_id INT REFERENCES products(product_id),
        quantity INT NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL
    );
    `;

    // Create indexes
    const indexesSQL = `
    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
    CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
    CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
    CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
    CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
    `;

    try {
        console.log('🚀 Starting database initialization...');

        // Check if tables already exist
        const checkTables = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('products', 'orders', 'order_items')
        `);

        const existingTables = checkTables.rows.map(row => row.table_name);
        console.log('Existing tables:', existingTables.length > 0 ? existingTables.join(', ') : 'None');

        // Create tables
        console.log('🔨 Creating tables...');
        await client.query(schemaSQL);
        console.log('Tables created successfully');

        // Create indexes
        console.log('Creating indexes...');
        await client.query(indexesSQL);
        console.log('Indexes created successfully');

        // Verify tables
        const verifyTables = await client.query(`
            SELECT 
                table_name,
                (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
            FROM information_schema.tables t
            WHERE t.table_schema = 'public'
            AND t.table_name IN ('products', 'orders', 'order_items')
            ORDER BY table_name
        `);

        console.log('\nDatabase Schema Verified:');
        console.log('===========================');
        verifyTables.rows.forEach(table => {
            console.log(`${table.table_name} (${table.column_count} columns)`);
        });

        // Count records
        const productCount = await client.query('SELECT COUNT(*) as count FROM products');
        const orderCount = await client.query('SELECT COUNT(*) as count FROM orders');

        console.log('\n📊 Record Counts:');
        console.log(`   Products: ${productCount.rows[0].count}`);
        console.log(`   Orders: ${orderCount.rows[0].count}`);

        console.log('\nDatabase initialization completed successfully!');

    } catch (error: any) {
        console.error('Error initializing database:', error.message);
        // We don't want to crash the server if DB init fails (maybe temporary connection issue)
        // But logging it is important
    } finally {
        client.release();
    }
});
