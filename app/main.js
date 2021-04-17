const express = require('express');
const http = require('http');
const websocket = require('../websocket/server');
const app = express();
const server = http.createServer(app).listen(1234);
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