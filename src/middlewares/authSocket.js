import jwt from "jsonwebtoken";

export const authSocket = (socket, next) => {

  let token;

  if (process.env.NODE_ENV === "development") {
    token = socket.handshake.headers.token
  } else {
    token = socket.handshake.auth.token;
  }

  if (!token) {
    return next(new Error("Acesso negado! Token não fornecido!"));
  }

  try {
    const verified = jwt.verify(token, process.env.AUTH_SECRET);
    socket.user = verified;
    next();
  } catch (error) {
    next(new Error("Token inválido!"));
  }
};
