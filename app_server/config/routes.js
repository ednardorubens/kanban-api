const jwt = require('express-jwt');
module.exports = router = require('express').Router();

router.get('/', require('../controllers/main').index);

const auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});

const rotear = (nomes) => {
  nomes.forEach(nome => {
    const controller = require('../controllers/' + nome);
    router.get('/' + nome + 's', controller.listar);
    router.post('/' + nome + 's', auth, controller.inserir);
    router.get('/' + nome + 's/:id', auth, controller.buscar);
    router.put('/' + nome + 's/:id', auth, controller.atualizar);
    router.delete('/' + nome + 's/:id', auth, controller.remover);
  });
};

const usuarioController = require('../controllers/usuario');
router.get('/usuarios', usuarioController.listar);
router.post('/usuarios', usuarioController.inserir);
router.post('/login', usuarioController.login);
router.delete('/usuarios/:id', usuarioController.remover);