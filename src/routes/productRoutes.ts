import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { ProductController } from "../controllers/productController";

const router = Router();
const controller = new ProductController();

router.get("/", controller.index.bind(controller));
router.get("/id/:id", controller.show.bind(controller));              
router.get("/category/:category", controller.showCategory.bind(controller)); 
router.post("/", authenticate, controller.create.bind(controller));
export default router;
