const Translate = require('@google-cloud/translate');
const projectId = 'chatsy-184715';
const translate = new Translate({
  projectId: projectId,
});

module.exports = {
  list(req, res){
    return translate
    .getLanguages()
    .then(results => {
      const supportedLanguages = results[0];
      res.json({
        supportedLanguages
      });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  }
}
