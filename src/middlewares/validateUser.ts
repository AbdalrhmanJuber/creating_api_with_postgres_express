import { Request, Response, NextFunction } from "express";

export const validateUserInput = (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, password_hash } = req.body;

  if (!firstName || !lastName || !password_hash) {
    return res.status(400).json({ message: "Missing required fields: firstName, lastName, password_hash" });
  }

  if (password_hash.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  next();
};

