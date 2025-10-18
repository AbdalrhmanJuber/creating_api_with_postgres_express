import supertest from "supertest";
import app from "../server";
import pool from "../config/database";

const request = supertest(app);

describe("Product Api Endpoints", () => {
  let userId: number;
  let productId: number;
  let authToken: string;

  beforeAll(async () => {
    await pool.query("DELETE FROM users;DELETE FROM products;");
  });

  it("should create a new user", async () => {
    const res = await request.post("/api/users").send({
      firstName: "Alice",
      lastName: "Smith",
      password: "hashed_password_123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toBeDefined();
    expect(res.body.firstName).toBe("Alice");
    userId = res.body.id;

    authToken = res.body.token;
    expect(authToken).toBeDefined();
  });

  it("should create a new product", async () => {
    const res = await request.post("/api/products")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
      name: "Apple",
      price: 15,
      category: "Fruit",
    });

    expect(res.status).toBe(201);
    expect(res.body).toBeDefined();
    expect(res.body.name).toBe("Apple");
    productId = res.body.id;
  });

  it("should show all products", async () => {
    const res = await request.get(`/api/products/`);
    expect(res.status).toBe(200);
  });

  it("should show a specific product by id product", async () => {
    const res = await request.get(`/api/products/id/${productId}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Apple");
    expect(res.body.price).toBe(15);
    expect(res.body.category).toBe("Fruit");
  });
  it("should show a specific product by category product", async () => {
    const res = await request.get(`/api/products/category/Fruit}`);

    expect(res.status).toBe(200);
  });
});
