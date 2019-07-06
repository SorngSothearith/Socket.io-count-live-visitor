var path=require('path');
var http=require('http');
var express=require('express');
var socketIO=require('socket.io');
// var {generateMessage} = require('./utils/message');
var port=process.env.PORT || 9000;
//use expression
var app=express();
var server=http.createServer(app);
var io=socketIO(server);
//make advance connection listener

io.on('connection',(socket)=>{
    console.log('New user connected');
    socket.on('join_room',(room_id)=>{
         socket.join(room_id);
        socket.in(room_id).emit('new_join',io.sockets.adapter.rooms[room_id].length);
    });
    socket.on('visitor_count',function (room_id) {
        let emitter='new_join'+room_id;
        socket.emit(emitter,io.sockets.adapter.rooms[room_id].length)
        // io.of('/').to('room_id').emit('new_join', 'message');
        // io.in('room_id').emit('new_join',io.sockets.adapter.rooms[room_id].length)
        //socket.emit('new_join',io.sockets.adapter.rooms[room_id].length)
        // console.log('visitor');
        // socket.in(room_id).emit('new_join',io.sockets.adapter.rooms[room_id].length);
    });
    socket.on('leave_room',(room_id)=>{
        socket.leave(room_id);
        let visitor=0;
        try{
            visitor=io.sockets.adapter.rooms[room_id].length;
        }catch (e) {

        }
        socket.in(room_id).broadcast.emit('new_join',visitor);
    });

    socket.on('disconnect', function (room_id) {
        console.log(room_id);
    });


});

server.listen(port,function(){
    var d = new Date();
    console.log("Your server is alive:"+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds());
    console.log(`server is up on port ${port}`);
});
