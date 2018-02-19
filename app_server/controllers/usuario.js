const passport = require('passport');
const Controller = require('./controller');

module.exports = (() => {
  return {
    ...Controller('Usuario'),
    login: (req, res) => passport.authenticate('local', (erro, usuario, info) => {
      if(usuario){
        res.status(200);
        res.json({
          token: usuario.gerarJwt()
        });
      } else if (erro) {
        res.status(erro.status).json(erro.mensagem);
      }
    })(req, res)
  }
})();