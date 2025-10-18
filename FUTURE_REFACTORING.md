# Future Refactoring Recommendations

## Additional Improvements for Future Consideration

---

## 📋 Product Validation Middleware

### Priority: HIGH

Create validation for product creation similar to user validation.

```typescript
// src/middlewares/validateProduct.ts
import { Request, Response, NextFunction } from "express";

export const validateProductInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, price, category } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({
      message: "Missing required fields: name, price, category",
    });
  }

  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json({
      message: "Price must be a positive number",
    });
  }

  if (typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({
      message: "Name must be a non-empty string",
    });
  }

  next();
};
```

**Then update**: `src/routes/productRoutes.ts`
```typescript
router.post("/", authenticate, validateProductInput, controller.create.bind(controller));
```

---

## 🏗️ Base Controller Class

### Priority: MEDIUM

Reduce duplication across controllers with a base class.

```typescript
// src/controllers/BaseController.ts
import { Response } from "express";
import { ValidationError } from "../utils/validators";

export abstract class BaseController {
  /**
   * Handle errors consistently across all controllers
   */
  protected handleError(res: Response, error: unknown, context: string): Response {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message });
    }

    console.error(`Error in ${context}:`, error);
    return res.status(500).json({ message: "Internal server error" });
  }

  /**
   * Send a success response
   */
  protected success(res: Response, data: any, statusCode: number = 200): Response {
    return res.status(statusCode).json(data);
  }

  /**
   * Send a not found response
   */
  protected notFound(res: Response, message: string): Response {
    return res.status(404).json({ message });
  }
}
```

**Usage Example**:
```typescript
export class UserController extends BaseController {
  async getById(req: Request<IdParams>, res: Response) {
    try {
      const id = parseId(req.params?.id, "user");
      const user = await userModel.getById(id);
      
      if (!user) return this.notFound(res, "User not found");
      
      return this.success(res, user);
    } catch (error) {
      return this.handleError(res, error, "UserController.getById");
    }
  }
}
```

---

## 📦 Data Transfer Objects (DTOs)

### Priority: MEDIUM

Separate API response format from database models.

```typescript
// src/dtos/user.dto.ts
import { IUser } from "../models/User";

export class UserResponseDTO {
  id: number;
  firstName: string;
  lastName: string;

  constructor(user: IUser) {
    this.id = user.id!;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    // Note: password is never included
  }

  static fromUser(user: IUser): UserResponseDTO {
    return new UserResponseDTO(user);
  }

  static fromUsers(users: IUser[]): UserResponseDTO[] {
    return users.map((user) => new UserResponseDTO(user));
  }
}

export class UserCreateDTO {
  firstName: string;
  lastName: string;
  password: string;

  constructor(data: any) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.password = data.password;
  }
}
```

**Benefits**:
- Never accidentally expose sensitive data
- Easy to change API format without changing database
- Clear contract between frontend and backend

---

## 📝 Request Logging

### Priority: MEDIUM

Add proper HTTP request logging with Morgan.

```bash
npm install morgan
npm install --save-dev @types/morgan
```

```typescript
// src/server.ts
import morgan from "morgan";

// Add after express.json() middleware
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined")); // or "dev" for development
}
```

---

## 📊 Standardized API Response Format

### Priority: MEDIUM

Create a consistent response format across all endpoints.

```typescript
// src/types/responses.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    message: string;
    code?: string;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

// Helper function
export const createSuccessResponse = <T>(data: T, message?: string): ApiResponse<T> => {
  return {
    success: true,
    data,
    message,
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
};

export const createErrorResponse = (message: string, code?: string): ApiResponse<never> => {
  return {
    success: false,
    error: {
      message,
      code,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
};
```

---

## 🔐 Enhanced Authentication Middleware

### Priority: MEDIUM

Add user information to the request object with proper typing.

```typescript
// src/types/express.d.ts
import { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        firstName: string;
        lastName: string;
      };
    }
  }
}
```

```typescript
// Update src/middlewares/authMiddleware.ts
try {
  const decoded = jwt.verify(token, jwtSecret) as {
    id: number;
    firstName: string;
    lastName: string;
  };
  req.user = decoded; // Now properly typed!
  next();
} catch (err) {
  return res.status(401).json({ message: "Invalid or expired token" });
}
```

---

## 🔍 API Documentation with Swagger

### Priority: MEDIUM

Add OpenAPI/Swagger documentation.

