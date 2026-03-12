import mongoose from "mongoose";
import User from "../models/User.js";

export const validateFindOrCreateConversation = async (req, res, next) => {
    const recipientId = req.body.recipientId;

    const isRecipientIdValid = mongoose.Types.ObjectId.isValid(recipientId);

    if (!isRecipientIdValid) {
        return res.status(400).json({ message: "Destinatário inválido!" })
    };

    const isRecipientExist = await User.findById(recipientId);

    if (!isRecipientExist) {
        return res.status(404).json({ message: "Destinatário inválido ou não encontrado!" })
    }

    next();
}