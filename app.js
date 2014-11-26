// LIBRARY IMPORTS
var express = require('express');
var app = express();
var fs = require('fs');
var https = require('https');
var bodyParser = require('body-parser');

// MODULE IMPORTS
var secrets = require('./secrets.js');
var db = require('./db')(secrets.db);
var routes = require('./routes')();
var jobs = require('./jobs')();
var sender = require('./send')(secrets, db);
var middleware = require('./middleware')(secrets);

// EXPRESS CONFIG
app.use(bodyParser.json());
app.use(middleware.basicAuth);

// EXPRESS ROUTING
app.put('/gcm/register', routes.gcm.register(db));
app.put('/gcm/settings', routes.gcm.settings(db));
app.post('/message', routes.sendMessage(sender));

// SERVER INIT
var config = {
    key: fs.readFileSync(secrets.ssl.key),
    cert: fs.readFileSync(secrets.ssl.certificate),
    passphrase: secrets.ssl.pass
}

var server = https.createServer(config,app).listen(443, function (){
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening on ' + host + ':' + port);
});