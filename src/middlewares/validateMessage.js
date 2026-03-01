//Models
import Conversation from "../models/Conversation.js";

export const validateNewMessage = async (req, res, next) => {
    const senderId = req.user.id;
    const { receiverId, conversationId, text } = req.body;

    //Validators
    if (!receiverId) {
        return res.status(400).json({ message: "O ID do destinatário é obrigatório!" });
    };
    if (!conversationId) {
        return res.status(400).json({ message: "O ID da conversa é obrigatório!" });
    };
    if (!text) {
        return res.status(400).json({ message: "A mensagem é obrigatória!" });
    };

    const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: { $in: [senderId] }
    })

    if (!conversation) {
        return res.status(403).json({
            message: "Você não tem permissão para enviar mensagem nesta conversa ou ela não existe."
        });
    }

    next();
}