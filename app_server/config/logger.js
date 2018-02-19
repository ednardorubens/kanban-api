const fs = require('fs');
const winston = require('winston');

const logDir = 'logs';
const env = process.env.NODE_ENV || 'development';
if (!fs.existsSync(logDir)){
  fs.mkdirSync(logDir);
}

let exceptionHandlers = [new winston.transports.Console()]
if (env === 'production') {
  exceptionHandlers = [new winston.transports.File({
    maxFiles: 10,
    colorize: false,
    timestamp: false,
    maxsize: 1048576,
    filename: 'logs/exceptions.log',
  })];
}

winston.configure({
  transports: [
    new winston.transports.Console({
      colorize: true,
      level: env === 'development' ? 'debug' : 'info'
    }),
    new winston.transports.File({
      maxFiles: 10,
      level: 'error',
      colorize: false,
      maxsize: 1048576,
      filename: 'logs/errors.log',
    }),
  ],
  exceptionHandlers: exceptionHandlers
});