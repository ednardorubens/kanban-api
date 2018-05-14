module.exports = router = require('express').Router();
const rotear = new require('../helpers/rotear')(router);

router.get('/', require('../controllers/main').index);

const usuarioController = rotear.url('usuario');
router.post('/login', usuarioController.login);
rotear.urlc('/usuarios/:responsavel/projetos', 'projeto');

const atividadeController = require('../controllers/atividade');
router.get('/atividades', atividadeController.listar);
router.post('/atividades', atividadeController.inserir);