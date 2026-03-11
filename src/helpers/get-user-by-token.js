import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const getUserByToken = async (token) => {

    if (!token) {
        return null;
    }

    const decoded = jwt.verify(token, process.env.AUTH_SECRET)
    const userId = decoded.id;
    const user = await User.findById(userId).lean();

    return user;
}