import supertest from "supertest";
import app from "../server";
import pool from "../config/database";

const request = supertest(app);

describe("Product API Endpoints", () => {
  let userId: number;
  let productId: number;
  let authToken: string;

  beforeAll(async () => {
    // Clean up database before tests
    await pool.query("DELETE FROM products; DELETE FROM users;");

    // Create a test user for authentication
    const userRes = await request.post("/api/users").send({
      firstName: "Alice",
      lastName: "Smith",
      password: "hashed_password_123",
    });

    userId = userRes.body.id;
    authToken = userRes.body.token;
  });

  describe("POST /api/products - Create Product", () => {
    it("should create a new product successfully", async () => {
      const res = await request
        .post("/api/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Apple",
          price: 15,
          category: "Fruit",
        });

      expect(res.status).toBe(201);
      expect(res.body).toBeDefined();
      expect(res.body.name).toBe("Apple");
      expect(res.body.price).toBe(15);
      expect(res.body.category).toBe("Fruit");

      // Store for subsequent tests
      productId = res.body.id;
    });
  });

  describe("GET /api/products - Get All Products", () => {
    it("should retrieve all products successfully", async () => {
      const res = await request.get("/api/products");

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /api/products/id/:id - Get Product by ID", () => {
    it("should retrieve a specific product by ID successfully", async () => {
      const res = await request.get(`/api/products/id/${productId}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(productId);
      expect(res.body.name).toBe("Apple");
      expect(res.body.price).toBe(15);
      expect(res.body.category).toBe("Fruit");
    });
  });

  describe("GET /api/products/category/:category - Get Products by Category", () => {
    it("should retrieve products by category successfully", async () => {
      const res = await request.get("/api/products/category/Fruit");

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(Array.isArray(res.body)).toBe(true);
      if (res.body.length > 0) {
        expect(res.body[0].category).toBe("Fruit");
      }
    });
  });
});
