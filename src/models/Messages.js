import mongoose from "../config/db.js";

const MessageSchema = mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        text: {
            type: String,
            required: true,
            maxLength: [500, 'A mensagem é muito longa']
        }
    },
    {
        timestamps: true
    }
);

MessageSchema.index({ conversationId: 1, createdAt: 1 });

const Message = mongoose.model("Message", MessageSchema);

export default Message;