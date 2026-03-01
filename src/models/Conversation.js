import mongoose from "../config/db.js";
import { Schema } from "mongoose";

const Conversation = mongoose.model(
    "Conversation",
    new Schema(
        {
            participants: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                }
            ],
            hasUnreadMessages: {
                type: Boolean,
                default: false
            }
        },
        {
            timestamps: true
        }
    )
);

export default Conversation;