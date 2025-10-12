import { Request, Response } from "express";
import { User } from "../models/User";

const userModel = new User();

export class UserController {
  async getAll(req: Request, res: Response) {
    try {
      const users = await userModel.getAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number.parseInt(req.params.id, 10);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ message: "Invalid user id" });
      }
      const user = await userModel.getById(id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newUser = await userModel.create(req.body);
      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number.parseInt(req.params.id, 10);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ message: "Invalid user id" });
      }
      const updated = await userModel.update(id, req.body);
      if (!updated) return res.status(404).json({ message: "User not found" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number.parseInt(req.params.id, 10);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ message: "Invalid user id" });
      }
      const deleted = await userModel.delete(id);
      if (!deleted) return res.status(404).json({ message: "User not found" });
      res.json({ message: "User deleted" });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
