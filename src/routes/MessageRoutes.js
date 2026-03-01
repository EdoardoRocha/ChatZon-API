import { Router } from "express";
const router = Router();

//Controllers
import MessageController from "../controllers/MessageController.js";

// Middlewares
import { checkToken } from "../middlewares/verifyToken.js";
import { validateNewMessage } from "../middlewares/validateMessage.js";

router.post("/", checkToken, validateNewMessage, MessageController.sendMessage);
router.get("/:id", checkToken, MessageController.getAllMessagesByConversation);

export default router;