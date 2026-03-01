import jwt from "jsonwebtoken";
import { getToken } from "../helpers/get-token.js";

export const checkToken = (req, res, next) => {
    if (!req.headers.authorization) res.status(401).json({ message: "Acesso negado!" });
    const token = getToken(req);
    if (!token) res.status(401).json({ message: "Acesso negado!" });

    try {
        const verified = jwt.verify(token, process.env.AUTH_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(400).json({ message: "Token inválido!" })
    }
}