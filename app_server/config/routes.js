const jwt = require('express-jwt');
module.exports = router = require('express').Router();
const rotear = require('../helpers/rotear')(router);

router.get('/', require('../controllers/main').index);

const usuarioController = require('../controllers/usuario');
router.get('/usuarios', usuarioController.listar);
router.post('/usuarios', usuarioController.inserir);
router.post('/login', usuarioController.login);
router.delete('/usuarios/:id', usuarioController.remover);

rotear.url('/usuarios/:responsavel/projetos', 'projeto');

const atividadeController = require('../controllers/atividade');
router.get('/atividades', atividadeController.listar);
router.post('/atividades', atividadeController.inserir);