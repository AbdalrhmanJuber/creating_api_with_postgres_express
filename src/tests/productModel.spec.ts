import { Product } from "../models/Product";
import pool from "../config/database";

const productModel = new Product(pool);

describe("Product Model", () => {
  let testProductId: number;

  beforeAll(async () => {
    // Clean up products table before tests
    await pool.query("DELETE FROM products WHERE name = 'ModelTestProduct'");
  });

  afterAll(async () => {
    // Clean up after tests
    await pool.query("DELETE FROM products WHERE name = 'ModelTestProduct'");
  });

  describe("create method", () => {
    it("should create a new product", async () => {
      const product = await productModel.create({
        name: "ModelTestProduct",
        price: 99,
        category: "TestCategory",
      });

      expect(product).toBeDefined();
      expect(product.id).toBeDefined();
      expect(product.name).toBe("ModelTestProduct");
      expect(product.price).toBe(99);
      expect(product.category).toBe("TestCategory");

      testProductId = product.id!;
    });
  });

  describe("index method", () => {
    it("should return array of products", async () => {
      const products = await productModel.index();

      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
    });
  });

  describe("show method", () => {
    it("should return a product by ID", async () => {
      const product = await productModel.show(testProductId);

      expect(product).toBeDefined();
      expect(product?.id).toBe(testProductId);
      expect(product?.name).toBe("ModelTestProduct");
    });

    it("should return null for non-existent product", async () => {
      const product = await productModel.show(999999);

      expect(product).toBeNull();
    });
  });

  describe("showProductByCategory method", () => {
    it("should return products by category", async () => {
      const products = await productModel.showProductByCategory("TestCategory");

      expect(products).toBeDefined();
      expect(Array.isArray(products)).toBe(true);
      expect(products!.length).toBeGreaterThan(0);
      if (products && products.length > 0 && products[0]) {
        expect(products[0].category).toBe("TestCategory");
      }
    });

    it("should return empty array for non-existent category", async () => {
      const products = await productModel.showProductByCategory("NonExistentCategory");

      expect(products).toBeDefined();
      expect(Array.isArray(products)).toBe(true);
      expect(products!.length).toBe(0);
    });
  });
});
