const express = require('express')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = []
var rooms = []

io.on('connection', (client)=>{
  console.log('client connected')

  client.on('send-username', (username)=>{
    client.username = username;
    users.push(username);
  })

  client.on('requestRoomList', ()=>{
    client.emit('roomList', rooms)
    console.log("Room list sent: " + rooms)
  })


  client.on('room',(room) => {
      client.join(room);
      if (rooms.includes(room)){
        console.log(`${client.username} has joined ${room}`)
      }else{
        rooms.push(room);
        io.emit('roomList', rooms);
        console.log(`${client.username} has created ${room}`);
      }
   });

  client.on('chat message', (msgObj)=> {
    io.to(msgObj.room).emit(`message${msgObj.room}`, `${client.username}: ${msgObj.msg}`);
    })

  client.on('disconnect', ()=>console.log('client disconnected'))
});

http.listen(3000, ()=>{
  console.log('listening on port:3000');
});
