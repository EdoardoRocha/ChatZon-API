import { Router } from "express";
const router = Router();

//Controllers
import ConversationController from "../controllers/ConversationController.js";

// Middlewares
import { authToken } from "../middlewares/authToken.js";
import { validateFindOrCreateConversation } from "../middlewares/validateConversation.js";

router.post("/", authToken, validateFindOrCreateConversation, ConversationController.findOrCreateConversation);
router.get("/", authToken, ConversationController.getAllConversations);

export default router;