  const express = require('express');
  const session = require('express-session');
  const path = require('path');

  const tarefasRoutes    = require('./src/routes/tarefasRoutes');
  const usuariosRoutes   = require('./src/routes/usuariosRoutes');
  const authRoutes       = require('./src/routes/authRoutes');
  const viewRoutes       = require('./src/routes/viewRoutes');

  const app = express();

  // Configurar EJS como template engine
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'src/views'));

  // Servir arquivos estáticos (CSS, imagens)
  app.use(express.static('public'));

  // Interpretar JSON e formulários HTML
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Configurar sessões
  app.use(session({
    secret: 'segredo_super_secreto',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hora
  }));

  // Registrar rotas da API
  app.use('/api/tarefas',   tarefasRoutes);
  app.use('/api/usuarios',  usuariosRoutes);
  app.use('/api',           authRoutes);

  // Registrar rotas do navegador (views)
  app.use('/', viewRoutes);

  app.listen(3000, () => console.log('Servidor rodando na porta 3000'));