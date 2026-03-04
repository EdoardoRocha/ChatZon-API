import 'dotenv/config';
import express from "express";
import cors from "cors";

//Make app
const app = express();

//Config JSON response
app.use(express.json());

//Solve CORS
app.use(cors());

// Routes
import UserRoutes from "./src/routes/UserRoutes.js";
import MessageRoutes from "./src/routes/MessageRoutes.js";
import ConversationRoutes from "./src/routes/ConversationRoutes.js";

app.use("/api", UserRoutes);
app.use("/api/messages", MessageRoutes);
app.use("/api/conversations", ConversationRoutes);

const environment = process.env.NODE_ENV;
const port = process.env.port || 3000;
app.listen(port, () => {
    console.log(`Servidor de ${environment} rodando na porta ${port}`);
});