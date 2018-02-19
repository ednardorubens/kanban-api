const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const logger = require('winston');
const express = require('express');
const passport = require('passport');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./app_server/models/db');
const cookieParser = require('cookie-parser');
const cors = require('./app_server/filters/cors');
const RedisStore = require('connect-redis')(session);
const loggerConf = require('./app_server/config/logger');
const passportConf = require('./app_server/config/passport');
const sessionOptions = require('./app_server/config/session');

db.connect();

const app = express();

app.use(cors);

// Security
app.use(helmet());

// Session Security
app.set('trust proxy', 1);
app.use(passport.initialize());
app.use(session(sessionOptions()));
app.use(morgan('[:method] :url :status :res[content-length] :response-time ms [:date :remote-user :remote-addr]'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', require('./app_server/config/routes'));

module.exports = app;