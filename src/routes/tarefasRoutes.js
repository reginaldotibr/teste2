const express = require('express');
  const router = express.Router();
  const tarefaController = require('../controllers/tarefaController');
  const { autenticar } = require('../middlewares/authMiddleware');

  router.get('/',      autenticar, tarefaController.listar);
  router.get('/:id',   autenticar, tarefaController.buscarPorId);
  router.post('/',     autenticar, tarefaController.criar);
  router.put('/:id',   autenticar, tarefaController.atualizar);
  router.delete('/:id',autenticar, tarefaController.excluir);

  module.exports = router;