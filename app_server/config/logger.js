const winston = require('winston');

const env = process.env.NODE_ENV || 'development';

winston.configure({
  transports: [
    new winston.transports.Console({
      colorize: true,
      level: env === 'development' ? 'debug' : 'info'
    }),
  ],
  exceptionHandlers: [new winston.transports.Console()]
});