# Roteiro — Sistema de Tarefas do Zero

Siga cada passo na ordem. Ao final você terá o projeto completo funcionando.

---

## Pré-requisitos

- Node.js instalado (versão 18 ou superior)
- VS Code instalado
- MySQL rodando localmente
- Um banco de dados criado no MySQL (ex: `sistema_tarefas`)

---

## PASSO 1 — Criar a pasta e abrir no VS Code

No terminal do VS Code:

```bash
mkdir sistema-tarefas
cd sistema-tarefas
code .
```


Criar toda a estrutura de pastas
```bash
New-Item -ItemType Directory -Force -Path "src\models" 
New-Item -ItemType Directory -Force -Path "src\controllers" 
New-Item -ItemType Directory -Force -Path "src\routes" 
New-Item -ItemType Directory -Force -Path "src\middlewares" 
New-Item -ItemType Directory -Force -Path "src\views\tarefas" 
New-Item -ItemType Directory -Force -Path "src\prisma" 
New-Item -ItemType Directory -Force -Path "public"
```

— Criar todos os arquivos
```bash
New-Item -ItemType File -Path "server.js"
New-Item -ItemType File -Path "src\models\tarefaModel.js"
New-Item -ItemType File -Path "src\models\usuarioModel.js"
New-Item -ItemType File -Path "src\controllers\tarefaController.js"
New-Item -ItemType File -Path "src\controllers\usuarioController.js"
New-Item -ItemType File -Path "src\controllers\authController.js"
New-Item -ItemType File -Path "src\routes\tarefasRoutes.js"
New-Item -ItemType File -Path "src\routes\usuariosRoutes.js"
New-Item -ItemType File -Path "src\routes\authRoutes.js"
New-Item -ItemType File -Path "src\routes\viewRoutes.js"
New-Item -ItemType File -Path "src\middlewares\authMiddleware.js"
New-Item -ItemType File -Path "src\views\layout.ejs"
New-Item -ItemType File -Path "src\views\login.ejs"
New-Item -ItemType File -Path "src\views\tarefas\index.ejs"
New-Item -ItemType File -Path "src\views\tarefas\form.ejs"
New-Item -ItemType File -Path "src\prisma\client.js"
```







---

## PASSO 2 — Inicializar o projeto Node.js

```bash
npm init -y
```

---

## PASSO 3 — Instalar as dependências

```bash
npm install express bcryptjs express-session ejs
npm install prisma@^6 @prisma/client@^6
```

---

## PASSO 4 — Inicializar o Prisma

```bash
npx prisma init
```

Esse comando cria três arquivos:
- `prisma/schema.prisma` — onde definimos os modelos do banco
- `.env` — onde colocamos a URL de conexão com o banco
- `prisma.config.ts` — configuração interna do Prisma, não precisa mexer

---

## PASSO 5 — Configurar o `.env`

Abra o arquivo `.env` e substitua o conteúdo por:

```
DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/sistema_tarefas"
```

Substitua `USUARIO` e `SENHA` pelas credenciais do seu MySQL.

Crie também o arquivo `.env.example` na raiz com o conteúdo:

```
DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/NOME_DO_BANCO"
```

---

## PASSO 6 — Verificar o `.gitignore`

O `npx prisma init` já cria o `.gitignore` automaticamente com `node_modules` e `.env`. Verifique se o arquivo existe na raiz — se existir, não precisa fazer nada. Se não existir, crie com o conteúdo:

```
node_modules
.env
```

---

## PASSO 7 — Configurar o `prisma/schema.prisma`

Substitua todo o conteúdo do arquivo por:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Usuario {
  id        Int      @id @default(autoincrement())
  nome      String   @db.VarChar(100)
  email     String   @unique @db.VarChar(150)
  senha     String   @db.VarChar(255)
  criadoEm DateTime @default(now()) @map("criado_em")

  @@map("usuarios")
}

