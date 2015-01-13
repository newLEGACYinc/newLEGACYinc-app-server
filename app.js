// LIBRARY IMPORTS
var express = require('express');
var app = express();
var fs = require('fs');
var https = require('https');
var bodyParser = require('body-parser');
var moment = require('moment');

// MODULE IMPORTS
var db = require('./db')();
var routes = require('./routes');
var sender = require('./send')(db);
var jobs = require('./jobs')(sender);

// EXPRESS CONFIG
app.use(bodyParser.json());

// EXPRESS ROUTING
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

// start server
var server = https.createServer(config,app).listen(443, function (){
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening on ' + host + ':' + port);
});