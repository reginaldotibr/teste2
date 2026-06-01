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
