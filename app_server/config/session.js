const logger = require('winston');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

module.exports = () => {
  const sessionOptions = {
    resave: false,
    name: 'sessionId',
    secret: '5up37_s3Cur3',
    saveUninitialized: false,
    cookie: {
      path: 'kanban/api',
      maxAge: 60 * 60 * 1000,
      // domain: 'localhost',
    },
  }
  
  if (process.env.NODE_ENV === 'production') {
    logger.info('Configurando o redis para armazenar sessões');
    sessionOptions.store = new RedisStore({
      logErrors: true,
      url: process.env.REDIS_URL,
      pass: process.env.REDIS_PASS,
    });
  }

  return session(sessionOptions);
}