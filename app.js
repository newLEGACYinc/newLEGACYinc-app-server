/**
 * IMPORTS
 */
var gcm = require('node-gcm');
var secrets = require('./secrets.js');

function main(){
    var message = new gcm.Message();
    var sender = new gcm.Sender(secrets.gcm.apikey);
    var registrationIds = [];

    // Value the payload data to send
    message.addData('message', 'test');
    message.addData('title', 'Push Notification Test');
    message.addData('msgcnt', '2');
    message.collapseKey = 'demo';
    message.delayWhileIdle = true;
    message.timeToLive = 30 * 60; // 30 minutes

    // At least one reg id require

}

main();