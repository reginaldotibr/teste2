const autenticar = (req, res, next) => {
    if (req.session && req.session.usuario) {
      next();
    } else {
      // Se for requisição de API retorna JSON, senão redireciona
      if (req.originalUrl.startsWith('/api')) {
        res.status(401).json({ mensagem: 'Acesso negado. Faça login primeiro.' });
      } else {
        res.redirect('/login');
      }
    }
  };

  module.exports = { autenticar };