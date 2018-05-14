const passport = require('passport');
const Controller = require('./controller');

module.exports = Object.assign({}, new Controller({ tipo: 'Usuario' }), {
  login: (req, res) => passport.authenticate('local', (erro, usuario, info) => {
    if(usuario){
      res.status(200).json({
        token: usuario.gerarJwt()
      });
    } else if (erro) {
      res.status(erro.status).json(erro.mensagem);
    }
  })(req, res)
});