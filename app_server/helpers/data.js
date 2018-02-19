module.exports.formatar = (data, formato = {
  de: /(\d{2})\/(\d{2})\/(\d{4})/, 
  para: '$2/$1/$3'
}) => {
  if (data) {
    let dataRec = '' + data; //cast string
    dataRec = dataRec.replace(formato.de, formato.para);
    return new Date(dataRec);
  }
  return null;
}