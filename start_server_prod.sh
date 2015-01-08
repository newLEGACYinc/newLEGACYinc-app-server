#!/bin/sh
NODE_ENV=production forever start -l ~/out.log -c nodemon app.js