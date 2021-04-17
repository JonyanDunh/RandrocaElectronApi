const express = require('express');
const http = require('http');
const websocket = require('../websocket/server');
const app = express();
const server = http.createServer(app).listen(1234);
const chinaTime = require('china-time');
const fs = require("fs");
const {
    Console
} = require('console');
const logger = new Console({
    stdout: fs.createWriteStream('./log.log', {
        flags: 'a'
    }),
    stderr: fs.createWriteStream('./err.log', {
        flags: 'a'
    })
});
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
server.on('upgrade', function upgrade(request, socket, head) {
    switch (request.url.toLowerCase()) {
        case "/websocket":
            websocket.upgrade(request, socket, head)
            break;
        default:
            socket.destroy();
    }
});
app.use('/', function(request, response) {
    response.render('index', {
        name: 'jonyan'
    });
});
process.on('uncaughtException', function(err) {
    logger.log(`<${chinaTime('YYYY-MM-DD HH:mm:ss')}> err:[${err}]`);
});