const passport = require('passport');
const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const LocalStrategy = require('passport-local').Strategy;

passport.use('local', new LocalStrategy(
  { usernameField: 'email', passwordField : 'senha' },
  (email, senha, callback) => Usuario.schema.statics.autenticar(email, senha, callback)
));