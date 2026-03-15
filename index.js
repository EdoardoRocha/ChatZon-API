import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { authSocket } from "./src/middlewares/authSocket.js";
import multer from "multer";
import path from "path";

//Import Models
import Conversation from "./src/models/Conversation.js";

//Make app
const app = express();

//Create server
const httpServer = createServer(app);

//Config fields statics
app.use(express.static(path.resolve("src", "public")));

//Config JSON response
app.use(express.json());

//Solve CORS

const allowedOrigins = [
  'http://localhost:5173',
  'https://chat-zon.vercel.app',
  'http://chat-zon.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem origin (como mobile apps ou curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'A política de CORS para este site não permite acesso da origem especificada.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Necessário para enviar tokens/cookies
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization,token" // Adicione 'token' que você usa no socket
}));


//Socket.io Init
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
});

//Io Injection in all routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Main Routes
import UserRoutes from "./src/routes/UserRoutes.js";
import MessageRoutes from "./src/routes/MessageRoutes.js";
import ConversationRoutes from "./src/routes/ConversationRoutes.js";

app.use("/api/v2", UserRoutes);
app.use("/api/v2/messages", MessageRoutes);
app.use("/api/v2/conversations", ConversationRoutes);

//Middleware error on Multer Image
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: "A Imagem deve ter no máximo 2MB!" });
    }
    // Captura outros erros específicos do Multer/S3
    return res.status(400).json({ message: "Erro no upload do arquivo: " + error.code });
  }

  res.status(500).json({ message: "Erro interno no servidor ou na nuvem: " + error.message });
});

io.use(authSocket);
//Lógica de conexão básica (Handshake)
io.on("connection", async (socket) => {
  console.log(
    `Usuário autenticado: ${socket.user.name} (ID: ${socket.user.id})`,
  );

  socket.join(socket.user.id);
  console.log(
    `Usuário ${socket.user.name} entrou na sua sala privada: ${socket.user.id}`,
  );

  const conversations = await Conversation.find({ participants: socket.user.id })
  conversations.forEach(conv => socket.join(conv._id.toString()));

  socket.on("join_chat", async (conversationId) => {
    try {
      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        socket.emit("error_message", "Conversa não encontrada.");
        return;
      }

      const isParticipant = conversation.participants.some(
        (p) => p.toString() === socket.user.id,
      );
      if (!isParticipant) {
        console.log(
          `Tentativa de acesso não autorizada: ${socket.user.name} na sala ${conversationId}`,
        );
        socket.emit(
          "error_message",
          "Você não tem permissão para entrar nesta conversa.",
        );
        return;
      }
      await Conversation.findByIdAndUpdate(conversationId, {
        hasUnreadMessages: false,
      });

      socket.join(conversationId);
      socket.emit("unread_cleared", { conversationId });
      console.log(
        `Usuário ${socket.user.name} entrou na sala: ${conversationId}`,
      );
    } catch (error) {
      socket.emit("error_message", "Erro ao tentar entrar na conversa.");
    }
  });

  socket.on("disconnect", () => {
    console.log(`Usuário desconectado`);
  });

  socket.on("typing_start", (conversationId) => {
    socket.to(conversationId).emit("user_typing", {
      userId: socket.user.id,
      userName: socket.user.name,
      isTyping: true,
    });
  });

  socket.on("typing_stop", (conversationId) => {
    socket.to(conversationId).emit("user_typing", {
      userId: socket.user.id,
      userName: socket.user.name,
      isTyping: false,
    });
  });

  socket.on("connected", (conversationId) => {
    socket.to(conversationId).emit("user_status", {
      userId: socket.user.id,
      userName: socket.user.name,
      isOnline: true,
    });
  });

  socket.on("disconnected", (conversationId) => {
    socket.to(conversationId).emit("user_status", {
      userId: socket.user.id,
      userName: socket.user.name,
      isOnline: false,
    });
  });
});

const environment = process.env.NODE_ENV;
const port = process.env.port || 3000;

httpServer.listen(port, () => {
  console.log(
    `Servidor de ${environment} rodando com WebSocket na porta ${port}`,
  );
});
