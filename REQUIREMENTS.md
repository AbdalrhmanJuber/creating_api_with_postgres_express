# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints

### Products
- **Index**: `GET /api/products` - Get all products (no authentication required)
- **Show**: `GET /api/products/id/:id` - Get a specific product by ID (no authentication required)
- **Create**: `POST /api/products` - Create a new product [token required]
- **[OPTIONAL] Products by category**: `GET /api/products/category/:category` - Get products by category (no authentication required)

### Users
- **Index**: `GET /api/users` - Get all users [token required]
- **Show**: `GET /api/users/:id` - Get a specific user by ID [token required]
- **Create (Register)**: `POST /api/users` - Create a new user (registration - no token required, returns token)
- **Update**: `PUT /api/users/:id` - Update a user [token required]
- **Delete**: `DELETE /api/users/:id` - Delete a user [token required]
- **Authenticate (Login)**: `POST /api/users/login` - Login user (returns JWT token)

### Orders
- **Current Order by user**: `GET /api/orders/user/:userId/current` - Get current (active) order for a user [token required]
- **[OPTIONAL] Completed Orders by user**: `GET /api/orders/user/:userId/completed` - Get completed orders for a user [token required]
- **Create Order**: `POST /api/orders` - Create a new order [token required]
- **Add Product to Order**: `POST /api/orders/:id/products` - Add a product to an order [token required]

## Data Shapes

### Product
**Table: `products`**
- id: `SERIAL PRIMARY KEY`
- name: `VARCHAR(255) NOT NULL`
- price: `INTEGER NOT NULL`
- category: `VARCHAR(255)`

### User
**Table: `users`**
- id: `SERIAL PRIMARY KEY`
- firstName: `VARCHAR(255) NOT NULL`
- lastName: `VARCHAR(255) NOT NULL`
- password: `VARCHAR(255) NOT NULL` (bcrypt hashed)

### Orders
**Table: `orders`**
- id: `SERIAL PRIMARY KEY`
- user_id: `INTEGER NOT NULL` [foreign key to users table]
- status: `VARCHAR(255)` (active or complete)

**Table: `orderitem`** (junction table for many-to-many relationship)
- id: `SERIAL PRIMARY KEY`
- order_id: `INTEGER NOT NULL` [foreign key to orders table]
- product_id: `INTEGER NOT NULL` [foreign key to products table]
- quantity: `INTEGER NOT NULL`

## Database Schema

### Entity Relationship Diagram

```
users (1) ---< (many) orders
orders (1) ---< (many) orderitem
products (1) ---< (many) orderitem
```

### Database Tables

#### users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  "firstName" VARCHAR(255) NOT NULL,
  "lastName" VARCHAR(255) NOT NULL,
  "password" VARCHAR(255) NOT NULL
);
```

#### products
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  category VARCHAR(255)
);
```

#### orders
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  status VARCHAR(255),
  user_id INTEGER,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);
```

#### orderitem
```sql
CREATE TABLE orderitem (
  id SERIAL PRIMARY KEY,
  quantity INTEGER NOT NULL,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  CONSTRAINT fk_order
    FOREIGN KEY(order_id)
    REFERENCES orders(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_product
    FOREIGN KEY(product_id)
    REFERENCES products(id)
    ON DELETE CASCADE
);
```

