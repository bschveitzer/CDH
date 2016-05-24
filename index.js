/**
 * Created by Osvaldo Miguel Junior on 22/07/15.
 */
var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var rtcLogin = require('./rtc/rtcLoginManager.js');
var banco = require('./db/');
var fs = require('fs');
var busboy = require('connect-busboy');

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname + '/views'));
app.use(express['static'](path.resolve(__dirname+ '/public')));

app.use(busboy());

io.on('connection',function(socket){
    new rtcLogin({socket: socket});
});

http.listen(80, function(err){
    console.log("Rodando na porta 80", err);
});

app.use('/image', express.static(path.resolve(__dirname + '/image/')));