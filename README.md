
# Sistema de Locação de Veículos

Sistema web desenvolvido para gerenciamento de locações de veículos, permitindo o cadastro de usuários, autenticação, gerenciamento de veículos, registro de locações e devoluções.

## Tecnologias utilizadas

### Backend
- Node.js
- Express
- JavaScript
- Prisma ORM
- MySQL
- JWT
- Bcryptjs

### Frontend
- React
- Vite
- Axios
- Lucide React
- CSS

## Funcionalidades

- Cadastro de usuários.
- Login com autenticação JWT.
- Proteção de rotas por Middleware.
- Cadastro e consulta de veículos.
- Controle de disponibilidade dos veículos.
- Registro de locações.
- Cálculo automático do valor da locação.
- Consulta das próprias locações.
- Devolução de veículos.
- Histórico de locações finalizadas.
- Dashboard com indicadores.
- Exibição das locações recentes.

## Estrutura do projeto

```text
sistema-locacao-veiculos/
├── backend/
│   ├── prisma/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── routes/
│       └── services/
├── frontend/
│   └── src/
├── .gitignore
├── package.json
└── README.md
```

## Pré-requisitos

- Node.js
- npm
- MySQL Server

## Como executar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/ItalloMoraes/sistema-locacao-veiculos.git
```

### 2. Configurar o banco de dados

Criar um banco MySQL chamado:

```sql
CREATE DATABASE locacao_veiculos;
```

### 3. Configurar o Backend

Entrar na pasta:

```bash
cd backend
```

Instalar as dependências:

```bash
npm install
```

Configurar o arquivo `.env` com a conexão do MySQL e o segredo JWT.

Executar as migrações:

```bash
npx prisma migrate dev
```

Iniciar o servidor:

```bash
npm run dev
```

O backend será executado na porta 3000.

### 4. Configurar o Frontend

Em outro terminal:

```bash
cd frontend
```

Instalar as dependências:

```bash
npm install
```

Iniciar o frontend:

```bash
npm run dev
```

O frontend será disponibilizado pelo Vite, normalmente em:

http://localhost:5173/

## Banco de dados

O sistema possui três entidades principais:

- Usuario
- Veiculo
- Locacao

Relacionamentos:

- Um usuário pode realizar várias locações.
- Um veículo pode participar de várias locações ao longo do tempo.
- Cada locação pertence a um usuário e a um veículo.

## Segurança

- Senhas armazenadas com hash utilizando bcryptjs.
- Autenticação com JWT.
- Middleware para proteção das rotas.
- Validação de disponibilidade dos veículos.
- Transações no banco de dados para operações de locação e devolução.
- Restrição de acesso às locações de cada usuário.

## Autor

Projeto acadêmico desenvolvido para a disciplina de Programação com Frameworks Web.
