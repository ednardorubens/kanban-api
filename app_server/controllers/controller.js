const Dao = require('../models/dao');

module.exports = (() => (tipo, masc = true, popular, mapear = (objeto, callback) => callback()) => {
  
  const _dao = Dao(tipo, masc), _masc = () => (masc ? 'o' : 'a');

  const _responderBusca = (res, erro, itens) => {
    if (erro) {
      res.status(404).json({'erro': erro});
    } else if (!itens || itens.length === 0) {
      res.status(200).json({
        'mensagem': 'Nenhum' + _masc() + ' ' + tipo + ' foi encontrad' + _masc() + '!'
      });
    } else {
      res.status(200).json(itens);
    }
  }
  
  const _responderAtualizacao = (req, res, erro, item, operacao) => {
    if (erro) {
      res.status(400).json({'erro': erro});
    } else if (item) {
      if (operacao === 'salvar') {
        res.status(201).location(req.path + '/' + item._id).json({
          'mensagem': tipo + ' salv' + _masc() + ' com sucesso!',
          'item': item
        });
      } else if (operacao === 'atualizar') {
        res.status(200).json({
          'mensagem': tipo + ' atualizad' + _masc() + ' com sucesso!',
          'item': Object.assign(item, req.body)
        });
      }
    } else if (operacao === 'atualizar') {
      res.status(404).json({
        'erro': tipo + ' não encontrad' + _masc() + '!'
      });
    }
  }

  const _responderRemocao = (res, erro, item) => {
    if (erro) {
      res.status(404).json({'erro': erro});
    } else if (item) {
      res.status(200).json({
        'mensagem': tipo + ' removid' + _masc() + ' com sucesso!'
      });
    } else {
      res.status(404).json({
        'erro': tipo + ' não encontrad' + _masc() + '!'
      });
    }
  }

  const _listar = (res) => {
    if (popular) {
      _dao.listar((erro, itens) => _responderBusca(res, erro, itens)).populate(popular);
    } else {
      _dao.listar((erro, itens) => _responderBusca(res, erro, itens));
    }
  }
  
  const _buscar = (req, res) => {
    if (req.params.id) {
      _dao.buscar(req.params.id, (erro, item) => _responderBusca(res, erro, item));
    }
  };

  const _inserir = (req, res) => {
    if (req && req.body && res) {
      mapear(req.body, () => _dao.inserir(req.body, (erro, item) => _responderAtualizacao(req, res, erro, item, 'salvar')));
    }
  }
  
  const _atualizar = (req, res) => {
    if (req && req.params.id && res) {
      mapear(req.body, () => _dao.atualizar(req.params.id, req.body, (erro, item) => _responderAtualizacao(req, res, erro, item, 'atualizar')));
    }
  };
  
  const _remover = (req, res) => {
    if (req && req.params.id && res) {
      _dao.remover(req.params.id, (erro, item) => _responderRemocao(res, erro, item));
    }
  }
  
  return {
    getDao                : () => _dao,
    listar                : (req, res) => _listar(res),
    buscar                : (req, res) => _buscar(req, res),
    inserir               : (req, res) => _inserir(req, res),
    atualizar             : (req, res) => _atualizar(req, res),
    remover               : (req, res) => _remover(req, res),
    responderBusca        : (res, erro, itens) => _responderBusca(res, erro, itens),
    responderAtualizacao  : (req, res, erro, item) => _responderAtualizacao(req, res, erro, item),
    responderRemocao      : (req, res, erro, item) => _responderRemocao(res, erro, item),
  }
})();