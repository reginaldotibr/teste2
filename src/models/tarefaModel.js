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
