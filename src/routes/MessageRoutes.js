import { Router } from "express";
const router = Router();

//Controllers
import MessageController from "../controllers/MessageController.js";

// Middlewares
import { authToken } from "../middlewares/authToken.js";
import { validateNewMessage, validateMessages } from "../middlewares/validateMessage.js";

//Helpers
import { fileUpload } from "../helpers/file-upload.js";

router.post("/", authToken, fileUpload.single("file"), validateNewMessage, MessageController.sendMessage);
router.get("/:id", authToken, validateMessages, MessageController.getAllMessagesByConversation);

export default router;