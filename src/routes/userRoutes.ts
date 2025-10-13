import { Router } from "express";
import { UserController } from "../controllers/userController";


const router = Router();
const controller = new UserController();


router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.post("/", controller.create.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));
router.post("/authenticate", controller.authenticateUser.bind(controller));

export default router;
