// LIBRARY IMPORTS
var express = require('express');
var app = express();
var fs = require('fs');
var http = require('http');
var https = require('https');
var bodyParser = require('body-parser');

// MODULE IMPORTS
var db = require('./db')();
var middleware = require(__dirname + '/middleware');
var routes = require(__dirname + '/routes');
var sender = require(__dirname + '/send')(db);
var jobs = require(__dirname + '/jobs')(sender);

// EXPRESS CONFIG
app.use(middleware.security);
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.json());

// EXPRESS ROUTING
app.get('/', routes.index);
app.use('/data', routes.data);
app.put('/register', routes.register(db));
app.post('/message', routes.sendMessage(sender));
app.put('/settings', routes.settings(db).update);
app.get('/settings', routes.settings(db).get);

// SERVER INIT
var config = {
    key: fs.readFileSync(__dirname + '/' + process.env.SSL_KEY),
    cert: fs.readFileSync(__dirname + '/' + process.env.SSL_CERT),
    passphrase: ''
};

// logging
if (process.env.NODE_ENV !== 'production') {
    require('longjohn');
}

// START SERVERS
// http
var serverHTTP = http.createServer(app).listen(8080, function (){
    var host = serverHTTP.address().address;
    var port = serverHTTP.address().port;

    console.log('Listening on ' + host + ':' + port);
});

// https
var serverHTTPS = https.createServer(config,app).listen(443, function (){
    var host = serverHTTPS.address().address;
    var port = serverHTTPS.address().port;

    console.log('Listening on ' + host + ':' + port);
});