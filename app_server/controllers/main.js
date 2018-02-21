module.exports.index = (req, res) => {
  res.status(200).json({
    titulo: 'KANBAN',
    texto: 'Bemvindo à API do KANBAN',
  });
}