model Tarefa {
  id        Int      @id @default(autoincrement())
  titulo    String   @db.VarChar(200)
  descricao String?  @db.Text
  status    String   @default("pendente") @db.VarChar(50)
  criadoEm DateTime @default(now()) @map("criado_em")

  @@map("tarefas")
}
```

---

## PASSO 8 — Criar as tabelas no banco

Apagar caso exista
```bash
npx prisma migrate reset
```
Criar
```bash
npx prisma migrate dev --name criar_tabelas_iniciais
```

Esse comando cria as tabelas `usuarios` e `tarefas` no MySQL automaticamente.

---

---

## PASSO 10 — Criar a estrutura de pastas

```bash
mkdir src
mkdir src\controllers
mkdir src\middlewares
mkdir src\models
mkdir src\prisma
mkdir src\routes
mkdir src\views
mkdir src\views\tarefas
```

---

## PASSO 11 — Criar o `src/prisma/client.js`

```js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;
```

---

## PASSO 12 — Criar o `src/models/tarefaModel.js`

```js
const prisma = require('../prisma/client');

const listar = async () => {
  return await prisma.tarefa.findMany({ orderBy: { criadoEm: 'desc' } });
};

const buscarPorId = async (id) => {
  return await prisma.tarefa.findUnique({ where: { id: Number(id) } });
};

const criar = async (dados) => {
  return await prisma.tarefa.create({
    data: {
      titulo: dados.titulo,
      descricao: dados.descricao,
      status: dados.status || 'pendente',
    },
  });
};

const atualizar = async (id, dados) => {
  return await prisma.tarefa.update({
    where: { id: Number(id) },
    data: {
      titulo: dados.titulo,
      descricao: dados.descricao,
      status: dados.status,
    },
  });
};

const excluir = async (id) => {
  return await prisma.tarefa.delete({ where: { id: Number(id) } });
};

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
```

---

## PASSO 13 — Criar o `src/models/usuarioModel.js`

```js
const prisma = require('../prisma/client');

const criar = async (dados) => {
  return await prisma.usuario.create({ data: dados });
};

const listar = async () => {
  return await prisma.usuario.findMany({
    select: { id: true, nome: true, email: true, criadoEm: true },
  });
};

const buscarPorId = async (id) => {
  return await prisma.usuario.findUnique({
    where: { id: Number(id) },
    select: { id: true, nome: true, email: true, criadoEm: true },
  });
};

const buscarPorEmail = async (email) => {
  return await prisma.usuario.findUnique({ where: { email } });
};

const excluir = async (id) => {
  return await prisma.usuario.delete({ where: { id: Number(id) } });
};

module.exports = { criar, listar, buscarPorId, buscarPorEmail, excluir };
```

---

## PASSO 14 — Criar o `src/middlewares/authMiddleware.js`

```js
const autenticar = (req, res, next) => {
  if (req.session && req.session.usuario) {
    next();
  } else {
    if (req.originalUrl.startsWith('/api')) {
      res.status(401).json({ mensagem: 'Acesso negado. Faça login primeiro.' });
    } else {
      res.redirect('/login');
    }
  }
};

module.exports = { autenticar };
```

---

## PASSO 15 — Criar o `src/controllers/tarefaController.js`

```js
const tarefaModel = require('../models/tarefaModel');

