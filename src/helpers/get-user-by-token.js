import jwt from "jsonwebtoken";
import User from "../models/User";

export const getUserByToken = (token) => {

    if (!token) {
        return null;
    }

    const decoded = jwt.verify(token, process.env.AUTH_SECRET)
    const userId = decoded.id;
    const user = User.findById(userId);

    return user;
}