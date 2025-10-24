import { Request, Response } from "express";
import { Order } from "../models/Order";
import { parseId, ValidationError } from "../utils/validators";
import pool from "../config/database";

const orderModel = new Order(pool);

type UserIdParams = { userId: string };
type OrderIdParams = { id: string };

export class OrderController {
  /**
   * Get current (active) order for a user
   * GET /api/orders/user/:userId/current
   */
  async getCurrentOrderByUser(req: Request<UserIdParams>, res: Response) {
    try {
      const userId = parseId(req.params?.userId, "user");
      const order = await orderModel.getCurrentOrderByUser(userId);
      
      if (!order) {
        return res.status(404).json({ 
          message: "No active order found for this user" 
        });
      }
      
      res.json(order);
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message });
      }
      console.error("Error getting current order:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Get completed orders for a user
   * GET /api/orders/user/:userId/completed
   */
  async getCompletedOrdersByUser(req: Request<UserIdParams>, res: Response) {
    try {
      const userId = parseId(req.params?.userId, "user");
      const orders = await orderModel.getCompletedOrdersByUser(userId);
      
      res.json(orders);
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message });
      }
      console.error("Error getting completed orders:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Create a new order
   * POST /api/orders
   * Body: { user_id: number }
   */
  async create(req: Request, res: Response) {
    try {
      const { user_id } = req.body;

      if (!user_id) {
        return res.status(400).json({ 
          message: "Missing required field: user_id" 
        });
      }

      const order = await orderModel.create(user_id);
      
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Add a product to an order
   * POST /api/orders/:id/products
   * Body: { product_id: number, quantity: number }
   */
  async addProduct(req: Request<OrderIdParams>, res: Response) {
    try {
      const orderId = parseId(req.params?.id, "order");
      const { product_id, quantity } = req.body;

      if (!product_id || !quantity) {
        return res.status(400).json({ 
          message: "Missing required fields: product_id, quantity" 
        });
      }

      if (typeof quantity !== "number" || quantity <= 0) {
        return res.status(400).json({ 
          message: "Quantity must be a positive number" 
        });
      }

      // Verify order exists
      const order = await orderModel.getById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Check if order is still active
      if (order.status !== "active") {
        return res.status(400).json({ 
          message: "Cannot add products to a completed order" 
        });
      }

      const orderProduct = await orderModel.addProduct(
        orderId, 
        product_id, 
        quantity
      );
      
      res.status(201).json(orderProduct);
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message });
      }
      console.error("Error adding product to order:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Update order status
   * PUT /api/orders/:id
   * Body: { status: string }
   */
  async updateStatus(req: Request<OrderIdParams>, res: Response) {
    try {
      const orderId = parseId(req.params?.id, "order");
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ 
          message: "Missing required field: status" 
        });
      }

      if (status !== "active" && status !== "complete") {
        return res.status(400).json({ 
          message: "Status must be either 'active' or 'complete'" 
        });
      }

      const order = await orderModel.updateStatus(orderId, status);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message });
      }
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
