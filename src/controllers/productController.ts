import { Request, Response } from "express";
import { generateToken } from "../helpers/jwt";
import { Product } from "../models/Product";

const productModel = new Product();

export class ProudctController {
  async index(req: Request, res: Response) {
    try {
      const products = await productModel.index();
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
      const product = await productModel.show(id);
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
      const product = await productModel.showProductByCategory(categoryParam);
      if (!product)
        return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async create(req: Request, res: Response) {
    try {
      const newProduct = await productModel.create(req.body);

      res.status(201).json({
        ...newProduct,
      });
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
