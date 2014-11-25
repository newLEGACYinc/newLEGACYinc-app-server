// LIBRARY IMPORTS
var express = require('express');
var app = express();

// MODULE IMPORTS
var secrets = require('./secrets.js');
var db = require('./db')(secrets.db);
var routes = require('./routes')();
var jobs = require('./jobs')();
var send = require('./send')(secrets, db);

// EXPRESS ROUTING
app.put('/gcm/register', routes.gcmRegister(db));

// SERVER INIT
var server = app.listen(8080, function (){
    var host = server.address().address;
    var port = server.address().port;
});