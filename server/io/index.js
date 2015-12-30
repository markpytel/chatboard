'use strict';
var socketio = require('socket.io');
var io = null;

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    io.on('connection', function (socket) {
        // Now have access to socket, wowzers!
        var somerep = [];

        console.log('A new client has connected! replies in progress ', somerep);
        console.log(socket.id);
        socket.broadcast.emit('message', 'A new socket has connected')
        socket.on('newPost', function(event){
        	console.log('a new post has been made')
        	socket.broadcast.emit('newPost');
        })
        socket.on('someoneReplying', function(event){
            console.log('someone is replying');
            console.log('event ', event);
            socket.broadcast.emit('someoneReplying', event)
        })



    });
    
    return io;

};
