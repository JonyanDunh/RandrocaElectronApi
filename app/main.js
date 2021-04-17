const express = require('express');
const https = require('https');
const websocket = require('../websocket/server');
const randroca = require('./randroca/server');
const app = express();
const router = express.Router();
const fs = require("fs");
const url = require('url');
var path = require("path");
const {
    createProxyMiddleware
} = require('http-proxy-middleware');
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
//app.use(express.static(path.join(__dirname, '../resources')));
server.on('upgrade', function upgrade(request, socket, head) {
    switch (request.url.toLowerCase()) {
        case "/websocket":
            websocket.upgrade(request, socket, head)
            break;
        default:
            socket.destroy();
    }
});
app.get('/randroca/:action/:class', function(request, response, next) {
    randroca.action(request.params, function(result) {
        response.json(result);
    });

});
app.use('/', function(request, response, next) {
    response.render('index');
});
app.use(function(request, response, next) {
    response.send('404 not found', 404);
})
process.on('uncaughtException', function(err) {
    logger.error(`<${chinaTime('YYYY-MM-DD HH:mm:ss')}> err:[${err}]`);
});