import supertest from "supertest";
import app from "../server";
import pool from "../config/database";

const request = supertest(app);

describe("Order API Endpoints", () => {
  let userId: number;
  let authToken: string;
  let productId: number;
  let orderId: number;

  beforeAll(async () => {
    // Clean up database before tests
    await pool.query("DELETE FROM orderitem; DELETE FROM orders; DELETE FROM products; DELETE FROM users;");

    // Create a test user for authentication
    const userRes = await request.post("/api/users").send({
      firstName: "Test",
      lastName: "User",
      password: "password123",
    });

    userId = userRes.body.id;
    authToken = userRes.body.token;

    // Create a test product
    const productRes = await request
      .post("/api/products")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Test Product",
        price: 100,
        category: "Test",
      });

    productId = productRes.body.id;
  });

  describe("POST /api/orders - Create Order", () => {
    it("should create a new order successfully", async () => {
      const res = await request
        .post("/api/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          user_id: userId,
        });

      expect(res.status).toBe(201);
      expect(res.body).toBeDefined();
      expect(res.body.user_id).toBe(userId);
      expect(res.body.status).toBe("active");

      // Store for subsequent tests
      orderId = res.body.id;
    });

    it("should return 400 when user_id is missing", async () => {
      const res = await request
        .post("/api/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Missing required field");
    });

    it("should return 401 when token is not provided", async () => {
      const res = await request.post("/api/orders").send({
        user_id: userId,
      });

      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/orders/:id/products - Add Product to Order", () => {
    it("should add a product to an order successfully", async () => {
      const res = await request
        .post(`/api/orders/${orderId}/products`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          product_id: productId,
          quantity: 5,
        });

      expect(res.status).toBe(201);
      expect(res.body).toBeDefined();
      expect(res.body.order_id).toBe(orderId);
      expect(res.body.product_id).toBe(productId);
      expect(res.body.quantity).toBe(5);
    });

    it("should return 400 when required fields are missing", async () => {
      const res = await request
        .post(`/api/orders/${orderId}/products`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          product_id: productId,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Missing required fields");
    });

    it("should return 400 when quantity is not positive", async () => {
      const res = await request
        .post(`/api/orders/${orderId}/products`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          product_id: productId,
          quantity: -1,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Quantity must be a positive number");
    });
  });

  describe("GET /api/orders/user/:userId/current - Get Current Order", () => {
    it("should retrieve current order for a user successfully", async () => {
      const res = await request
        .get(`/api/orders/user/${userId}/current`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body.id).toBe(orderId);
      expect(res.body.user_id).toBe(userId);
      expect(res.body.status).toBe("active");
      expect(Array.isArray(res.body.products)).toBe(true);
      expect(res.body.products.length).toBeGreaterThan(0);
    });

    it("should return 401 when token is not provided", async () => {
      const res = await request.get(`/api/orders/user/${userId}/current`);

      expect(res.status).toBe(401);
    });
  });

  describe("PUT /api/orders/:id - Update Order Status", () => {
    it("should update order status successfully", async () => {
      const res = await request
        .put(`/api/orders/${orderId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          status: "complete",
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("complete");
    });

    it("should return 400 for invalid status", async () => {
      const res = await request
        .put(`/api/orders/${orderId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          status: "invalid",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Status must be either");
    });
  });

  describe("GET /api/orders/user/:userId/completed - Get Completed Orders", () => {
    it("should retrieve completed orders for a user successfully", async () => {
      const res = await request
        .get(`/api/orders/user/${userId}/completed`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].status).toBe("complete");
    });

    it("should return 401 when token is not provided", async () => {
      const res = await request.get(`/api/orders/user/${userId}/completed`);

      expect(res.status).toBe(401);
    });
  });

  describe("Edge Cases", () => {
    it("should return 404 for non-existing order", async () => {
      const res = await request
        .post("/api/orders/99999/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          product_id: productId,
          quantity: 1,
        });

      expect(res.status).toBe(404);
    });

    it("should not allow adding products to completed order", async () => {
      const res = await request
        .post(`/api/orders/${orderId}/products`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          product_id: productId,
          quantity: 2,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Cannot add products to a completed order");
    });

    it("should return 404 when no active order exists", async () => {
      // Create a new user without orders
      const newUserRes = await request.post("/api/users").send({
        firstName: "NoOrder",
        lastName: "User",
        password: "password123",
      });

      const res = await request
        .get(`/api/orders/user/${newUserRes.body.id}/current`)
        .set("Authorization", `Bearer ${newUserRes.body.token}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toContain("No active order found");
    });
  });
});
