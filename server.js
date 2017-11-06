const express = require('express')
const sockApp = require('express')();
const dataApp = require('express')();
const sockAppServer = require('http').Server(sockApp);
const io = require('socket.io')(sockAppServer);
const bodyParser = require('body-parser');
const config = require('./config.js');
const cors = require('cors')

const corsOptions = {
  origin: 'http://localhost:3000'
}

dataApp.use(cors(corsOptions))
dataApp.options('/users',cors(corsOptions))

dataApp.use(bodyParser.json());
dataApp.use(bodyParser.urlencoded({ extended: true }));

require('./routes')(dataApp);
require('./socket')(io);

sockAppServer.listen(3001, ()=>{
  console.log('listening for WebSockets port:3001');
});

dataApp.listen(8080, ()=>{
  console.log('listening for data requests port:8080');
});
