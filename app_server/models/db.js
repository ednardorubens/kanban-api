const logger = require('winston');
const mongoose = require('mongoose');

const uri = process.env.KANBAN_MONGO_URL;
const options = {user: process.env.KANBAN_MONGO_USER, pass: process.env.KANBAN_MONGO_PASS};

module.exports = (() => {
  const connect = () => {
    mongoose.connect(uri, options);

    mongoose.connection
      .on('connected', () => logger.info('Mongoose connected to ' + uri))
      .on('error', (error) => logger.info('Mongoose connection error: ' + error))
      .on('disconnected', () => logger.info('Mongoose disconnected of ' + uri));

    const gracefulShutdown = (msg) => {
      logger.info('Mongoose disconnected through ' + msg);
      mongoose.connection.close(() => process.exit(0));
    };
    
    process.on('SIGINT', () => gracefulShutdown('app termination'))
      .on('SIGTERM', () => gracefulShutdown('heroku termination'));
  }

  return {
    connect: () => connect(),
  };
})();

mongoose.Error.messages.general.default = "A validação falhou para o campo '{PATH}' com valor '{VALUE}'";
mongoose.Error.messages.general.required = "O campo '{PATH}' é obrigatório";

mongoose.Error.messages.Number.min = "O valor '{VALUE}' inserido no campo '{PATH}' é menor que o mínimo({MIN}) permitido";
mongoose.Error.messages.Number.max = "O valor '{VALUE}' inserido no campo '{PATH}' é maior que o máximo({MAX}) permitido";

mongoose.Error.messages.Date.min = "O valor '{VALUE}' inserido no campo '{PATH}' é anterior ao mínimo({MIN}) permitido";
mongoose.Error.messages.Date.max = "O valor '{VALUE}' inserido no campo '{PATH}' é posterior ao máximo({MAX}) permitido";

mongoose.Error.messages.String.enum = "'{VALUE}' não é um valor válido para o campo '{PATH}'";
mongoose.Error.messages.String.match = "'{VALUE}' não é um valor válido para o campo '{PATH}'";
mongoose.Error.messages.String.minlength = "O tamanho da palavra '{VALUE}' inserida no campo '{PATH}' é menor que o mínimo({MINLENGTH}) permitido";
mongoose.Error.messages.String.maxlength = "O tamanho da palavra '{VALUE}' inserida no campo '{PATH}' é maior que o máximo({MAXLENGTH}) permitido";

require('./mapping');