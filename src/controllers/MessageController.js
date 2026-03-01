//Models
import Messages from "../models/Messages.js";
import Conversation from "../models/Conversation.js";


export default class MessageController {
    static async sendMessage(req, res) {
        //Get id the sender bytoken
        const senderId = req.user.id;
        //Get id the receiver by body
        //Get id the conversation by body
        //Get the sender message 
        const { receiverId, conversationId, text } = req.body;

        try {
            const newMessage = new Messages({
                conversationId,
                senderId,
                receiverId,
                text
            });

            const savedMessage = await newMessage.save();

            const fullMessage = await Messages.findById(savedMessage._id)
                .populate("senderId", "name email")
                .populate("receiverId", "name email")
                .populate("conversationId")

            // Return full Object
            return res.status(201).json(fullMessage);
        } catch (error) {
            console.error("Não foi possível persistir a mensagem: " + error);
            res.status(500).json({ message: error.message });
        }
    };

    static async getAllMessagesByConversation(req, res) {
        const conversationId = req.params.id;
        const userId = req.user.id;

        try {

            const conversation = await Conversation.findById(conversationId);

            if (!conversation) {
                return res.status(404).json({ message: "Conversa não encontrada!" });
            };

            const isParticipant = conversation.participants.some(
                participant => participant.toString() === userId
            );


            if (!isParticipant) {
                return res.status(403).json({
                    message: "Você não tem permissão para ver as mensagens desta conversa!"
                });
            };


            const messages = await Messages.find({ conversationId })
                .sort({ createdAt: 1 })
                .populate("senderId", "name email")

            res.status(200).json(messages)
        } catch (error) {
            console.error("Não foi possível carregar as mensagens: " + error);
            res.status(500).json({ message: error.message });
        }
    };
};