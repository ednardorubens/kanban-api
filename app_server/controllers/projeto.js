const Data = require('../helpers/data');
const Controller = require('./controller');

module.exports = (() => {
  const projetoController = Controller('Projeto', (projeto, callback) => {
    if (projeto) {
      projeto.dt_criacao = Data.formatar(projeto.dt_criacao);
      callback();
    }
  });
  
  return {
    ...projetoController,
    inserir2: (req, res) => {
      req.body = {
        ...req.body,
        ...req.params
      }
      res.status(200).json(req.body);
    },
  }
})();