const express = require('express');
const https = require('https');
const websocket = require('../websocket/server');
const app = express();
const fs = require("fs");
const url = require('url');
const server = https.createServer({
    cert: fs.readFileSync('./ssl/fullchain.pem'),
    key: fs.readFileSync('./ssl/privkey.pem')
}, app).listen(1234);
const chinaTime = require('china-time');
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
app.set('views', './views');
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
    logger.error(`<${chinaTime('YYYY-MM-DD HH:mm:ss')}> err:[${err}]`);
});