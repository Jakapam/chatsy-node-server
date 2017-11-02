const Translate = require('@google-cloud/translate');
const projectId = 'chatsy-184715';
const translate = new Translate({
  projectId: projectId,
});

module.exports=function(router){
  router.get('/all', function(req, res) {

    translate
      .getLanguages()
      .then(results => {
        var supportedLanguages = results[0];
        res.json({
            supportedLanguages
          });
      })
      .catch(err => {
        console.error('ERROR:', err);
      });

    });
  return router;
}
