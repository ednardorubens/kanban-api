const mongoose = require('mongoose'), Schema = mongoose.Schema;

const usuarioSchema = new mongoose.Schema({
  matricula: {type: String, unique: true, required: true, trim: true, minlength: 7, pattern: '[C|D|F]{1}[0-9]{6}'},
  nome: {type: String, required: true, trim: true, maxlength: 200},
  email: {type: String, unique: true, trim: true, required: true, maxlength: 200},
  configuracoes: {
    foto: {type: String},
    fonte: {type: String, trim: true, maxlength: 200},
    cor_fundo: {type: String, maxlength: 7, pattern: '#[0-9A-F]{6}'}
  },
  projetos: [new Schema({
    nome: {type: String, required: true, trim: true, maxlength: 200},
    dt_criacao: {type: Date, default: Date.now},
    time: [{type: Schema.Types.ObjectId, ref: 'Usuario'}],
    sprints: {required: true, type: [new Schema({
      dt_criacao: {type: Date, default: Date.now},
      duracao: {type: Number, required: true},
      colunas: {required: true, type: [new Schema({
        nome: {type: String, required: true, trim: true, maxlength: 20},
        tarefas: [new Schema({
          tarefa: {type: Schema.Types.ObjectId, ref: 'Tarefa'},
          responsavel: {
            matricula: {type: String, required: true, trim: true, minlength: 7, pattern: '[C|D|F]{1}[0-9]{6}'},
            rtc_task_id: {type: String, required: true, trim: true}
          },
          duracao_prevista: {type: Number, required: true, min: 1},
          dt_conclusao: {type: Date}
        }, {
          id: false,
          _id: false,
          versionKey: false
        })]
      }, {
        id: false,
        _id: false,
        versionKey: false
      })]}
    }, {
      id: false,
      _id: false,
      versionKey: false
    })]}
  }, {
    id: false,
    _id: false,
    versionKey: false
  })]
}, {
  id: false,
  _id: false,
  versionKey: false
});

usuarioSchema.method({
  gerarJwt: function() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    const jwt = require('jsonwebtoken');
    return jwt.sign({
      _id: this._id,
      email: this.email,
      name: this.name,
      exp: parseInt(expiry.getTime() / 1000),
    }, process.env.JWT_SECRET);
  }
});

const bcrypt = require('bcrypt');

const msgErro = (mensagem, status) => {
  return {
    mensagem: mensagem,
    status: status
  }
}

const Usuario = mongoose.model('Usuario', usuarioSchema);

usuarioSchema.static({
  autenticar: (email, senha, callback) =>
    Usuario.findOne({email: email}).exec((erro, usuario) => {
      if (erro) {
        return callback(msgErro(erro, 404));
      } else if (!usuario) {
        return callback(msgErro('Usuário não encontrado.', 401));
      }
      bcrypt.compare(senha, usuario.senha, (erroSenha, encontrado) => {
        if (encontrado === true) {
          return callback(null, usuario);
        } else {
          return callback(msgErro('Usuário ou senha inválida.', 401));
        }
      })
    })
});