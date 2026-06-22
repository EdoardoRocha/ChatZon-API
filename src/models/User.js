import mongoose from "../config/db.js";
import { Schema } from "mongoose";

const User = mongoose.model(
    "User",
    new Schema(
        {
            name: {
                type: String,
                required: true,
                maxLength: [50, 'Nome de usuário muito longo (máximo 50)']
            },
            email: {
                type: String,
                required: true,
                unique: true,
                maxLength: [70, 'Email muito longo (máximo 70)']
            },
            password: {
                type: String,
                required: true,
            },
            image: {
                type: String
            }
        },
        {
            timestamps: true
        }
    )
);

export default User;
