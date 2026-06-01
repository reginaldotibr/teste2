const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;




//     PASSO 29 — Comparativo para os alunos

//   Mostre lado a lado como o mesmo código fica com mysql2 vs Prisma:

//   // ── COM mysql2 ─────────────────────────────────────────────
//   const listar = (callback) => {
//     db.query('SELECT * FROM tarefas', callback);
//   };

//   // ── COM PRISMA ──────────────────────────────────────────────
//   const listar = async () => {
//     return await prisma.tarefa.findMany();
//   };

//   // ── COM mysql2 ─────────────────────────────────────────────
//   const criar = (dados, callback) => {
//     db.query('INSERT INTO tarefas (titulo, status) VALUES (?, ?)',
//       [dados.titulo, dados.status], callback);
//   };

//   // ── COM PRISMA ──────────────────────────────────────────────
//   const criar = async (dados) => {
//     return await prisma.tarefa.create({ data: dados });
//   };
