import { Router } from "express";
const router = Router();

//Controllers
import UserController from "../controllers/UserController.js";

// Middlewares
import { checkToken } from "../middlewares/verifyToken.js";
import { validateNewUser, validateUser } from "../middlewares/validateUser.js";

router.post("/auth/register", validateNewUser, UserController.register);
router.post("/auth/login", validateUser, UserController.login);
router.get("/users", checkToken , UserController.getAllUsers);

export default router;