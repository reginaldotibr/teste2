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
