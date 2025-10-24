import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { OrderController } from "../controllers/orderController";

const router = Router();
const controller = new OrderController();

// All order routes require authentication
router.get(
  "/user/:userId/current",
  authenticate,
  controller.getCurrentOrderByUser.bind(controller)
);

router.get(
  "/user/:userId/completed",
  authenticate,
  controller.getCompletedOrdersByUser.bind(controller)
);

router.post("/", authenticate, controller.create.bind(controller));

router.post(
  "/:id/products",
  authenticate,
  controller.addProduct.bind(controller)
);

router.put("/:id", authenticate, controller.updateStatus.bind(controller));

export default router;
