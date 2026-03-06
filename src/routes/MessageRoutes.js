import { Router } from "express";
const router = Router();

//Controllers
import MessageController from "../controllers/MessageController.js";

// Middlewares
import { authToken } from "../middlewares/authToken.js";
import { validateNewMessage, validateMessages } from "../middlewares/validateMessage.js";

router.post("/", authToken, validateNewMessage, MessageController.sendMessage);
router.get("/:id", authToken, validateMessages, MessageController.getAllMessagesByConversation);

export default router;