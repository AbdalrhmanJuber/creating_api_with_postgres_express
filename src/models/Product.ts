import { Pool } from "pg";

export interface Product {
  id?: number;
  name: string;
  price: number;
  category: string;
}

export class Product {

  constructor(private pool: Pool) {}

  async index(): Promise<Product[]> {
    const sql = "SELECT * FROM products";
    const result = await this.pool.query(sql);
    return result.rows;
  }
  async show(id: number): Promise<Product | null> {
    const sql = "SELECT * FROM products WHERE id = $1";
    const result = await this.pool.query(sql, [id]);
    return result.rows[0] || null;
  }
  async create(product: Product): Promise<Product> {
    const sql = `INSERT INTO products ("name", "price","category") VALUES ($1, $2, $3) RETURNING "id", "name", "price", "category"`;
    const result = await this.pool.query(sql, [
      product.name,
      product.price,
      product.category,
    ]);

    return result.rows[0];
  }

  async showProductByCategory(category: string): Promise<Product[] | null> {
    const sql = "SELECT * FROM products WHERE category = $1";
    const result = await this.pool.query(sql, [category]);
    return result.rows;
  }
}
