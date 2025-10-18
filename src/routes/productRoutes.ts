import { Router } from "express";
import { authinticate } from "../middlewares/authMiddleware";
import { ProudctController } from "../controllers/productController";

const router = Router();
const controller = new ProudctController();

router.get("/", controller.index.bind(controller));
router.get("/id/:id", controller.show.bind(controller));              
router.get("/category/:category", controller.showCategory.bind(controller)); 
router.post("/", authinticate, controller.create.bind(controller));
export default router;
