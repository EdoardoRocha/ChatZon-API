//Models
import Conversation from "../models/Conversation.js";

export default class ConversationController {
    static async findOrCreateConversation(req, res) {
        try {
            const senderId = req.user.id;
            const { recipientId } = req.body;

            if (!recipientId) {
                res.status(400).json({ message: "ID do destinatário é obrigatório!" });
                return;
            }

            const conversation = await Conversation.findOne({
                participants: { $all: [senderId, recipientId] }
            }).populate("participants", "name email image");

            if (conversation) {
                res.status(200).json(conversation);
                return;
            }
            const newConversation = new Conversation({
                participants: [senderId, recipientId]
            });

            const savedConversation = await newConversation.save();

            const fullConversation = await Conversation.findById(savedConversation._id)
                .populate("participants", "name email image");

            res.status(201).json(fullConversation);

        } catch (error) {
            console.error("Erro ao acessar/criar chat:", error);
            res.status(500).json({ message: "Erro interno ao processar a conversa " + error.message });
        }
    };

    static async getAllConversations(req, res) {

        try {
            const userId = req.user.id;

            const filter = { participants: { $in: [userId] } }

            //Applu pagination calc
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const [data, totalConversations] = await Promise.all([
                Conversation.find(filter)
                    .sort({ updatedAt: -1 })
                    .populate("participants", "name email image")
                    .skip(skip)
                    .limit(limit),
                Conversation.countDocuments(filter)
            ])
            res.status(200).json({
                data,
                meta: {
                    currentPage: page,
                    totalPages: Math.ceil(totalConversations / limit),
                    totalConversations
                }
            });
        } catch (error) {
            console.error("Erro ao buscar por conversas: " + error);
            res.status(500).json({ message: error.message });
        }
    };
};