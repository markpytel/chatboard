'use strict';
var socketio = require('socket.io');
var io = null;

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    var somerep = [];

    io.on('connection', function (socket) {
        // Now have access to socket, wowzers!

        console.log('A new client has connected! replies in progress ', somerep);
        console.log(socket.id);

        // on connection send 
        // setTimeout(function(){
        //     socket.emit('init', {somerep: somerep})
        // },150)

        socket.on('init', function () {
            socket.emit('init', {somerep: somerep})
        })

        // socket.emit('init', {somerep: somerep})

        // socket.broadcast.emit('message', 'A new socket has connected')
        socket.on('newPost', function(event){
        	console.log('a new post has been made')
        	socket.broadcast.emit('newPost');
        })

        socket.on('vote', function(event){
            socket.broadcast.emit('vote', event)
        })


        // socket.on('someoneReplying', function(event){
        //     console.log('someone is replying');
        //     console.log('event ', event);
        //     socket.broadcast.emit('someoneReplying', event)
        // })
        socket.on('someoneReplying', function(event){
            console.log('someone is replying');
            console.log('event ', event);
            if (event.prevcId) {
                var cid = somerep.indexOf(event.prevcId + "" + event.username);
                if (cid !== -1) somerep.splice(cid, 1);
            }
            var eid = somerep.indexOf(event.childId + "" + event.username)
            if (eid !== -1) somerep.splice(eid, 1);
            else somerep.push(event.childId + "" + event.username)

            socket.broadcast.emit('someoneReplying', {somerep: somerep})
        })


    });
    
    return io;

};
