const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const tarefaModel = require('../models/tarefaModel');
const usuarioModel = require('../models/usuarioModel');
const { autenticar } = require('../middlewares/authMiddleware');

// Raiz — redireciona conforme login
router.get('/', (req, res) => {
  res.redirect(req.session.usuario ? '/tarefas' : '/login');
});

// Exibe formulário de login
router.get('/login', (req, res) => {
  res.render('login');
});

// Processa login do formulário
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

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

// Lista de tarefas
router.get('/tarefas', autenticar, async (req, res) => {
  try {
    const tarefas = await tarefaModel.listar();
    res.render('tarefas/index', { tarefas, usuario: req.session.usuario });
  } catch (err) {
    res.status(500).send('Erro ao buscar tarefas');
  }
});

// Formulário nova tarefa
router.get('/tarefas/nova', autenticar, (req, res) => {
  res.render('tarefas/form', { tarefa: null, usuario: req.session.usuario });
});

// Criar tarefa via formulário
router.post('/tarefas', autenticar, async (req, res) => {
  try {
    await tarefaModel.criar(req.body);
    res.redirect('/tarefas');
  } catch (err) {
    res.status(500).send('Erro ao criar tarefa');
  }
});

// Formulário editar tarefa
router.get('/tarefas/:id/editar', autenticar, async (req, res) => {
  try {
    const tarefa = await tarefaModel.buscarPorId(req.params.id);
    if (!tarefa) return res.redirect('/tarefas');
    res.render('tarefas/form', { tarefa, usuario: req.session.usuario });
  } catch (err) {
    res.redirect('/tarefas');
  }
});

// Salvar edição via formulário
router.post('/tarefas/:id/editar', autenticar, async (req, res) => {
  try {
    await tarefaModel.atualizar(req.params.id, req.body);
    res.redirect('/tarefas');
  } catch (err) {
    res.status(500).send('Erro ao atualizar tarefa');
  }
});

// Excluir tarefa via formulário
router.post('/tarefas/:id/excluir', autenticar, async (req, res) => {
  try {
    await tarefaModel.excluir(req.params.id);
    res.redirect('/tarefas');
  } catch (err) {
    res.status(500).send('Erro ao excluir tarefa');
  }
});

module.exports = router;