```bash
npm install swagger-ui-express swagger-jsdoc
npm install --save-dev @types/swagger-ui-express @types/swagger-jsdoc
```

```typescript
// src/config/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Storefront API",
      version: "1.0.0",
      description: "Online storefront backend API",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"], // Path to API routes
};

export const swaggerSpec = swaggerJsdoc(options);
```

Then in routes:
```typescript
/**
 * @openapi
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post("/", validateUserInput, controller.create.bind(controller));
```

---

## 🧪 Better Test Utilities

### Priority: MEDIUM

Already started with test refactoring! Consider adding:

```typescript
// src/tests/helpers/testHelpers.ts
export class TestHelper {
  static async createTestUser(data = {}) {
    // ... existing code
  }

  static async cleanDatabase() {
    await pool.query("TRUNCATE users, products, orders CASCADE;");
  }

  static generateRandomUser() {
    return {
      firstName: `Test${Math.random().toString(36).substring(7)}`,
      lastName: `User${Math.random().toString(36).substring(7)}`,
      password: "test123456",
    };
  }

  static generateRandomProduct() {
    return {
      name: `Product${Math.random().toString(36).substring(7)}`,
      price: Math.floor(Math.random() * 100) + 1,
      category: "Test",
    };
  }
}
```

---

## 📈 Health Check Endpoint

### Priority: LOW

Add a health check endpoint for monitoring.

```typescript
// src/routes/healthRoutes.ts
import { Router, Request, Response } from "express";
import pool from "../config/database";

const router = Router();

router.get("/health", async (req: Request, res: Response) => {
  try {
    // Check database connection
    await pool.query("SELECT 1");

    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: "connected",
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
```

---

## 🔄 Pagination Helper

### Priority: LOW

Add pagination to list endpoints.

```typescript
// src/utils/pagination.ts
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const parsePaginationParams = (
  page?: string,
  limit?: string
): PaginationParams => {
  const defaultPage = 1;
  const defaultLimit = 10;
  const maxLimit = 100;

  const parsedPage = parseInt(page || String(defaultPage), 10);
  const parsedLimit = Math.min(
    parseInt(limit || String(defaultLimit), 10),
    maxLimit
  );

  return {
    page: parsedPage > 0 ? parsedPage : defaultPage,
    limit: parsedLimit > 0 ? parsedLimit : defaultLimit,
  };
};

export const createPaginatedResponse = <T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginatedResponse<T> => {
  return {
    data,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.ceil(total / params.limit),
    },
  };
};
```

---

## 🎨 SQL Query Builder/ORM

### Priority: LOW

Consider using an ORM or query builder for complex queries.

### Option 1: Knex.js (Query Builder)
```bash
npm install knex
```

### Option 2: TypeORM (Full ORM)
```bash
npm install typeorm reflect-metadata
```

### Option 3: Prisma (Modern ORM)
```bash
npm install prisma @prisma/client
```

**Benefits**:
- Type-safe queries
- Migration management
- Easier complex queries
- Better testing support

---

## 📦 Dependency Injection

### Priority: LOW

Use dependency injection for better testability.

```typescript
// src/models/User.ts
export class User {
  constructor(private pool: Pool) {}

  async getAll(): Promise<IUser[]> {
    const result = await this.pool.query(`SELECT ...`);
    return result.rows;
  }
}

// In controller
export class UserController {
  constructor(private userModel: User) {}

  async getAll(req: Request, res: Response) {
    const users = await this.userModel.getAll();
    res.json(users);
  }
}

// In routes
const userModel = new User(pool);
const controller = new UserController(userModel);
```

**Benefits**:
- Easier to test (mock dependencies)
- Clearer dependencies
- Better for large applications

---

## 🔒 Rate Limiting per Route

### Priority: LOW

Different rate limits for different endpoints.

```typescript
// src/config/rateLimits.ts
import rateLimit from "express-rate-limit";

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  message: "Too many login attempts, please try again later",
});

export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// Usage in routes
router.post("/login", authRateLimit, controller.authenticateUser.bind(controller));
```

---

## 📝 Summary

These additional refactoring suggestions will further improve:
- **Code Quality**: DTOs, base controllers, standardized responses
- **Developer Experience**: Swagger docs, better typing, logging
- **Reliability**: Health checks, pagination, better error handling
- **Maintainability**: Dependency injection, query builders, rate limiting

Implement them based on your project's needs and priorities!
