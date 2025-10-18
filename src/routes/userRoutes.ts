import { Router } from "express";
import { UserController } from "../controllers/userController";
import { validateUserInput } from "../middlewares/validateUser";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();
const controller = new UserController();

router.get("/", authenticate, controller.getAll.bind(controller));
router.get("/:id", authenticate, controller.getById.bind(controller));
router.put(
  "/:id",
  authenticate,
  validateUserInput,
  controller.update.bind(controller),
);
router.delete("/:id", authenticate, controller.delete.bind(controller));

router.post("/login", controller.authenticateUser.bind(controller)); // login
router.post("/", validateUserInput, controller.create.bind(controller)); // Register
export default router;
