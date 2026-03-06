import { Router } from "express";
const router = Router();

//Controllers
import ConversationController from "../controllers/ConversationController.js";

// Middlewares
import { authToken } from "../middlewares/authToken.js";

router.post("/", authToken, ConversationController.findOrCreateConversation);
router.get("/", authToken, ConversationController.getAllConversations);

export default router;