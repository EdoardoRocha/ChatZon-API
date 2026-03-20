# 🚀 Documentação ChatZon API - v2.7.0

O ChatZon é um ecossistema de mensagens em tempo real que utiliza Node.js, Express, MongoDB e Socket.io para fornecer uma experiência de chat segura e escalável. Esta versão inclui suporte a upload de imagens via AWS S3, paginação em todas as listagens e gerenciamento avançado de estados de leitura e presença.

## 🛠️ Configuração Técnica

### Variáveis de Ambiente (`.env`)
Para o funcionamento correto, o backend espera as seguintes chaves:
* `port`: Porta do servidor (padrão 3000).
* `MONGO_URL`: String de conexão com o MongoDB.
* `AUTH_SECRET`: Chave secreta para assinatura dos tokens JWT.
* `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_BUCKET_NAME`: Credenciais para armazenamento de imagens no S3.

### Scripts de Execução
* **Produção:** `npm start` (Utiliza cross-env e PM2).
* **Desenvolvimento:** `npm run dev` (Utiliza nodemon para hot reload).

---

## 📡 Rotas da API (REST)
Todas as rotas HTTP são prefixadas com `/api/v2`.

### 👤 Gerenciamento de Usuários
| Método | Rota | Descrição | Requisitos |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Cria um novo usuário com suporte a upload de avatar. | Nome, E-mail, Senha e campo `image` (Multipart). |
| `POST` | `/auth/login` | Autentica o usuário e retorna o token JWT. | E-mail e Senha. |
| `GET` | `/users` | Lista usuários (exceto o logado) com paginação. | **JWT**. Query: `page`, `limit`. |

### 💬 Conversas
| Método | Rota | Descrição | Requisitos |
| --- | --- | --- | --- |
| `POST` | `/conversations` | Inicia ou recupera uma conversa entre dois usuários. | **JWT** + `recipientId` no corpo. |
| `GET` | `/conversations` | Lista conversas do usuário com paginação. | **JWT**. Query: `page`, `limit`. |

### ✉️ Mensagens
| Método | Rota | Descrição | Requisitos |
| --- | --- | --- | --- |
| `POST` | `/messages` | Envia uma mensagem e dispara eventos via Socket. | **JWT** + `receiverId`, `conversationId`, `text`. |
| `GET` | `/messages/:id` | Recupera histórico de uma conversa com paginação. | **JWT**. Query: `page`, `limit`. |

---

## 🔌 Socket.io (Eventos em Tempo Real)

### Autenticação e Conexão
Para conectar ao servidor WebSocket, é obrigatório enviar um JWT válido.
* **Ambiente de Dev:** Enviar via Header `token`.
* **Produção:** Enviar via objeto `auth: { token: '...' }` no handshake.
* **Sala Privada:** Ao conectar, o usuário entra automaticamente em uma sala com seu próprio ID para notificações.

### Eventos Enviados pelo Cliente (App -> Servidor)
* **`join_chat`**: Entra na sala da conversa e marca mensagens como lidas (`hasUnreadMessages: false`).
  * Payload: `conversationId` (String).
* **`typing_start`**: Informa que o usuário começou a digitar.
  * Payload: `conversationId`.
* **`typing_stop`**: Informa que o usuário parou de digitar.
  * Payload: `conversationId`.
* **`connected`**: Notifica que o usuário está online em uma conversa específica.
* **`disconnected**`: Notifica que o usuário saiu de uma conversa ou desconectou.

### Eventos Enviados pelo Servidor (Servidor -> App)
* **`receive_message`**: Enviado para todos os membros da sala da conversa quando uma nova mensagem é postada via API.
* **`new_notification`**: Enviado para a sala privada do destinatário caso ele não esteja presente na sala da conversa no momento do envio.
* **`user_typing`**: Notifica se alguém está digitando (`userId`, `userName`, `isTyping`).
* **`user_status`**: Informa se um usuário está online/offline (`userId`, `isOnline`).
* **`unread_cleared`**: Confirma que as mensagens não lidas foram limpas ao entrar no chat.
* **`error_message`**: Alerta sobre falhas de permissão ou dados inválidos.

---

## 📦 Tecnologias Utilizadas
* **Express 5.2.1** - Framework web.
* **Socket.io 4.8.3** - Comunicação em tempo real.
* **Mongoose 9.2.3** - Modelagem de dados para MongoDB.
* **AWS SDK (S3)** - Armazenamento de avatares na nuvem.
* **JSON Web Token (JWT)** - Autenticação segura.
* **Bcryptjs** - Criptografia de senhas.
