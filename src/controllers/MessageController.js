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
        text,
      });

      const savedMessage = await newMessage.save();

      const fullMessage = await Messages.findById(savedMessage._id)
        .populate("senderId", "name email")
        .populate("receiverId", "name email")
        .populate("conversationId");

      req.io.to(conversationId).emit("receive_message", fullMessage);

      //Connections list the room
      const clientsInRoom = req.io.sockets.adapter.rooms.get(conversationId);
      let isReceiverInRoom = false;

      if (clientsInRoom) {
        for (const socketId of clientsInRoom) {
          const clientSocket = req.io.sockets.sockets.get(socketId);
          if (clientSocket && clientSocket.user.id === receiverId) {
            isReceiverInRoom = true;
            break;
          }
        }
      }

      if (!isReceiverInRoom) {
        await Conversation.findByIdAndUpdate(conversationId, {
          hasUnreadMessages: true,
        });

        req.io.to(receiverId).emit("new_notification", {
          conversationId,
          message: text,
          senderName: req.user.name,
        });
      }

      // Return full Object
      return res.status(201).json(fullMessage);
    } catch (error) {
      console.error("Não foi possível persistir a mensagem: " + error.message);
      res.status(500).json({ message: error.message });
    }
  }

  static async getAllMessagesByConversation(req, res) {
    const conversationId = req.params.id;

    //Apply pagination calc
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
      const data = await Messages.find({ conversationId })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .populate("senderId", "name email")
        .populate("receiverId", "name email")
        .sort({ createdAt: -1 });

      const totalMessages = await Messages.countDocuments({ conversationId });

      res.status(200).json({
        data,
        meta: {
          currentPage: page,
          totalPages: Math.ceil(totalMessages / limit),
          totalMessages,
        }
      });
    } catch (error) {
      console.error("Não foi possível carregar as mensagens: " + error.message);
      res.status(500).json({ message: error.message });
    }
  }
}
