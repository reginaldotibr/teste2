 const express = require('express');
  const router = express.Router();
  const usuarioController = require('../controllers/usuarioController');
  const { autenticar } = require('../middlewares/authMiddleware');

  router.post('/',     usuarioController.cadastrar);
  router.get('/',      autenticar, usuarioController.listar);
  router.get('/:id',   autenticar, usuarioController.buscarPorId);
  router.delete('/:id',autenticar, usuarioController.excluir);

  module.exports = router;
