import { Request, Response, NextFunction } from "express";

export const validateProductInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, price, category } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({
      message: "Missing required fields: name, price, category",
    });
  }

  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json({
      message: "Price must be a positive number",
    });
  }

  if (typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({
      message: "Name must be a non-empty string",
    });
  }

  next();
};
