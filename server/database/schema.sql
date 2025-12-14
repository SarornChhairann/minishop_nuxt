-- Products table
CREATE TABLE products (
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
CREATE TABLE orders (
                        order_id SERIAL PRIMARY KEY,
                        customer_name VARCHAR(100) NOT NULL,
                        customer_email VARCHAR(100) NOT NULL,
                        customer_phone VARCHAR(20),
                        shipping_address VARCHAR(255) NOT NULL,
                        total_amount DECIMAL(10,2) NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
                             order_item_id SERIAL PRIMARY KEY,
                             order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
                             product_id INT REFERENCES products(product_id),
                             quantity INT NOT NULL,
                             unit_price DECIMAL(10,2) NOT NULL,
                             subtotal DECIMAL(10,2) NOT NULL
);