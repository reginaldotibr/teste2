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
