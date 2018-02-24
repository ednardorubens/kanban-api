const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.Types.ObjectId;

const patternValidator = (pattern, value, message) => {
  return {
    validator: (value) => pattern.test(value),
    message: message
  }
};

const usuarioSchema = new Schema({
  matricula: {type: String, unique: true, required: true, trim: true, minlength: 7,
    validate: patternValidator(/[C|D|F]{1}[0-9]{6}/, this, '{VALUE} não é um número de matricula válido!')
  },
  nome: {type: String, required: true, trim: true, maxlength: 200},
  email: {type: String, unique: true, trim: true, required: true, maxlength: 250},
  senha: {type: String, required: true},
  configuracoes: new Schema({
    foto: {type: String},
    fonte: {type: String, trim: true, maxlength: 200},
    cor_fundo: {type: String, maxlength: 7,
      validate: patternValidator(/#[0-9A-F]{3,6}/, this, '{VALUE} não é uma cor válida!')
    },
    freq_notificacoes: {type: String, required: true, trim: true, maxlength: 20},
    sessoes: [new Schema({
      ip: {type: String, minlength: 15, maxlength: 15,
        validate: patternValidator(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/, this, '{VALUE} não é um número ip válido!')
      },
      dt_criacao: {type: Date, default: Date.now},
      token: {type: String, required: true, trim: true, maxlength: 100},
    }, {
      id: false, _id: false, versionKey: false
    })]
  }, {
    id: false, _id: false, versionKey: false
  })  
}, {
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
usuarioSchema.pre('save', function(next) {
  const usuario = this;
  bcrypt.hash(usuario.senha, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    usuario.senha = hash;
    next();
  });
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
const msgErro = (mensagem, status) => {
  return {
    mensagem: mensagem,
    status: status
  }
}

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

const comentarioSchema = new Schema({
  data: {type: Date, default: Date.now, required: true},
  usuario: {type: ObjectId, ref: 'Usuario', required: true},
  comentario: {type: String, required: true, trim: true, maxlength: 500}
}, {
  id: false, _id: false, versionKey: false
});

const tarefaSchema = new Schema({
  nome: {type: String, required: true, trim: true, maxlength: 200},
  descricao: {type: String, required: true, trim: true, maxlength: 500},
  dt_criacao: {type: Date, default: Date.now},
  comentarios: [comentarioSchema],
  executor: {type: ObjectId, ref: 'Usuario'},
  cor_cartao: {type: String, maxlength: 7,
    validate: patternValidator(/#[0-9A-F]{3,6}/, this, '{VALUE} não é uma cor válida!')
  },
  rtc_task_id: {type: String, required: true, trim: true},
  duracao_prevista: {type: Number, required: true, min: 1},
  dt_conclusao: {type: Date}
}, {
  id: false, _id: false, versionKey: false
});
const Tarefa = mongoose.model('Tarefa', tarefaSchema);

const sprintSchema = new Schema({
  dt_criacao: {type: Date, default: Date.now},
  duracao: {type: Number, required: true},
  nome: {type: String, required: true, trim: true, maxlength: 200},
  comentarios: [comentarioSchema],
  colunas: [new Schema({
    nome: {type: String, required: true, trim: true, maxlength: 30},
    tarefas: [tarefaSchema]
  })]
}, {
  id: false, _id: false, versionKey: false
});
const Sprint = mongoose.model('Sprint', sprintSchema);

const projetoSchema = new Schema({
  nome: {type: String, required: true, trim: true, maxlength: 200},
  dt_criacao: {type: Date, default: Date.now},
  comentarios: [comentarioSchema],
  responsavel: {type: ObjectId, ref: 'Usuario'},
  time: [{type: ObjectId, ref: 'Usuario'}],
  backlog: [tarefaSchema],
  sprints: [sprintSchema]
});
const Projeto = mongoose.model('Projeto', projetoSchema);

const atividadeSchema = new Schema({
  operacao: {type: String, required: true, trim: true, maxlength: 200},
  dt_operacao: {type: Date, default: Date.now},
  usuario: {type: ObjectId, ref: 'Usuario'},
  artefatos: new Schema({
    id: {type: ObjectId, required: true},
    tipo: {type: String, required: true, trim: true, validate: {
      validator: () => (['projeto', 'sprint', 'tarefa'].indexOf(this) === -1),
      message: 'Os valores válidos são projeto, sprint ou tarefa.'
    }},
  }, {
    id: false, _id: false, versionKey: false
  }),
}, {
  id: false, _id: false, versionKey: false
})
const Atividade = mongoose.model('Atividade', atividadeSchema);