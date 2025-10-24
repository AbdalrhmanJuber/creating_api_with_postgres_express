import { Pool } from "pg";

export interface IOrder {
  id?: number;
  user_id: number;
  status: string;
}

export interface IOrderProduct {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
}

export interface IOrderWithProducts extends IOrder {
  products?: Array<{
    product_id: number;
    product_name: string;
    quantity: number;
    price: number;
  }>;
}

export class Order {
  constructor(private pool: Pool) {}

  /**
   * Get current (active) order for a user
   */
  async getCurrentOrderByUser(userId: number): Promise<IOrderWithProducts | null> {
    const orderQuery = `
      SELECT id, user_id, status
      FROM orders
      WHERE user_id = $1 AND status = 'active'
      LIMIT 1
    `;
    
    const orderResult = await this.pool.query(orderQuery, [userId]);
    
    if (orderResult.rows.length === 0) {
      return null;
    }

    const order = orderResult.rows[0];
    
    // Get products for this order
    const productsQuery = `
      SELECT 
        oi.product_id,
        p.name as product_name,
        oi.quantity,
        p.price
      FROM orderitem oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `;
    
    const productsResult = await this.pool.query(productsQuery, [order.id]);
    
    return {
      ...order,
      products: productsResult.rows
    };
  }

  /**
   * Get completed orders for a user
   */
  async getCompletedOrdersByUser(userId: number): Promise<IOrderWithProducts[]> {
    const ordersQuery = `
      SELECT id, user_id, status
      FROM orders
      WHERE user_id = $1 AND status = 'complete'
      ORDER BY id DESC
    `;
    
    const ordersResult = await this.pool.query(ordersQuery, [userId]);
    
    const orders: IOrderWithProducts[] = [];
    
    for (const order of ordersResult.rows) {
      const productsQuery = `
        SELECT 
          oi.product_id,
          p.name as product_name,
          oi.quantity,
          p.price
        FROM orderitem oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = $1
      `;
      
      const productsResult = await this.pool.query(productsQuery, [order.id]);
      
      orders.push({
        ...order,
        products: productsResult.rows
      });
    }
    
    return orders;
  }

  /**
   * Create a new order
   */
  async create(userId: number): Promise<IOrder> {
    const sql = `
      INSERT INTO orders (user_id, status)
      VALUES ($1, 'active')
      RETURNING id, user_id, status
    `;
    
    const result = await this.pool.query(sql, [userId]);
    return result.rows[0];
  }

  /**
   * Add a product to an order
   */
  async addProduct(orderId: number, productId: number, quantity: number): Promise<IOrderProduct> {
    const sql = `
      INSERT INTO orderitem (order_id, product_id, quantity)
      VALUES ($1, $2, $3)
      RETURNING id, order_id, product_id, quantity
    `;
    
    const result = await this.pool.query(sql, [orderId, productId, quantity]);
    return result.rows[0];
  }

  /**
   * Update order status
   */
  async updateStatus(orderId: number, status: string): Promise<IOrder | null> {
    const sql = `
      UPDATE orders
      SET status = $1
      WHERE id = $2
      RETURNING id, user_id, status
    `;
    
    const result = await this.pool.query(sql, [status, orderId]);
    return result.rows[0] || null;
  }

  /**
   * Get order by ID
   */
  async getById(orderId: number): Promise<IOrderWithProducts | null> {
    const orderQuery = `
      SELECT id, user_id, status
      FROM orders
      WHERE id = $1
    `;
    
    const orderResult = await this.pool.query(orderQuery, [orderId]);
    
    if (orderResult.rows.length === 0) {
      return null;
    }

    const order = orderResult.rows[0];
    
    const productsQuery = `
      SELECT 
        oi.product_id,
        p.name as product_name,
        oi.quantity,
        p.price
      FROM orderitem oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `;
    
    const productsResult = await this.pool.query(productsQuery, [order.id]);
    
    return {
      ...order,
      products: productsResult.rows
    };
  }
}
