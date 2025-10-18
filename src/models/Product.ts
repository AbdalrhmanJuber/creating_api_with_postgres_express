import pool from "../config/database";

export interface Product {
  id?: number;
  name: string;
  price: number;
  category: string;
}

export class Product {
  async index(): Promise<Product[]> {
    const sql = "SELECT * FROM products";
    const result = await pool.query(sql);
    return result.rows;
  }
  async show(id: number): Promise<Product | null> {
    const sql = "SELECT * FROM products WHERE id = $1";
    const result = await pool.query(sql, [id]);
    return result.rows[0] || null;
  }
  async create(product: Product): Promise<Product> {
    const sql = `INSERT INTO products ("name", "price","category") VALUES ($1, $2, $3) RETURNING "id", "name", "price", "category"`;
    const result = await pool.query(sql, [
      product.name,
      product.price,
      product.category,
    ]);

    return result.rows[0];
  }

  async showProductByCategory(category: string): Promise<Product[] | null> {
    const sql = "SELECT * FROM products WHERE category = $1";
    const result = await pool.query(sql, [category]);
    return result.rows;
  }
}
