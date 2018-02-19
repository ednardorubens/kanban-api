const Data = require('../helpers/data');
const Controller = require('./controller');

module.exports = Controller('Produto', (produto, callback) => {
  if (produto) {
    produto.atualizado_em = Data.formatar(produto.atualizado_em);
    callback();
  }
});