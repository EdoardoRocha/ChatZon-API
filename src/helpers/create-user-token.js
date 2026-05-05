import jwt from "jsonwebtoken";

export const createUserToken = async user => {
    //Create Token
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, process.env.AUTH_SECRET, {
        expiresIn: "7d"
    });

    //Return token
    return token;
};