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

    client.on('chatMsgServer', (msg)=>{
      console.log("msg received: ", msg)

      languagesToTransmit.forEach((lang)=>{
        translateFn(translate,msg.content,lang).then(results => {
          const translation = results[0];
          const translatedMsg = Object.assign({},msg,{
            content: `${translation}`,
            timestamp: Date.now()
          })
          client.broadcast.emit(`chatMsg-${lang}`, translatedMsg);
        })

      })
    })

    client.on('setLanguage',(language)=>{
      if (!languagesToTransmit.includes(language.code)){
        languagesToTransmit.push(language.code)
      }

      let setLangMessage = `Now receiving messages in ${language.name}`
      let timeNow = Date.now()
      console.log(setLangMessage)

      translateFn(translate,setLangMessage,language.code).then(results => {
        const translation = results[0];
        const translatedMsg = {
          sender: "SYSTEM",
          content: `${translation}`,
          timestamp: timeNow}
        client.emit('system', translatedMsg);
      })

      client.language= language.code;
    })

    client.on('disconnect', ()=>console.log('client disconnected'))
  });

}
