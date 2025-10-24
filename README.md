# Storefront Backend Project

A RESTful API for an online storefront built with Node.js, Express, TypeScript, and PostgreSQL. This API provides endpoints for managing users, products, and orders with JWT authentication.

## Table of Contents
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [API Endpoints](#api-endpoints)
- [Ports](#ports)

## Technologies Used

This application uses the following technologies and libraries:
- **PostgreSQL** - Database
- **Node.js & Express** - Application server and routing
- **TypeScript** - Type-safe JavaScript
- **dotenv** - Environment variable management
- **db-migrate** - Database migrations
- **jsonwebtoken (JWT)** - Authentication and authorization
- **bcrypt** - Password hashing
- **Jasmine** - Testing framework
- **Docker & Docker Compose** - Containerization

## Getting Started

### Prerequisites
- Docker and Docker Compose installed
- OR Node.js (v18 or higher) and PostgreSQL (v15) installed locally

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd creating_api_with_postgrsl_express
```

2. **Install dependencies** (if running locally without Docker)
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add the following required variables:
```env
# Postgres container setup
POSTGRES_USER=admin
POSTGRES_PASSWORD=password
POSTGRES_DB=store_front

# Application database config
DB_HOST=postgres
DB_PORT=5432
DB_NAME=store_front
DB_USER=admin
DB_PASSWORD=password

# Test database
TEST_DB_NAME=store_front_test

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this

# Application Port
PORT=3000

# Bcrypt Configuration
BCRYPT_PASSWORD=your-pepper-secret-key
SALT_ROUNDS=10
```

**Important**: For production, make sure to:
- Change all passwords and secrets
- Use strong, randomly generated values for `JWT_SECRET` and `BCRYPT_PASSWORD`
- Never commit the `.env` file to version control

## Database Setup

### Using Docker (Recommended)

The database will be automatically created and migrations will run when using Docker Compose.

```bash
docker compose up app --build
```

### Manual Setup (Local Development)

1. **Create the databases**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create databases
CREATE DATABASE store_front;
CREATE DATABASE store_front_test;

# Create user and grant permissions
CREATE USER admin WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE store_front TO admin;
GRANT ALL PRIVILEGES ON DATABASE store_front_test TO admin;
```

2. **Run migrations**
```bash
# For development database
npm run migrate:up

# For test database
npm run migrate:test
```

### Database Schema

The application uses the following tables:
- **users** - Stores user information with hashed passwords
- **products** - Stores product catalog
- **orders** - Stores order information linked to users
- **orderitem** - Junction table linking orders and products with quantities

See [REQUIREMENTS.md](./REQUIREMENTS.md) for detailed database schema.

## Environment Variables

All required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| POSTGRES_USER | PostgreSQL container user | admin |
| POSTGRES_PASSWORD | PostgreSQL container password | password |
| POSTGRES_DB | PostgreSQL container database | store_front |
| DB_HOST | Database host | postgres (Docker) or localhost |
| DB_PORT | Database port | 5432 |
| DB_NAME | Application database name | store_front |
| DB_USER | Database user | admin |
| DB_PASSWORD | Database password | password |
| TEST_DB_NAME | Test database name | store_front_test |
| JWT_SECRET | Secret key for JWT tokens | your-secret-key |
| PORT | Application port | 3000 |
| BCRYPT_PASSWORD | Pepper for password hashing | your-pepper-secret |
| SALT_ROUNDS | Bcrypt salt rounds | 10 |

## Running the Application

### Docker Compose (Recommended)

| Mode | Command | Description |
|------|---------|-------------|
| **Production** | `docker compose up app --build` | Run in production mode |
| **Development** | `docker compose up app-dev --build` | Run with hot reload |
| **Tests** | `docker compose up app-test --build` | Run test suite |

### Local Development (Without Docker)

1. **Make sure PostgreSQL is running and databases are created**

2. **Run migrations**
```bash
npm run migrate:up
```

3. **Start the development server**
```bash
npm run dev
```

4. **Or build and start production server**
```bash
npm run build
npm start
```

## Running Tests

### Using Docker
```bash
docker compose up app-test --build
```

### Locally
```bash
# Set up test database
npm run migrate:test

# Run tests
npm test
```

## API Endpoints

See [REQUIREMENTS.md](./REQUIREMENTS.md) for complete API documentation.

### Quick Reference

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/id/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products` - Create product [requires token]

#### Users
- `POST /api/users` - Register new user (returns token)
- `POST /api/users/login` - Login user (returns token)
- `GET /api/users` - Get all users [requires token]
- `GET /api/users/:id` - Get user by ID [requires token]
- `PUT /api/users/:id` - Update user [requires token]
- `DELETE /api/users/:id` - Delete user [requires token]

#### Orders
- `POST /api/orders` - Create new order [requires token]
- `GET /api/orders/user/:userId/current` - Get active order [requires token]
- `GET /api/orders/user/:userId/completed` - Get completed orders [requires token]
- `POST /api/orders/:id/products` - Add product to order [requires token]

### Authentication

Protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

To get a token:
1. Register: `POST /api/users` with `{ firstName, lastName, password }`
2. Or Login: `POST /api/users/login` with `{ firstName, password }`
3. Use the returned token in the Authorization header

## Ports

- **Application**: `3000`
- **PostgreSQL Database**: `5432`

## Project Structure

```
├── src/
│   ├── config/           # Configuration files (database, env validation, constants)
│   ├── controllers/      # Route controllers (business logic)
│   ├── helpers/          # Helper functions (JWT generation)
│   ├── middlewares/      # Express middlewares (auth, validation, error handling)
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── tests/            # Test files
│   ├── utils/            # Utility functions (validators)
│   └── server.ts         # Application entry point
├── migrations/           # Database migration files
├── docker-compose.yml    # Docker Compose configuration
├── Dockerfile            # Docker image configuration
├── package.json          # NPM dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── REQUIREMENTS.md       # API requirements and documentation
└── README.md            # This file
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm test` - Run test suite
- `npm run migrate:up` - Run database migrations (development)
- `npm run migrate:down` - Rollback last migration
- `npm run migrate:test` - Run migrations on test database

## Notes

- All passwords are hashed using bcrypt before storage
- JWT tokens expire after 15 minutes (configurable)
- The API uses rate limiting to prevent abuse (100 requests per 15 minutes)
- Authentication endpoints have stricter rate limiting (5 attempts per 15 minutes)
- All database queries use parameterized statements to prevent SQL injection

## Troubleshooting

### Docker issues
- If containers fail to start, ensure ports 3000 and 5432 are not in use
- Run `docker compose down` to clean up before rebuilding

### Database connection issues
- Verify environment variables are correctly set
- Ensure PostgreSQL is running
- Check database user has proper permissions

### Migration issues
- Ensure database exists before running migrations
- Check database.json configuration matches your environment

## License

This project is part of the Udacity Full Stack JavaScript Developer Nanodegree program.
