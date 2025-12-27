import Assignment from '../models/Assignment.js';

const sampleAssignments = [
  {
    title: "Select All Employees",
    difficulty: "easy",
    description: "Write a query to retrieve all employee records from the employees table.",
    tableName: "employees",
    schema: [
      { name: "id", type: "INTEGER", key: "PK" },
      { name: "name", type: "VARCHAR(100)", key: "" },
      { name: "email", type: "VARCHAR(100)", key: "" },
      { name: "department", type: "VARCHAR(50)", key: "" },
      { name: "salary", type: "DECIMAL(10,2)", key: "" }
    ],
    sampleData: [
      { id: 1, name: "Alice Johnson", email: "alice@example.com", department: "Engineering", salary: 75000 },
      { id: 2, name: "Bob Smith", email: "bob@example.com", department: "Marketing", salary: 65000 },
      { id: 3, name: "Carol Davis", email: "carol@example.com", department: "Engineering", salary: 80000 }
    ],
    expectedQuery: "SELECT * FROM employees;",
    hints: ["You need to select all columns", "Use the SELECT statement with * wildcard"],
    category: "select"
  },
  {
    title: "Filter High Salary Employees",
    difficulty: "easy",
    description: "Write a query to find all employees with a salary greater than $70,000.",
    tableName: "employees",
    schema: [
      { name: "id", type: "INTEGER", key: "PK" },
      { name: "name", type: "VARCHAR(100)", key: "" },
      { name: "email", type: "VARCHAR(100)", key: "" },
      { name: "department", type: "VARCHAR(50)", key: "" },
      { name: "salary", type: "DECIMAL(10,2)", key: "" }
    ],
    sampleData: [
      { id: 1, name: "Alice Johnson", email: "alice@example.com", department: "Engineering", salary: 75000 },
      { id: 2, name: "Bob Smith", email: "bob@example.com", department: "Marketing", salary: 65000 },
      { id: 3, name: "Carol Davis", email: "carol@example.com", department: "Engineering", salary: 80000 }
    ],
    expectedQuery: "SELECT * FROM employees WHERE salary > 70000;",
    hints: ["Use the WHERE clause to filter results", "Compare salary using the > operator"],
    category: "select"
  },
  {
    title: "Join Orders and Customers",
    difficulty: "medium",
    description: "Write a query to retrieve all orders along with customer names.",
    tableName: "orders, customers",
    schema: [
      { name: "orders.id", type: "INTEGER", key: "PK" },
      { name: "orders.customer_id", type: "INTEGER", key: "FK" },
      { name: "orders.order_date", type: "DATE", key: "" },
      { name: "orders.total", type: "DECIMAL(10,2)", key: "" },
      { name: "customers.id", type: "INTEGER", key: "PK" },
      { name: "customers.name", type: "VARCHAR(100)", key: "" }
    ],
    sampleData: [
      { order_id: 101, customer_id: 1, order_date: "2024-01-15", total: 250.00, customer_name: "John Doe" },
      { order_id: 102, customer_id: 2, order_date: "2024-01-16", total: 180.50, customer_name: "Jane Smith" }
    ],
    expectedQuery: "SELECT orders.*, customers.name FROM orders JOIN customers ON orders.customer_id = customers.id;",
    hints: ["You need to combine two tables", "Use JOIN with ON clause to match customer_id"],
    category: "join"
  },
  {
    title: "Count Employees by Department",
    difficulty: "easy",
    description: "Write a query to count how many employees work in each department.",
    tableName: "employees",
    schema: [
      { name: "id", type: "INTEGER", key: "PK" },
      { name: "name", type: "VARCHAR(100)", key: "" },
      { name: "department", type: "VARCHAR(50)", key: "" },
      { name: "salary", type: "DECIMAL(10,2)", key: "" }
    ],
    sampleData: [
      { id: 1, name: "Alice Johnson", department: "Engineering", salary: 75000 },
      { id: 2, name: "Bob Smith", department: "Marketing", salary: 65000 },
      { id: 3, name: "Carol Davis", department: "Engineering", salary: 80000 },
      { id: 4, name: "David Wilson", department: "Sales", salary: 70000 }
    ],
    expectedQuery: "SELECT department, COUNT(*) as employee_count FROM employees GROUP BY department;",
    hints: ["Use COUNT(*) to count rows", "GROUP BY department to group results"],
    category: "aggregate"
  },
  {
    title: "Average Salary by Department",
    difficulty: "medium",
    description: "Write a query to find the average salary for each department, ordered by average salary descending.",
    tableName: "employees",
    schema: [
      { name: "id", type: "INTEGER", key: "PK" },
      { name: "name", type: "VARCHAR(100)", key: "" },
      { name: "department", type: "VARCHAR(50)", key: "" },
      { name: "salary", type: "DECIMAL(10,2)", key: "" }
    ],
    sampleData: [
      { id: 1, name: "Alice Johnson", department: "Engineering", salary: 75000 },
      { id: 2, name: "Bob Smith", department: "Marketing", salary: 65000 },
      { id: 3, name: "Carol Davis", department: "Engineering", salary: 80000 },
      { id: 5, name: "Eve Martinez", department: "Engineering", salary: 85000 }
    ],
    expectedQuery: "SELECT department, AVG(salary) as avg_salary FROM employees GROUP BY department ORDER BY avg_salary DESC;",
    hints: ["Use AVG() function for average", "ORDER BY to sort results"],
    category: "aggregate"
  },
  {
    title: "Find Products Below Average Price",
    difficulty: "medium",
    description: "Write a query to find all products with a price below the average product price.",
    tableName: "products",
    schema: [
      { name: "id", type: "INTEGER", key: "PK" },
      { name: "name", type: "VARCHAR(100)", key: "" },
      { name: "category", type: "VARCHAR(50)", key: "" },
      { name: "price", type: "DECIMAL(10,2)", key: "" }
    ],
    sampleData: [
      { id: 1, name: "Laptop", category: "Electronics", price: 1200.00 },
      { id: 2, name: "Mouse", category: "Electronics", price: 25.00 },
      { id: 3, name: "Keyboard", category: "Electronics", price: 75.00 }
    ],
    expectedQuery: "SELECT * FROM products WHERE price < (SELECT AVG(price) FROM products);",
    hints: ["Use a subquery to calculate average", "Compare price with the subquery result"],
    category: "subquery"
  },
  {
    title: "Customers with Orders",
    difficulty: "medium",
    description: "Write a query to find all customers who have placed at least one order.",
    tableName: "customers, orders",
    schema: [
      { name: "customers.id", type: "INTEGER", key: "PK" },
      { name: "customers.name", type: "VARCHAR(100)", key: "" },
      { name: "customers.email", type: "VARCHAR(100)", key: "" },
      { name: "orders.id", type: "INTEGER", key: "PK" },
      { name: "orders.customer_id", type: "INTEGER", key: "FK" }
    ],
    sampleData: [
      { id: 1, name: "John Doe", email: "john@customer.com", has_orders: "Yes" },
      { id: 2, name: "Jane Smith", email: "jane@customer.com", has_orders: "Yes" },
      { id: 3, name: "Mike Johnson", email: "mike@customer.com", has_orders: "Yes" }
    ],
    expectedQuery: "SELECT DISTINCT customers.* FROM customers JOIN orders ON customers.id = orders.customer_id;",
    hints: ["Use DISTINCT to avoid duplicates", "JOIN customers with orders table"],
    category: "join"
  },
  {
    title: "Top 3 Highest Paid Employees",
    difficulty: "easy",
    description: "Write a query to find the top 3 highest paid employees.",
    tableName: "employees",
    schema: [
      { name: "id", type: "INTEGER", key: "PK" },
      { name: "name", type: "VARCHAR(100)", key: "" },
      { name: "department", type: "VARCHAR(50)", key: "" },
      { name: "salary", type: "DECIMAL(10,2)", key: "" }
    ],
    sampleData: [
      { id: 5, name: "Eve Martinez", department: "Engineering", salary: 85000 },
      { id: 3, name: "Carol Davis", department: "Engineering", salary: 80000 },
      { id: 1, name: "Alice Johnson", department: "Engineering", salary: 75000 }
    ],
    expectedQuery: "SELECT * FROM employees ORDER BY salary DESC LIMIT 3;",
    hints: ["Use ORDER BY to sort by salary", "Use LIMIT to restrict results"],
    category: "select"
  },
  {
    title: "Total Revenue by Customer",
    difficulty: "medium",
    description: "Write a query to calculate the total order amount for each customer.",
    tableName: "customers, orders",
    schema: [
      { name: "customers.id", type: "INTEGER", key: "PK" },
      { name: "customers.name", type: "VARCHAR(100)", key: "" },
      { name: "orders.id", type: "INTEGER", key: "PK" },
      { name: "orders.customer_id", type: "INTEGER", key: "FK" },
      { name: "orders.total", type: "DECIMAL(10,2)", key: "" }
    ],
    sampleData: [
      { customer_name: "John Doe", total_spent: 1325.00 },
      { customer_name: "Jane Smith", total_spent: 325.00 },
      { customer_name: "Mike Johnson", total_spent: 550.00 }
    ],
    expectedQuery: "SELECT customers.name, SUM(orders.total) as total_spent FROM customers JOIN orders ON customers.id = orders.customer_id GROUP BY customers.name;",
    hints: ["Use SUM() to calculate total", "JOIN customers with orders", "GROUP BY customer name"],
    category: "aggregate"
  },
  {
    title: "Products Not in Any Order",
    difficulty: "hard",
    description: "Write a query to find products that have never been ordered.",
    tableName: "products, order_items",
    schema: [
      { name: "products.id", type: "INTEGER", key: "PK" },
      { name: "products.name", type: "VARCHAR(100)", key: "" },
      { name: "order_items.product_id", type: "INTEGER", key: "FK" }
    ],
    sampleData: [
      { id: 3, name: "Keyboard", category: "Electronics" }
    ],
    expectedQuery: "SELECT * FROM products WHERE id NOT IN (SELECT DISTINCT product_id FROM order_items);",
    hints: ["Use NOT IN with a subquery", "Subquery should get all ordered product IDs"],
    category: "subquery"
  },
  {
    title: "Employees Earning More Than Their Department Average",
    difficulty: "hard",
    description: "Write a query to find employees who earn more than the average salary in their department.",
    tableName: "employees",
    schema: [
      { name: "id", type: "INTEGER", key: "PK" },
      { name: "name", type: "VARCHAR(100)", key: "" },
      { name: "department", type: "VARCHAR(50)", key: "" },
      { name: "salary", type: "DECIMAL(10,2)", key: "" }
    ],
    sampleData: [
      { id: 5, name: "Eve Martinez", department: "Engineering", salary: 85000 },
      { id: 3, name: "Carol Davis", department: "Engineering", salary: 80000 }
    ],
    expectedQuery: "SELECT e1.* FROM employees e1 WHERE salary > (SELECT AVG(salary) FROM employees e2 WHERE e2.department = e1.department);",
    hints: ["Use a correlated subquery", "Compare each employee's salary with their department average", "Use table aliases"],
    category: "advanced"
  },
  {
    title: "List All Departments with Employee Names",
    difficulty: "easy",
    description: "Write a query to list department names along with employee names, ordered by department.",
    tableName: "employees",
    schema: [
      { name: "id", type: "INTEGER", key: "PK" },
      { name: "name", type: "VARCHAR(100)", key: "" },
      { name: "department", type: "VARCHAR(50)", key: "" }
    ],
    sampleData: [
      { department: "Engineering", name: "Alice Johnson" },
      { department: "Engineering", name: "Carol Davis" },
      { department: "Marketing", name: "Bob Smith" }
    ],
    expectedQuery: "SELECT department, name FROM employees ORDER BY department, name;",
    hints: ["Select department and name columns", "ORDER BY can take multiple columns"],
    category: "select"
  },
  {
    title: "Find High Salary Employees",
    difficulty: "easy",
    description: "List all employees earning more than 50,000",
    tableName: "employees",
    schema: [
      { name: "id", type: "INTEGER", key: "PK" },
      { name: "name", type: "TEXT", key: "" },
      { name: "salary", type: "INTEGER", key: "" },
      { name: "department", type: "TEXT", key: "" }
    ],
    sampleData: [
      { id: 1, name: "Alice", salary: 45000, department: "HR" },
      { id: 2, name: "Bob", salary: 60000, department: "Engineering" },
      { id: 3, name: "Charlie", salary: 75000, department: "Engineering" },
      { id: 4, name: "Diana", salary: 48000, department: "Sales" }
    ],
    expectedQuery: "SELECT * FROM employees WHERE salary > 50000;",
    hints: ["Use WHERE clause to filter by salary", "Compare salary using > operator"],
    category: "select"
  },
  {
    title: "Department-wise Employee Count",
    difficulty: "medium",
    description: "Find the number of employees in each department",
    tableName: "employees",
    schema: [
      { name: "id", type: "INTEGER", key: "PK" },
      { name: "name", type: "TEXT", key: "" },
      { name: "department", type: "TEXT", key: "" }
    ],
    sampleData: [
      { id: 1, name: "Alice", department: "HR" },
      { id: 2, name: "Bob", department: "Engineering" },
      { id: 3, name: "Charlie", department: "Engineering" },
      { id: 4, name: "Diana", department: "Sales" },
      { id: 5, name: "Eve", department: "Sales" }
    ],
    expectedQuery: "SELECT department, COUNT(*) as count FROM employees GROUP BY department;",
    hints: ["Use COUNT(*) to count employees", "GROUP BY department to group results"],
    category: "aggregate"
  },
  {
    title: "Total Order Value per Customer",
    difficulty: "medium",
    description: "Find total order value for each customer",
    tableName: "customers, orders",
    schema: [
      { name: "customers.id", type: "INTEGER", key: "PK" },
      { name: "customers.name", type: "TEXT", key: "" },
      { name: "orders.id", type: "INTEGER", key: "PK" },
      { name: "orders.customer_id", type: "INTEGER", key: "FK" },
      { name: "orders.amount", type: "REAL", key: "" }
    ],
    sampleData: [
      { id: 1, name: "Aman", total_amount: 2000.5 },
      { id: 2, name: "Saurabh", total_amount: 1500.0 }
    ],
    expectedQuery: "SELECT customers.name, SUM(orders.amount) as total_amount FROM customers JOIN orders ON customers.id = orders.customer_id GROUP BY customers.name;",
    hints: ["Use JOIN to combine customers and orders", "Use SUM() and GROUP BY for totals"],
    category: "join"
  },
  {
    title: "Highest Paid Employee",
    difficulty: "hard",
    description: "Find the employee(s) with the highest salary",
    tableName: "employees",
    schema: [
      { name: "id", type: "INTEGER", key: "PK" },
      { name: "name", type: "TEXT", key: "" },
      { name: "salary", type: "INTEGER", key: "" }
    ],
    sampleData: [
      { id: 1, name: "Alice", salary: 70000 },
      { id: 2, name: "Bob", salary: 85000 },
      { id: 3, name: "Charlie", salary: 85000 }
    ],
    expectedQuery: "SELECT * FROM employees WHERE salary = (SELECT MAX(salary) FROM employees);",
    hints: ["Use a subquery with MAX()", "Filter WHERE salary equals the maximum"],
    category: "subquery"
  }
];

export const seedDatabase = async () => {
  try {
    await Assignment.deleteMany({});
    console.log('Cleared existing assignments');

    const result = await Assignment.insertMany(sampleAssignments);
    console.log(`✅ Seeded ${result.length} assignments`);
    
    return result;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  import('../config/database.js').then(async ({ connectMongoDB }) => {
    await connectMongoDB();
    await seedDatabase();
    process.exit(0);
  });
}
