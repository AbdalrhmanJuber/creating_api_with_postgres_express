import { Router } from "express";
import { UserController } from "../controllers/userController";
import { validateUserInput } from "../middlewares/validateUser";
import { authinticate } from "../middlewares/authMiddleware";

const router = Router();
const controller = new UserController();

router.get("/", authinticate, controller.getAll.bind(controller));
router.get("/:id", authinticate, controller.getById.bind(controller));
router.put(
  "/:id",
  authinticate,
  validateUserInput,
  controller.update.bind(controller),
);
router.delete("/:id", authinticate, controller.delete.bind(controller));

router.post("/login", controller.authenticateUser.bind(controller)); // login
router.post("/", validateUserInput, controller.create.bind(controller)); // Register
export default router;
