const Translate = require('@google-cloud/translate');
const projectId = 'chatsy-184715';
const translate = new Translate({
  projectId: projectId,
});
const translateFn = require('./translate')
const languagesToTransmit = ["en"]

module.exports = (io) =>{

  io.on('connection', (client)=>{
    console.log('client connected')

    client.on('getLanguages', ()=>{
      client.emit(supportedLanguages)
    })

    client.on('chatMsgServer', (msg)=>{
      console.log("msg received: ", msg)

      languagesToTransmit.forEach((lang)=>{
        translateFn(translate,msg.content,lang).then(results => {
          const translation = results[0];
          const translatedMsg = Object.assign({},msg,{content: `${translation}`, timestamp: Date.now()})
          client.broadcast.emit(`chatMsg-${lang}`, translatedMsg);
        })

      })
    })

    client.on('setLanguage',(language)=>{
      if (!languagesToTransmit.includes(language)){
        languagesToTransmit.push(language)
      }
      client.language= language;
    })

    client.on('disconnect', ()=>console.log('client disconnected'))
  });

}
