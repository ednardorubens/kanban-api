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

require('./validation_msgs');

require('./mapping');