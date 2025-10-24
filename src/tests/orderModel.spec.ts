import { Order } from "../models/Order";
import { User } from "../models/User";
import { Product } from "../models/Product";
import pool from "../config/database";

const orderModel = new Order(pool);
const userModel = new User(pool);
const productModel = new Product(pool);

describe("Order Model", () => {
  let testUserId: number;
  let testProductId: number;
  let testOrderId: number;

  beforeAll(async () => {
    // Clean up and create test data
    await pool.query("DELETE FROM orderitem");
    await pool.query("DELETE FROM orders");
    await pool.query("DELETE FROM products WHERE name = 'OrderTestProduct'");
    await pool.query("DELETE FROM users WHERE \"firstName\" = 'OrderTest'");

    // Create test user
    const user = await userModel.create({
      firstName: "OrderTest",
      lastName: "User",
      password: "testpassword123",
    });
    testUserId = user.id!;

    // Create test product
    const product = await productModel.create({
      name: "OrderTestProduct",
      price: 50,
      category: "TestCategory",
    });
    testProductId = product.id!;
  });

  afterAll(async () => {
    // Clean up after tests
    await pool.query("DELETE FROM orderitem");
    await pool.query("DELETE FROM orders");
    await pool.query("DELETE FROM products WHERE name = 'OrderTestProduct'");
    await pool.query("DELETE FROM users WHERE \"firstName\" = 'OrderTest'");
  });

  describe("create method", () => {
    it("should create a new order", async () => {
      const order = await orderModel.create(testUserId);

      expect(order).toBeDefined();
      expect(order.id).toBeDefined();
      expect(order.user_id).toBe(testUserId);
      expect(order.status).toBe("active");

      testOrderId = order.id!;
    });
  });

  describe("addProduct method", () => {
    it("should add a product to an order", async () => {
      const orderProduct = await orderModel.addProduct(testOrderId, testProductId, 3);

      expect(orderProduct).toBeDefined();
      expect(orderProduct.order_id).toBe(testOrderId);
      expect(orderProduct.product_id).toBe(testProductId);
      expect(orderProduct.quantity).toBe(3);
    });
  });

  describe("getById method", () => {
    it("should return an order with products by ID", async () => {
      const order = await orderModel.getById(testOrderId);

      expect(order).toBeDefined();
      expect(order?.id).toBe(testOrderId);
      expect(order?.user_id).toBe(testUserId);
      expect(order?.products).toBeDefined();
      expect(Array.isArray(order?.products)).toBe(true);
      expect(order?.products?.length).toBeGreaterThan(0);
    });

    it("should return null for non-existent order", async () => {
      const order = await orderModel.getById(999999);

      expect(order).toBeNull();
    });
  });

  describe("getCurrentOrderByUser method", () => {
    it("should return current active order for a user", async () => {
      const order = await orderModel.getCurrentOrderByUser(testUserId);

      expect(order).toBeDefined();
      expect(order?.user_id).toBe(testUserId);
      expect(order?.status).toBe("active");
      expect(order?.products).toBeDefined();
    });

    it("should return null when no active order exists", async () => {
      // Create another user without orders
      const newUser = await userModel.create({
        firstName: "OrderTest",
        lastName: "NoOrders",
        password: "password123",
      });

      const order = await orderModel.getCurrentOrderByUser(newUser.id!);

      expect(order).toBeNull();

      // Clean up
      await userModel.delete(newUser.id!);
    });
  });

  describe("updateStatus method", () => {
    it("should update order status", async () => {
      const order = await orderModel.updateStatus(testOrderId, "complete");

      expect(order).toBeDefined();
      expect(order?.status).toBe("complete");
    });

    it("should return null for non-existent order", async () => {
      const order = await orderModel.updateStatus(999999, "complete");

      expect(order).toBeNull();
    });
  });

  describe("getCompletedOrdersByUser method", () => {
    it("should return completed orders for a user", async () => {
      const orders = await orderModel.getCompletedOrdersByUser(testUserId);

      expect(orders).toBeDefined();
      expect(Array.isArray(orders)).toBe(true);
      expect(orders.length).toBeGreaterThan(0);
      if (orders.length > 0 && orders[0]) {
        expect(orders[0].status).toBe("complete");
      }
    });

    it("should return empty array when no completed orders exist", async () => {
      // Create another user without completed orders
      const newUser = await userModel.create({
        firstName: "OrderTest",
        lastName: "NoCompleted",
        password: "password123",
      });

      const orders = await orderModel.getCompletedOrdersByUser(newUser.id!);

      expect(orders).toBeDefined();
      expect(Array.isArray(orders)).toBe(true);
      expect(orders.length).toBe(0);

      // Clean up
      await userModel.delete(newUser.id!);
    });
  });
});
