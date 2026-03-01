//Models
import User from "../models/User.js";

//Dependencies 
import bcrypt from "bcryptjs";
import { createUserToken } from "../helpers/create-user-token.js";


export default class UserController {
    static async register(req, res) {
        const {
            name,
            email,
            password
        } = req.body;

        //Create password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: passwordHash
        })

        try {
            const newUser = await user.save();
            // Create User Token
            const createdUser = await createUserToken(newUser);

            res.status(201).json({
                message: "Você está autenticado",
                token: createdUser,
                userId: newUser._id
            })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    static async login(req, res) {
        const email = req.body.email;

        try {
            const user = await User.findOne({ email });
            const createdUser = await createUserToken(user);

            res.status(200).json({
                message: "Você está autenticado",
                token: createdUser,
                userId: user._id
            })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    static async getAllUsers(req, res) {
        try {
            const users = await User.find().select("-password");
            res.status(200).json({ users });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
};