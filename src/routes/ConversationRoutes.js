import { Router } from "express";
const router = Router();

//Controllers
import ConversationController from "../controllers/ConversationController.js";

// Middlewares
import { checkToken } from "../middlewares/verifyToken.js";

router.post("/", checkToken, ConversationController.findOrCreateConversation);
router.get("/", checkToken, ConversationController.getAllConversations);

export default router;