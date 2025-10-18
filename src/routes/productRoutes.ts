import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { ProductController } from "../controllers/productController";
import { Product } from "../models/Product";
import pool from "../config/database";

const router = Router();
const productModel = new Product(pool);
const controller = new ProductController(productModel);

router.get("/", controller.index.bind(controller));
router.get("/id/:id", controller.show.bind(controller));
router.get("/category/:category", controller.showCategory.bind(controller));
router.post("/", authenticate, controller.create.bind(controller));
export default router;
