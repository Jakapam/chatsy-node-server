const express = require('express')
const sockApp = require('express')();
const dataApp = require('express')();
const http = require('http').Server(sockApp);
const io = require('socket.io')(http);
const router = express.Router();
const bodyParser = require('body-parser');
const config = require('./config.js');
const Translate = require('@google-cloud/translate');
const projectId = 'chatsy-184715';
const translate = new Translate({
  projectId: projectId,
});
const translateFn = require('./translate')

var languagesToTransmit = ["en"]



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
        const translatedMsg = Object.assign({},msg,{content: `${translation}`})
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

dataApp.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
dataApp.use(bodyParser.json());
dataApp.use('/languages', require('./controllers/languages.js')(router));
dataApp.use('/api', require('./middleware/auth.js'));

console.log(translate)
dataApp.use('/', require('./controllers/users.js')(router, translate));

http.listen(3001, ()=>{
  console.log('listening for WebSockets port:3001');
});

dataApp.listen(8080, ()=>{
  console.log('listening for data requests port:8080');
});
