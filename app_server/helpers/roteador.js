const jwt = require('express-jwt');

module.exports = (() => (router) => {
  const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
  });
  
  const _rotear = (url, controllerName, seguro = false) => {
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
  };
  
  return {
    rotear    : (url, controllerName, seguro = false) => _rotear(url, controllerName, seguro),
    rotears   : (nomes, seguro = false) => nomes.forEach(nome => rotear(nome + 's', nome, seguro)),
  }
})();