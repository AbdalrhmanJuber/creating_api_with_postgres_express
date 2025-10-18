import { Request, Response } from "express";
import { generateToken } from "../helpers/jwt";
import { Product } from "../models/Product";


export class ProductController {
  constructor(private productModel: Product) {}
  async index(req: Request, res: Response) {
    try {
      const products = await this.productModel.index();
      res.json(products);
    } catch {
      res.status(500).json({ message: "Internal Error" });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const idParam = req.params?.id;
      if (!idParam || !/^\d+$/.test(idParam)) {
        return res.status(400).json({ message: "Invalid product id" });
      }
      const id = Number.parseInt(idParam, 10);
      const product = await this.productModel.show(id);
      if (!product)
        return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async showCategory(req: Request, res: Response) {
    try {
      const categoryParam = req.params?.category || "null";
      const product = await this.productModel.showProductByCategory(categoryParam);
      if (!product)
        return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async create(req: Request, res: Response) {
    try {
      const newProduct = await this.productModel.create(req.body);

      res.status(201).json({
        ...newProduct,
      });
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
