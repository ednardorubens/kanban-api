const jwt = require('express-jwt');

module.exports = function Rotear(router) {
  const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
  });
  
  const _url = (url, controllerName, seguro = false) => {
    const auth = (seguro
      ? jwt({
        secret: process.env.JWT_SECRET,
        userProperty: 'payload'
      })
      : (req, res, next) => next()
    );

    const urlEdicao = url + '/:id';
    const controller = require('../controllers/' + controllerName);
    router.get(url, auth, controller.listar);
    router.post(url, auth, controller.inserir);
    router.get(urlEdicao, auth, controller.buscar);
    router.put(urlEdicao, auth, controller.atualizar);
    router.delete(urlEdicao, auth, controller.remover);

    return controller;
  };
  
  return {
    url    : (nome, seguro = false) => _url('/' + nome + 's', nome, seguro),
    urls   : (nomes, seguro = false) => nomes.forEach(nome => url(nome, seguro)),
    urlc   : (nome, controllerName, seguro = false) => _url('/' + nome + 's', controllerName, seguro),
  }
};