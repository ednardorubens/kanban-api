const Data = require('../helpers/data');
const Controller = require('./controller');

module.exports = new Controller({
  tipo: 'Atividade',  masc: false,
  mapear: { 'dt_criacao': (dt_criacao) => Data.formatar(dt_criacao) }
});