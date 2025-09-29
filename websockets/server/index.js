const express = require('express');
const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http);

app.use(express.static('../app'));

io.on('connection',(socket)=>{
    console.log('Connection Made');
    socket.on('message',(mes)=>{
        io.emit('message',`${socket.id.substr(0,2)} said "${mes}"`)
    })
})

http.listen(9090,()=>console.log("Server is Up and Running"));