//Models
import User from "../models/User.js";

//Dependencies 
import bcrypt from "bcryptjs";
import { createUserToken } from "../helpers/create-user-token.js";
import { getToken } from "../helpers/get-token.js";
import { getUserByToken } from "../helpers/get-user-by-token.js";

export default class UserController {
    static async register(req, res) {
        const {
            name,
            email,
            password
        } = req.body;
        const image = req.file ? req.file.location : "";

        //Create password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: passwordHash,
            image
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
            const user = await User.findOne({ email }).select("-password");
            const createdUser = await createUserToken(user);

            res.status(200).json({
                message: "Você está autenticado",
                token: createdUser,
                user
            })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    static async getAllUsers(req, res) {

        //Apply pagination calc
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalUsers = await User.countDocuments();

        const token = getToken(req);
        const user = await getUserByToken(token);
        if (!user) {
            res.status(404).json({ message: "Não há usuários cadastrados na ferramenta!" });
            return;
        }
        try {
            const data = await User.find({ _id: { $ne: user._id } })
                .skip(skip)
                .limit(limit)
                .select("-password");

            res.status(200).json({
                data,
                meta: {
                    currentPage: page,
                    totalPages: Math.ceil(totalUsers / limit),
                    totalUsers
                }
            });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    static async editUser(req, res) {
        const id = req.params.id;
        const {
            name,
            email,
            password
        } = req.body;
        const image = req.image;

        try {
            const payload = {};

            if(name) payload.name = name;
            if(email) payload.email = email;
            if(image) payload.image = image;

            if(password) {
                const salt = await bcrypt.genSalt(12);
                payload.password = await bcrypt.hash(password, salt);
            };

            const updatedUser = await User.findOneAndUpdate(
                { _id: id },
                { $set: payload },
                { 
                    returnDocument: 'after',
                    select : "-password"  
                }
            );

            if(!updatedUser) {
                res.status(404).json({message: "Não foi possível atualizar, usuário não encontrado!"})
            }
            res.status(200).json({ 
                message: "Usuário atualizado com sucesso!",
                user: updatedUser
            });
        } catch (error) {
            console.error("Não foi possível atualizar esse usuário: " + error.message);
            res.status(500).json({ message: "Não foi possível atualizar esse usuário: " + error.message })
        }



    };

    static async searchUsers(req, res) {
        let search = "";
        if(req.query.search) {
            search = req.query.search
        }   

        try {
            const usersData = await User.find({
                name: {$regex: search, $options: "i"}
            })
            .sort({createdAt: -1})
            .lean()

            const users = usersData;

            res.status(200).json({
                users
            })
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    };
};