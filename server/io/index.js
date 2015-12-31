'use strict';
var socketio = require('socket.io');
var io = null;

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    var somerep = [];

    io.on('connection', function (socket) {
        // Now have access to socket, wowzers!

        console.log('A new client has connected! server replies in progress notsent: ', somerep);
        console.log(socket.id);

        socket.on('init', function (event) {
            // console.log('SERVER received init event from ' +event.user+ ' sent: ', somerep)
            socket.emit('init', {somerep: somerep})
        })

        socket.on('newPost', function(event){
        	// console.log('SERVER a new post has been made')
            // console.log('SERVER received newpost event from client notsent: ', somerep)
        	socket.broadcast.emit('newPost');
        })

        socket.on('vote', function(event){
            // console.log('SERVER received vote event from client notsent: ', somerep)
            socket.broadcast.emit('vote', event)
        })

        socket.on('someoneReplying', function(event){
            // console.log('SERVER received somerep event from client: event: ', event)
            // console.log('SERVER some rep before change on server notsent: ', somerep)

            if (event.prevcId) {
                var cid = somerep.indexOf(event.prevcId + "" + event.username);
                if (cid !== -1) somerep.splice(cid, 1);
            }
            var eid = somerep.indexOf(event.childId + "" + event.username)
            if (eid !== -1) somerep.splice(eid, 1);
            else somerep.push(event.childId + "" + event.username)

            // console.log('SERVER some rep after change on server sent: ', somerep)
        
            socket.broadcast.emit('someoneReplying', {somerep: somerep})
        })

        socket.on('pm', function(){
            socket.broadcast.emit('pm');
            socket.emit('pm');
        })


    });
    
    return io;

};
