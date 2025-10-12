import { Request, Response } from "express";
import { User } from "../models/User";

const userModel = new User();

export class UserController {
  async getAll(req: Request, res: Response) {
    const users = await userModel.getAll();
    res.json(users);
  }
  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const user = await userModel.getById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  }

  async create(req: Request, res: Response) {
    const newUser = await userModel.create(req.body);
    res.status(201).json(newUser);
  }

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updated = await userModel.update(id, req.body);
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json(updated);
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    const deleted = await userModel.delete(id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  }
}
