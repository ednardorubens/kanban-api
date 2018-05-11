const Data = require('../helpers/data');
const Controller = require('./controller');

module.exports = Controller('Projeto', (projeto, callback) => {
  if (projeto) {
    projeto.dt_criacao = Data.formatar(projeto.dt_criacao);
    callback();
  }
});
