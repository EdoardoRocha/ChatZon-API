//Models
import User from "../models/User.js";

//Dependencies 
import bcrypt from "bcryptjs";
import fs from "fs";

export const validateNewUser = async (req, res, next) => {
    const {
        name,
        email,
        password
    } = req.body;

    //Basci validator
    if (!name) {
        res.status(400).json({ message: "O nome é obrigatório!" });
        return;
    };

    if (name.length >= 50) {
        res.status(400).json({ message: "O Nome é muito longo!" });
        return;
    };

    if (!email) {
        res.status(400).json({ message: "O E-mail é obrigatório!" });
        return;
    };

    if (email.length >= 30) {
        res.status(400).json({ message: "O E-mail é muito longo!" });
        return;
    };

    if (!password) {
        res.status(400).json({ message: "A senha é obrigatória!" });
        return;
    };

    //Check if password type is string

    if (typeof password !== "string") {
        res.status(422).json({ message: "A Senha precisa ser um texto" });
        return;
    }

    //Check user if exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(409).json({ message: "Esse usuário já está cadastrado em nossa plataforma!" });
        return;
    };

    next();
};


export const validateUser = async (req, res, next) => {
    const {
        email,
        password
    } = req.body;


    // Validators
    if (!email) {
        res.status(400).json({ message: "O E-mail é obrigatório!" });
        return;
    };

    if (!password) {
        res.status(400).json({ message: "A senha é obrigatória!" });
        return;
    };

    //Check if password type is string

    if (typeof password !== "string") {
        res.status(422).json({ message: "A Senha precisa ser um texto" });
        return;
    }

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404).json({ message: 'Usuário ou Senha inválidos!' });
        return;
    };

    // Check if password match with db password
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
        res.status(422).json({ message: 'Usuário ou Senha inválidos!' });
        return;
    };

    next();
}
