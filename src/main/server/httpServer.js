var express = require('express');
var app = express();
var http = require('http').Server(app);
var compression = require('compression');
var path = require('path');
var io = require('socket.io')(http);
var chatServer = require('./chatServer');

module.exports = function(port, callback) {
    //start socket.io chat server
    chatServer(io);

    //logging
    app.use(require('morgan')('dev'));

    //content
    app.use(compression());
    app.use(express.static(path.join(__dirname, '../../../build')));

    // catch 404's
    app.use(function(req, res) {
        res.writeHead(404);
        res.end('404: Not found');
    });

    //start the server
    return http.listen(port, callback);
};