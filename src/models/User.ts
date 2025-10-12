import pool from "../conifg/database";

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  password_hash: string;
}

export class User {
  async getAll(): Promise<User[]> {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
  }

  async getById(id: number): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0] || null;
  }

  async create(user: User): Promise<User> {
    const result = await pool.query(
      "INSERT INTO users (firstName, lastName, password_hash) VALUES($1, $2, $3) RETURNING *",
      [user.firstName, user.lastName, user.password_hash],
    );
    return result.rows[0];
  }

  async update(id: number, user: User): Promise<User | null> {
    const result = await pool.query(
      "UPDATE users SET firstName = $1, lastName = $2, password_hash = $3 where id = $4 RETURNING *",
      [user.firstName, user.lastName, user.password_hash, id],
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
    return result.rowCount! > 0;
  }
}
