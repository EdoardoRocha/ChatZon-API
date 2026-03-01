# ChatZon API - v1.0.0

O **ChatZon** é uma API de mensagens em tempo real (Backend) desenvolvida com Node.js e MongoDB. O sistema permite o cadastro de usuários, autenticação segura e a criação de conversas privadas entre participantes.

## 🚀 Tecnologias Utilizadas

* **Node.js & Express:** Framework principal para a construção da API.
* **MongoDB & Mongoose:** Banco de dados NoSQL e modelagem de dados.
* **JSON Web Token (JWT):** Para autenticação e autorização de rotas.
* **Bcryptjs:** Para criptografia de senhas.
* **Cors:** Gerenciamento de permissões de acesso externo.
* **Dotenv:** Gerenciamento de variáveis de ambiente.

## 🛡️ Segurança e Regras de Negócio

### Segurança

* **Criptografia de Senha:** As senhas dos usuários nunca são armazenadas em texto puro. É utilizado o `bcryptjs` com um `salt` de 12 caracteres para gerar hashes seguros antes da persistência no banco de dados.
* **Autenticação JWT:** A maioria das rotas requer um token de acesso válido enviado no cabeçalho `Authorization` via Bearer Token.
* **Middleware de Verificação:** Existe um middleware dedicado (`checkToken`) que valida a integridade e a expiração (1 dia) do token JWT antes de liberar o acesso ao controlador.
* **Isolamento de Dados:** As consultas de usuários ocultam o campo `password` nas respostas da API para evitar vazamento de dados sensíveis.

### Regras de Negócio

* **Conversas Privadas:** Uma conversa é baseada em participantes. O sistema verifica se já existe uma conversa entre dois usuários antes de criar uma nova para evitar duplicidade.
* **Permissões de Mensagem:** Apenas os participantes de uma conversa específica têm permissão para ler ou enviar mensagens dentro dela. O middleware `validateNewMessage` garante que o remetente pertença ao ID da conversa fornecido.
* **Campos Obrigatórios:** Tanto para o cadastro de usuário quanto para o envio de mensagens, existem validadores rigorosos para garantir a integridade dos dados e prevenir entradas nulas ou em formatos incorretos.

---

## 📡 Rotas da API

Todas as rotas são prefixadas com `/api`.

### 👤 Usuários (`/api`)

| Rota | Método | Descrição | Segurança |
| --- | --- | --- | --- |
| `/auth/register` | `POST` | Cria um novo usuário com nome, e-mail e senha. | Aberta |
| `/auth/login` | `POST` | Autentica um usuário existente e retorna um JWT. | Aberta |
| `/users` | `GET` | Lista todos os usuários cadastrados (sem as senhas). | **JWT Requerido** |

### 💬 Conversas (`/api/conversations`)

| Rota | Método | Descrição | Segurança |
| --- | --- | --- | --- |
| `/` | `POST` | Encontra ou cria uma conversa entre o usuário logado e outro ID. | **JWT Requerido** |
| `/` | `GET` | Lista todas as conversas das quais o usuário logado participa. | **JWT Requerido** |

### ✉️ Mensagens (`/api/messages`)

| Rota | Método | Descrição | Segurança |
| --- | --- | --- | --- |
| `/` | `POST` | Envia uma mensagem para uma conversa específica. | **JWT Requerido** |
| `/:id` | `GET` | Recupera o histórico de mensagens de uma conversa (pelo ID da conversa). | **JWT Requerido** |

---

## 🛠️ Configuração de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis (conforme o `.gitignore` e os arquivos de configuração):

```env
port=3000
MONGO_URL=sua_url_mongodb
AUTH_SECRET=sua_chave_secreta_jwt
NODE_ENV=development

```

## 🏁 Como Rodar o Projeto

* **Instalação:** `npm install`
* **Modo Produção:** `npm start`
* **Modo Desenvolvimento (com nodemon):** `npm run dev`