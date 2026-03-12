//Models
import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";

export const validateNewMessage = async (req, res, next) => {
  const senderId = req.user.id;
  const { receiverId, conversationId, text } = req.body;

  //Validators
  if (!receiverId) {
    return res.status(400).json({ message: "O ID do destinatário é obrigatório!" });
  }
  if (!conversationId) {
    return res.status(400).json({ message: "O ID da conversa é obrigatório!" });
  }
  if (!text) {
    return res.status(400).json({ message: "A mensagem é obrigatória!" });
  }

  const isConversationValid = mongoose.Types.ObjectId.isValid(conversationId)
  const isReceiverValid = mongoose.Types.ObjectId.isValid(receiverId);

  if (!isConversationValid || !isReceiverValid) {
    return res.status(400).json({ message: "Informações de conversa e/ou destinatários inválidas!" })
  }

  if (text.length >= 500) {
    return res.status(400).json({ message: "Texto muito longo!" })
  }

  const conversationSender = await Conversation.findOne({
    _id: conversationId,
    participants: { $in: [senderId] },
  });

  if (!conversationSender) {
    return res.status(403).json({
      message:
        "Você não tem permissão para enviar mensagem nesta conversa ou ela não existe.",
    });
  }

  const conversationReceiver = await Conversation.findOne({
    _id: conversationId,
    participants: { $in: [receiverId] }
  })

  if (!conversationReceiver) {
    return res.status(403).json({
      message: "Destinatário inválido!"
    })
  }

  next();
};

export const validateMessages = async (req, res, next) => {
  const conversationId = req.params.id;
  const userId = req.user.id;

  try {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversa não encontrada!" });
    }

    const isParticipant = conversation.participants.some(
      (participant) => participant.toString() === userId,
    );

    if (!isParticipant) {
      return res.status(403).json({
        message: "Você não tem permissão para ver as mensagens desta conversa!",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
