module.exports.index = (req, res) => {
  res.status(200).json({
    titulo: 'Controle de Estoque',
    texto: 'Bemvindo à API de Controle de Estoque',
  });
}