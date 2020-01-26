'use strict';

/* File: server.js
 * Authors: Nick McCormick, Joshua McBrayer, Caitlyn McClain
 * Date: September 30, 2017
 * Purpose: Back-end code of Team Seven's chat application.
 */




var express = require('express');
var app = express();
var http = require('http').Server(app); 
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var nicknames = [];


// sets the default working directory to public. I do this so the html css links work properly.
app.use(express.static('public'));


/* Old Server testing code. I was trying to set the directory path so the CSS files would load into the HTML docs. */

//var path = require('path'); 
//app.use(express.static(path.join(__dirname, 'public'))); 

/* I was experimenting with trying to get the app to send a certain file to the client as it's starting page. 
 * Right now the app will always send the index.html page.
 */

//app.get('/', function (req, res) {
//    res.sendFile(__dirname + '/public/username.html');
//});

/*
app.get('/', function (req, res) {
    res.render('username');
}); */


// This code block detects when a client connects/disconnects and emits an event to all connected clients.
io.on('connection', function (socket) {
    console.log('a user connected');
    io.emit('conn', "Client Connected");

    socket.on('disconnect', function (data) {
        io.emit('dis', 'Client Disconnected');
        console.log('user disconnected');
        if (!socket.nickname) return;
        nicknames.splice(nicknames.indexOf(socket.nicknames), 1);
        io.emit('nicknames', nicknames);
    });


    socket.on('chat message', function (data) {
        io.emit('chat message', { msg: data, nick: socket.nickname });
        console.log('Message: ' + data);
    }); 

    socket.on('new user', function (data, callback) {
        if (nicknames.indexOf(data) != -1) {
            callback(false);
        } else {
            callback(true);
            socket.nickname = data;
            nicknames.push(socket.nickname);
            io.emit('nicknames', nicknames);
        }
    });
});

// This code block detects when a message is sent from one of the connected clients and emits it to all clients, 
// including the client that sent the message.
/*
io.on('connection', function (socket) {
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
        console.log('Message: ' + msg);
    });

    socket.on('new user', function (data, callback) {
        if (nicknames.indexOf(data) != -1) {
            callback(false);
        } else {
            callback(true);
            socket.nickname = data;
            nicknames.push(socket.nickname);
            io.emit('nicknames', nicknames);
        }
    });
}); 
*/

// This code block tells socket.io what port to listen on.
http.listen(port, function () {
    console.log('listening on: ' + port);
});

// Utility functions
function updateNicknames() {
    io.emit('nicknames', nicknames);
}

