DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS employees CASCADE;
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(50) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    hire_date DATE DEFAULT CURRENT_DATE
);

INSERT INTO employees (name, email, department, salary, hire_date) VALUES
('Alice Johnson', 'alice@example.com', 'Engineering', 75000, '2022-01-15'),
('Bob Smith', 'bob@example.com', 'Marketing', 65000, '2022-03-20'),
('Carol Davis', 'carol@example.com', 'Engineering', 80000, '2021-11-10'),
('David Wilson', 'david@example.com', 'Sales', 70000, '2023-02-01'),
('Eve Martinez', 'eve@example.com', 'Engineering', 85000, '2020-06-15'),
('Frank Brown', 'frank@example.com', 'Marketing', 60000, '2023-05-10');

DROP TABLE IF EXISTS customers CASCADE;
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    city VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO customers (name, email, city) VALUES
('John Doe', 'john@customer.com', 'New York'),
('Jane Smith', 'jane@customer.com', 'Los Angeles'),
('Mike Johnson', 'mike@customer.com', 'Chicago'),
('Sarah Williams', 'sarah@customer.com', 'Houston');

DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0
);

INSERT INTO products (name, category, price, stock_quantity) VALUES
('Laptop', 'Electronics', 1200.00, 15),
('Mouse', 'Electronics', 25.00, 50),
('Keyboard', 'Electronics', 75.00, 30),
('Monitor', 'Electronics', 300.00, 20),
('Desk Chair', 'Furniture', 250.00, 10);

DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    order_date DATE DEFAULT CURRENT_DATE,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending'
);

INSERT INTO orders (customer_id, order_date, total, status) VALUES
(1, '2024-01-15', 1250.00, 'completed'),
(2, '2024-01-16', 325.00, 'completed'),
(1, '2024-01-20', 75.00, 'pending'),
(3, '2024-01-22', 550.00, 'completed');

DROP TABLE IF EXISTS order_items CASCADE;
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 1200.00),
(1, 2, 2, 25.00),
(2, 4, 1, 300.00),
(2, 2, 1, 25.00),
(3, 3, 1, 75.00),
(4, 5, 2, 250.00);

SELECT 'Employees:' as table_name, COUNT(*) as row_count FROM employees
UNION ALL
SELECT 'Customers:', COUNT(*) FROM customers
UNION ALL
SELECT 'Products:', COUNT(*) FROM products
UNION ALL
SELECT 'Orders:', COUNT(*) FROM orders
UNION ALL
SELECT 'Order Items:', COUNT(*) FROM order_items;
