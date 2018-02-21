const Data = require('../helpers/data');
const Controller = require('./controller');

module.exports = Controller('Atividade', (atividade, callback) => {
  if (atividade) {
    atividade.dt_criacao = Data.formatar(atividade.dt_criacao);
    callback();
  }
});