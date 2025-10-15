import { Request, Response } from "express";
import { User } from "../models/User";
import { generateToken } from "../helpers/jwt";

const userModel = new User();

type IdParams = { id: string };

export class UserController {
  async getAll(req: Request, res: Response) {
    try {
      const users = await userModel.getAll();
      res.json(users);
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getById(req: Request<IdParams>, res: Response) {
    try {
      const idParam = req.params?.id;
      if (!idParam || !/^\d+$/.test(idParam)) {
        return res.status(400).json({ message: "Invalid user id" });
      }
      const id = Number.parseInt(idParam, 10);

      const user = await userModel.getById(id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const findUser = await userModel.getById(req.body.id);
      if (findUser) return res.status(400).send({ message: "The user id cannot be used!" });
      const newUser = await userModel.create(req.body);
      res.status(201).json(newUser);
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async update(req: Request<IdParams>, res: Response) {
    try {
      const idParam = req.params?.id;
      if (!idParam || !/^\d+$/.test(idParam)) {
        return res.status(400).json({ message: "Invalid user id" });
      }
      const id = Number.parseInt(idParam, 10);

      const updated = await userModel.update(id, req.body);
      if (!updated) return res.status(404).json({ message: "User not found" });
      res.json(updated);
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async delete(req: Request<IdParams>, res: Response) {
    try {
      const idParam = req.params?.id;
      if (!idParam || !/^\d+$/.test(idParam)) {
        return res.status(400).json({ message: "Invalid user id" });
      }
      const id = Number.parseInt(idParam, 10);

      const deleted = await userModel.delete(id);
      if (!deleted) return res.status(404).json({ message: "User not found" });
      res.json({ message: "User deleted" });
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async authenticateUser(req: Request, res: Response) {
    try {
      const { firstName, password } = req.body;
      const user = await userModel.authenticate(firstName, password);

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = generateToken({
        id: user.id!,
        firstName: user.firstName!,
        lastName: user.lastName!,
      });

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
}
