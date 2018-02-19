module.exports = (req, res, next) => {
  if (req.headers['origin']) {
    if (req.headers['access-control-allow-headers']) {
      if (req.headers['x-requested-with'] && req.headers['x-requested-with'] === 'XMLHttpRequest') {
        res.removeHeader('x-powered-by');
        res.sendStatus(403);
        return;
      }
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    }
    res.header('Access-Control-Allow-Origin', req.headers['origin']);
    res.header('Access-Control-Allow-Credentials', true);
    if (req.headers['access-control-request-method']) {
      res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
    }
  }
  next();
};