var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var rtcLogin = require('./rtc/rtcLoginManager.js');
var banco = require('./db/');
var fs = require('fs');
var busboy = require('connect-busboy');
var json2xls = require('json2xls');

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

app.use('/imagens', express.static(path.resolve(__dirname + '/imagens/')));

app.use(json2xls.middleware);

app.get('/download', function (req, res) {
    var json = [{
        tarefas: 'Tarefa Teste',
        comentario: ' metamorphosis samuraiYou got a little lord fish and I dont know why I got aMetamorphosis samuraiIm a lonely ladIve lost myself out on the rangeI',
        solicitador: 'Torugo',
        prazo: '40 dias',
        dataconclusao: new Date(),
        projeto: 'Custo de Vida'
    },
        {
            tarefas: 'Tarefa Teste2',
            comentario: 'Fort Ticonderoga, formerly Fort Carillon, is a large 18th-century star fort built by the French at a narrows near the south end of Lake Champlain in northern New York in the United States.',
            solicitador: 'Otavio',
            prazo: '60 dias',
            dataconclusao: new Date(),
            projeto: 'Beer Game'
        }];

    res.xls('data.xlsx', json);
});