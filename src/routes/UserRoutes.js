import { Router } from "express";
const router = Router();

//Controllers
import UserController from "../controllers/UserController.js";

// Middlewares
import { authToken } from "../middlewares/authToken.js";
import { validateNewUser, validateUser, validateUpdateUser } from "../middlewares/validateUser.js";
import { imageUpload } from "../helpers/image-upload.js";

router.post("/auth/register", imageUpload.single("image"), validateNewUser, UserController.register);
router.post("/auth/login", validateUser, UserController.login);
router.get("/users", authToken, UserController.getAllUsers);
router.post("/users/edit/:id", imageUpload.single("image"), authToken, validateUpdateUser, UserController.editUser);

export default router;