const listar = async (req, res) => {
  try {
    const tarefas = await tarefaModel.listar();
    res.json(tarefas);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const buscarPorId = async (req, res) => {
  try {
    const tarefa = await tarefaModel.buscarPorId(req.params.id);
    if (!tarefa) return res.status(404).json({ mensagem: 'Tarefa não encontrada' });
    res.json(tarefa);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const criar = async (req, res) => {
  try {
    const tarefa = await tarefaModel.criar(req.body);
    res.status(201).json({ mensagem: 'Tarefa criada!', id: tarefa.id });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const atualizar = async (req, res) => {
  try {
    await tarefaModel.atualizar(req.params.id, req.body);
    res.json({ mensagem: 'Tarefa atualizada!' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const excluir = async (req, res) => {
  try {
    await tarefaModel.excluir(req.params.id);
    res.json({ mensagem: 'Tarefa excluída com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
```

---

## PASSO 16 — Criar o `src/controllers/usuarioController.js`

```js
const bcrypt = require('bcryptjs');
const usuarioModel = require('../models/usuarioModel');

const cadastrar = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await usuarioModel.criar({ nome, email, senha: senhaHash });
    res.status(201).json({ mensagem: 'Usuário cadastrado!', id: usuario.id });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const listar = async (req, res) => {
  try {
    const usuarios = await usuarioModel.listar();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const buscarPorId = async (req, res) => {
  try {
    const usuario = await usuarioModel.buscarPorId(req.params.id);
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const excluir = async (req, res) => {
  try {
    await usuarioModel.excluir(req.params.id);
    res.json({ mensagem: 'Usuário excluído com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

module.exports = { cadastrar, listar, buscarPorId, excluir };
```

---

## PASSO 17 — Criar o `src/controllers/authController.js`

```js
const bcrypt = require('bcryptjs');
const usuarioModel = require('../models/usuarioModel');

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await usuarioModel.buscarPorEmail(email);
    if (!usuario) return res.status(401).json({ mensagem: 'Email ou senha inválidos' });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ mensagem: 'Email ou senha inválidos' });

    req.session.usuario = { id: usuario.id, nome: usuario.nome, email: usuario.email };
    res.json({ mensagem: 'Login realizado com sucesso!', usuario: req.session.usuario });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao encerrar sessão' });
    res.json({ mensagem: 'Logout realizado com sucesso!' });
  });
};

module.exports = { login, logout };
```

---

## PASSO 18 — Criar o `src/routes/tarefasRoutes.js`

```js
const express = require('express');
const router = express.Router();
const tarefaController = require('../controllers/tarefaController');
const { autenticar } = require('../middlewares/authMiddleware');

router.get('/',       autenticar, tarefaController.listar);
router.get('/:id',    autenticar, tarefaController.buscarPorId);
router.post('/',      autenticar, tarefaController.criar);
router.put('/:id',    autenticar, tarefaController.atualizar);
router.delete('/:id', autenticar, tarefaController.excluir);

module.exports = router;
```

---

## PASSO 19 — Criar o `src/routes/usuariosRoutes.js`

```js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { autenticar } = require('../middlewares/authMiddleware');

router.post('/',      usuarioController.cadastrar);
router.get('/',       autenticar, usuarioController.listar);
router.get('/:id',    autenticar, usuarioController.buscarPorId);
router.delete('/:id', autenticar, usuarioController.excluir);

module.exports = router;
```

---

## PASSO 20 — Criar o `src/routes/authRoutes.js`

```js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login',  authController.login);
router.post('/logout', authController.logout);

module.exports = router;
```

---

## PASSO 21 — Criar o `src/routes/viewRoutes.js`

```js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const tarefaModel = require('../models/tarefaModel');
const usuarioModel = require('../models/usuarioModel');
const { autenticar } = require('../middlewares/authMiddleware');

router.get('/', (req, res) => {
  res.redirect(req.session.usuario ? '/tarefas' : '/login');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await usuarioModel.buscarPorEmail(email);
    if (!usuario) return res.render('login', { erro: 'Email ou senha inválidos' });
    const valido = await bcrypt.compare(senha, usuario.senha);
    if (!valido) return res.render('login', { erro: 'Email ou senha inválidos' });
    req.session.usuario = { id: usuario.id, nome: usuario.nome };
    res.redirect('/tarefas');
  } catch (err) {
    res.render('login', { erro: 'Erro ao realizar login' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

router.get('/tarefas', autenticar, async (req, res) => {
  try {
    const tarefas = await tarefaModel.listar();
    res.render('tarefas/index', { tarefas, usuario: req.session.usuario });
  } catch (err) {
    res.status(500).send('Erro ao buscar tarefas');
  }
});

router.get('/tarefas/nova', autenticar, (req, res) => {
  res.render('tarefas/form', { tarefa: null, usuario: req.session.usuario });
});

router.post('/tarefas', autenticar, async (req, res) => {
  try {
    await tarefaModel.criar(req.body);
    res.redirect('/tarefas');
  } catch (err) {
    res.status(500).send('Erro ao criar tarefa');
  }
});

router.get('/tarefas/:id/editar', autenticar, async (req, res) => {
  try {
    const tarefa = await tarefaModel.buscarPorId(req.params.id);
    if (!tarefa) return res.redirect('/tarefas');
    res.render('tarefas/form', { tarefa, usuario: req.session.usuario });
  } catch (err) {
    res.redirect('/tarefas');
  }
});

router.post('/tarefas/:id/editar', autenticar, async (req, res) => {
  try {
    await tarefaModel.atualizar(req.params.id, req.body);
    res.redirect('/tarefas');
  } catch (err) {
    res.status(500).send('Erro ao atualizar tarefa');
  }
});

router.post('/tarefas/:id/excluir', autenticar, async (req, res) => {
  try {
    await tarefaModel.excluir(req.params.id);
    res.redirect('/tarefas');
  } catch (err) {
    res.status(500).send('Erro ao excluir tarefa');
  }
});

module.exports = router;
```

---

## PASSO 22 — Criar o `src/views/layout.ejs`

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title><%= titulo %></title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; background: #f4f4f4; }
    nav { background: #2c3e50; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; }
    nav a { color: white; text-decoration: none; margin-right: 16px; }
    nav span { color: #ccc; font-size: 14px; }
    .container { max-width: 860px; margin: 30px auto; background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { padding: 10px 14px; border: 1px solid #ddd; text-align: left; }
    th { background: #2c3e50; color: white; }
    tr:nth-child(even) { background: #f9f9f9; }
    input, select, textarea { width: 100%; padding: 8px; margin: 5px 0 14px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; }
    button, .btn { padding: 9px 18px; background: #2c3e50; color: white; border: none; cursor: pointer; border-radius: 4px; text-decoration: none; display: inline-block; }
    .btn-excluir { background: #c0392b; padding: 6px 12px; }
    .btn-editar  { background: #2980b9; padding: 6px 12px; }
    .btn-novo    { background: #27ae60; margin-bottom: 14px; }
    .badge-pendente     { background: #e67e22; color: white; padding: 3px 8px; border-radius: 4px; font-size: 12px; }
    .badge-concluida    { background: #27ae60; color: white; padding: 3px 8px; border-radius: 4px; font-size: 12px; }
    .badge-em-andamento { background: #2980b9; color: white; padding: 3px 8px; border-radius: 4px; font-size: 12px; }
  </style>
</head>
<body>
  <nav>
    <div>
      <a href="/tarefas">Tarefas</a>
      <a href="/tarefas/nova">+ Nova Tarefa</a>
    </div>
    <div>
      <% if (usuario) { %>
        <span>Olá, <%= usuario.nome %></span>
        <a href="/logout" style="margin-left:14px; color:#e74c3c;">Sair</a>
      <% } %>
    </div>
  </nav>
  <div class="container">
    <%- corpo %>
  </div>
</body>
</html>
```

---

## PASSO 23 — Criar o `src/views/login.ejs`

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Login</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
    .box { background: white; padding: 32px; border-radius: 8px; width: 340px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
    h2 { text-align: center; color: #2c3e50; margin-bottom: 20px; }
    label { font-size: 14px; color: #555; }
    input { width: 100%; padding: 9px; margin: 5px 0 14px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; }
    button { width: 100%; padding: 10px; background: #2c3e50; color: white; border: none; cursor: pointer; border-radius: 4px; font-size: 15px; }
    .erro { color: #c0392b; text-align: center; margin-bottom: 12px; font-size: 14px; }
  </style>
</head>
<body>
  <div class="box">
    <h2>Sistema de Tarefas</h2>
    <% if (typeof erro !== 'undefined') { %>
      <p class="erro"><%= erro %></p>
    <% } %>
    <form method="POST" action="/login">
      <label>Email</label>
      <input type="email" name="email" required placeholder="seu@email.com">
      <label>Senha</label>
      <input type="password" name="senha" required placeholder="••••••••">
      <button type="submit">Entrar</button>
    </form>
  </div>
</body>
</html>
```

---

## PASSO 24 — Criar o `src/views/tarefas/index.ejs`

```html
<%
  const corpo = `
    <h2>Lista de Tarefas</h2>
    <a href="/tarefas/nova" class="btn btn-novo">+ Nova Tarefa</a>
    <table>
      <tr>
        <th>ID</th><th>Título</th><th>Status</th><th>Ações</th>
      </tr>
      ${ tarefas.length === 0
        ? '<tr><td colspan="4" style="text-align:center">Nenhuma tarefa cadastrada.</td></tr>'
        : tarefas.map(t => `
          <tr>
            <td>${t.id}</td>
            <td>${t.titulo}</td>
            <td><span class="badge-${t.status.replace(' ','-')}">${t.status}</span></td>
            <td>
              <a href="/tarefas/${t.id}/editar" class="btn btn-editar">Editar</a>
              <form method="POST" action="/tarefas/${t.id}/excluir" style="display:inline">
                <button class="btn btn-excluir" onclick="return confirm('Excluir esta tarefa?')">Excluir</button>
              </form>
            </td>
          </tr>
        `).join('')
      }
    </table>
  `;
%>
<%- include('../layout', { titulo: 'Tarefas', corpo, usuario }) %>
```

---

## PASSO 25 — Criar o `src/views/tarefas/form.ejs`

```html
<%
  const corpo = `
    <h2>${ tarefa ? 'Editar Tarefa' : 'Nova Tarefa' }</h2>
    <form method="POST" action="${ tarefa ? '/tarefas/' + tarefa.id + '/editar' : '/tarefas' }">
      <label>Título</label>
      <input type="text" name="titulo" value="${ tarefa ? tarefa.titulo : '' }" required>

      <label>Descrição</label>
      <textarea name="descricao" rows="4">${ tarefa ? tarefa.descricao || '' : '' }</textarea>

      <label>Status</label>
      <select name="status">
        <option value="pendente"     ${ tarefa && tarefa.status === 'pendente'     ? 'selected' : '' }>Pendente</option>
        <option value="em andamento" ${ tarefa && tarefa.status === 'em andamento' ? 'selected' : '' }>Em andamento</option>
        <option value="concluida"    ${ tarefa && tarefa.status === 'concluida'    ? 'selected' : '' }>Concluída</option>
      </select>

      <button type="submit">${ tarefa ? 'Salvar alterações' : 'Criar Tarefa' }</button>
      <a href="/tarefas" style="margin-left:12px; color:#555;">Cancelar</a>
    </form>
  `;
%>
<%- include('../layout', { titulo: tarefa ? 'Editar Tarefa' : 'Nova Tarefa', corpo, usuario }) %>
```

---

## PASSO 26 — Criar o `server.js`

```js
const express = require('express');
const session = require('express-session');
const path = require('path');

const tarefasRoutes  = require('./src/routes/tarefasRoutes');
const usuariosRoutes = require('./src/routes/usuariosRoutes');
const authRoutes     = require('./src/routes/authRoutes');
const viewRoutes     = require('./src/routes/viewRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'segredo_super_secreto',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 }
}));

app.use('/api/tarefas',  tarefasRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api',          authRoutes);
app.use('/',             viewRoutes);

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
```

---

## PASSO 27 — Rodar o projeto

```bash
node server.js
```

Acesse no navegador: `http://localhost:3000`

---

## PASSO 28 — Cadastrar o primeiro usuário

Como ainda não há usuários, use o terminal para cadastrar via API.

No terminal do VS Code (PowerShell):

```bash
curl -X POST http://localhost:3000/api/usuarios -H "Content-Type: application/json" -d "{\"nome\":\"Seu Nome\",\"email\":\"seu@email.com\",\"senha\":\"123456\"}"
```

Se der certo, o terminal mostra: `{"mensagem":"Usuário cadastrado!","id":1}`

Depois acesse `http://localhost:3000/login` e faça login.

---

## PASSO 29 — Inicializar o git e fazer o primeiro commit

```bash
git init
git add .
git commit -m "projeto sistema de tarefas completo"
```

---

## Estrutura final do projeto

```
sistema-tarefas/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── tarefaController.js
│   │   └── usuarioController.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── tarefaModel.js
│   │   └── usuarioModel.js
│   ├── prisma/
│   │   └── client.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── tarefasRoutes.js
│   │   ├── usuariosRoutes.js
│   │   └── viewRoutes.js
│   └── views/
│       ├── layout.ejs
│       ├── login.ejs
│       └── tarefas/
│           ├── form.ejs
│           └── index.ejs
├── .env
├── .env.example
├── .gitignore
├── package.json
├── prisma.config.ts
└── server.js
```

---

## Rotas disponíveis

### Interface no navegador
| Rota | Descrição |
|---|---|
| `GET /` | Redireciona para login ou tarefas |
| `GET /login` | Página de login |
| `GET /tarefas` | Lista de tarefas |
| `GET /tarefas/nova` | Formulário de nova tarefa |
| `GET /tarefas/:id/editar` | Formulário de edição |
| `GET /logout` | Encerra a sessão |

### API REST
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/usuarios` | Cadastrar usuário |
| POST | `/api/login` | Fazer login |
| POST | `/api/logout` | Fazer logout |
| GET | `/api/tarefas` | Listar tarefas |
| GET | `/api/tarefas/:id` | Buscar tarefa por ID |
| POST | `/api/tarefas` | Criar tarefa |
| PUT | `/api/tarefas/:id` | Atualizar tarefa |
| DELETE | `/api/tarefas/:id` | Excluir tarefa |
