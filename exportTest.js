const Translate = require('@google-cloud/translate');
const projectId = 'chatsy-184715';
const translate = new Translate({
  projectId: projectId,
});
const translateFn = require('./translate')

translateFn(translate,"Hello","ja").then(results => {
  const translation = results[0];
  console.log(results[1].data.translations)
  console.log(`Translation: ${translation}`);
})
.catch(err => {
  console.error('ERROR:', err);
});
