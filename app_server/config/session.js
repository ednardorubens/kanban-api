module.exports = () => {
  const sessionOptions = {
    resave: false,
    name: 'sessionId',
    secret: '5up37_s3Cur3',
    saveUninitialized: false,
    cookie: {
      path: 'estoque/api',
      maxAge: 60 * 60 * 1000,
      // domain: 'localhost',
    }
  }
  return sessionOptions;
}