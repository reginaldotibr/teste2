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
