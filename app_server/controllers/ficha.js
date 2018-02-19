const Data = require('../helpers/data');
const Controller = require('./controller');

module.exports = Controller('Ficha', false, {
  path: 'produtos.produto',
  select: 'nome unidade valor_de_compra quantidade'
}, (ficha, callback) => {
  if (ficha) {
    ficha.atualizado_em = Data.formatar(ficha.atualizado_em);
    callback();
  }
});