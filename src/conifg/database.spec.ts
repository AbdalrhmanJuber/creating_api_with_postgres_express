import pool from "./database";

beforeAll(async () => {
  const res = await pool.query("SELECT 1 AS connected");
  expect(res.rows[0].connected).toBe(1);
});

afterAll(async () => {
  await pool.end(); // close all connections
});

describe("PostgreSQL Database Connection", () => {
  it("should connect successfully", async () => {
    const res = await pool.query("SELECT 1 AS ok");
    expect(res.rows[0].ok).toBe(1);
  });
});

describe("Checking the users table", () => {
  it("should verify that table 'users' exists", async () => {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'users'
      ) AS exists;
    `);
    expect(result.rows[0].exists).toBeTrue();
  });

  it("should verify that all columns exist in 'users' table", async () => {
    const columns = ["id", "firstName", "lastName", "password"];
    const result = await pool.query(
      `
      SELECT COUNT(*) AS col_count
      FROM information_schema.columns
      WHERE table_name = 'users'
        AND column_name = ANY($1)
      `,
      [columns]
    );
    expect(Number(result.rows[0].col_count)).toBe(columns.length);
  });
});

describe("Checking the products table", () => {
  it("should verify that table 'products' exists", async () => {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'products'
      ) AS exists;
    `);
    expect(result.rows[0].exists).toBeTrue();
  });

  it("should verify that all columns exist in 'products' table", async () => {
    const columns = ["id", "name", "price", "category"];
    const result = await pool.query(
      `
      SELECT COUNT(*) AS col_count
      FROM information_schema.columns
      WHERE table_name = 'products'
        AND column_name = ANY($1)
      `,
      [columns]
    );
    expect(Number(result.rows[0].col_count)).toBe(columns.length);
  });
});

describe("Checking the orders table", () => {
  it("should verify that table 'orders' exists", async () => {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'orders'
      ) AS exists;
    `);
    expect(result.rows[0].exists).toBeTrue();
  });

  it("should verify that all columns exist in 'orders' table", async () => {
    const columns = ["id", "status", "user_id"];
    const result = await pool.query(
      `
      SELECT COUNT(*) AS col_count
      FROM information_schema.columns
      WHERE table_name = 'orders'
        AND column_name = ANY($1)
      `,
      [columns]
    );
    expect(Number(result.rows[0].col_count)).toBe(columns.length);
  });
});

describe("Checking the orderitem table", () => {
  it("should verify that table 'orderitem' exists", async () => {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'orderitem'
      ) AS exists;
    `);
    expect(result.rows[0].exists).toBeTrue();
  });

  it("should verify that all columns exist in 'orderitem' table", async () => {
    const columns = ["id", "quantity", "order_id", "product_id"];
    const result = await pool.query(
      `
      SELECT COUNT(*) AS col_count
      FROM information_schema.columns
      WHERE table_name = 'orderitem'
        AND column_name = ANY($1)
      `,
      [columns]
    );
    expect(Number(result.rows[0].col_count)).toBe(columns.length);
  });
});

