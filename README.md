# 🚀 Documentação ChatZon API - v2.0.0

O ChatZon é um ecossistema de mensagens em tempo real que utiliza Node.js, Express, MongoDB e Socket.io para fornecer uma experiência de chat segura e escalável.

## 🔌 Socket.io (Eventos em Tempo Real)

A comunicação via WebSocket é utilizada para notificações, status de digitação e entrega de mensagens instantâneas.

### Autenticação e Conexão

Para conectar ao servidor WebSocket, é obrigatório enviar um JWT válido no cabeçalho do handshake.

* **Header:** `token: <JWT_TOKEN>`
* **Sala Privada:** Ao conectar, o usuário é automaticamente inserido em uma sala privada identificada pelo seu próprio ID (`socket.user.id`), permitindo o recebimento de notificações personalizadas.

### Eventos Cliente -> Servidor (Enviados pelo App)

* **`join_chat`**: Solicita a entrada em uma sala de conversa específica.
* **Payload:** `conversationId` (String)
* **Ações:** Valida se o usuário é participante da conversa, marca mensagens como lidas **hasUnreadMessage = false** e entra na sala do Socket.


* **`typing_start`**: Informa que o usuário começou a digitar.
* **Payload:** `conversationId` (String)


* **`typing_stop`**: Informa que o usuário parou de digitar.
* **Payload:** `conversationId` (String)


* **`connected` / `disconnected**`: Informa a mudança de status online/offline para os participantes da sala.

### Eventos Servidor -> Cliente (Recebidos pelo App)

* **`receive_message`**: Enviado para todos os membros de uma sala quando uma nova mensagem é postada via API.
* **`new_notification`**: Enviado para a sala privada do destinatário caso ele não esteja com a janela do chat aberta no momento.
* **`user_typing`**: Notifica os outros membros se alguém está digitando (contém `userId`, `userName` e `isTyping`).
* **`error_message`**: Enviado em caso de falhas de permissão ou erros internos no Socket.

---

## 📡 Rotas da API (REST)

Todas as rotas HTTP são prefixadas com `/api/v2`.

### 👤 Gerenciamento de Usuários (`/api/v2`)

| Método | Rota | Descrição | Requisitos |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Cria um novo usuário (nome, e-mail, senha). | Nome, E-mail único e Senha. |
| `POST` | `/auth/login` | Autentica o usuário e retorna o token JWT. | E-mail e Senha. |
| `GET` | `/users` | Lista todos os usuários (exceto senhas). | **JWT Requerido**. |

### 💬 Conversas (`/api/v2/conversations`)

| Método | Rota | Descrição | Requisitos |
| --- | --- | --- | --- |
| `POST` | `/` | Encontra uma conversa existente ou cria uma nova entre dois IDs. | **JWT** + `recipientId` no corpo. |
| `GET` | `/` | Lista todas as conversas das quais o usuário logado participa. | **JWT Requerido**. |

### ✉️ Mensagens (`/api/v2/messages`)

| Método | Rota | Descrição | Requisitos |
| --- | --- | --- | --- |
| `POST` | `/` | Envia uma mensagem. Dispara eventos `receive_message` ou `new_notification` via Socket. | **JWT** + `receiverId`, `conversationId`, `text`. |
| `GET` | `/:id` | Recupera o histórico completo de mensagens de uma conversa (pelo ID da conversa). | **JWT** + O usuário deve ser participante. |

---

## 🛠️ Configuração Técnica

### Variáveis de Ambiente (`.env`)

Para o funcionamento correto, o backend espera as seguintes chaves:

* `port`: Porta do servidor (padrão 3000).
* `MONGO_URL`: String de conexão com o MongoDB.
* `AUTH_SECRET`: Chave secreta para assinatura dos tokens JWT.

### Scripts de Execução

* **Produção:** `npm start` (Utiliza cross-env para setar NODE_ENV).
* **Desenvolvimento:** `npm run dev` (Utiliza nodemon para hot reload).