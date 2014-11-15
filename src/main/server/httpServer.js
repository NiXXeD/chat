var express = require('express');
var app = express();
var http = require('http').Server(app);
var compression = require('compression');
var path = require('path');
var io = require('socket.io')(http);

//socket.io stuff
require('./chatServer')(io);

//logging
app.use(require('morgan')('dev'));

//content
app.use(compression());
app.use(express.static(path.join(__dirname, '../../../build')));

// catch 404 and forward to error handler
app.use(function(req, res) {
    res.writeHead(404);
    res.end('404: Not found');
});

//start the server
var port = process.env.PORT || 3000;
app.set('port', port);
var server = http.listen(port, function() {
    console.log('Express server listening on port ' + port);
});

//stop the server gracefully on kill signal
process.on('SIGTERM', function() {
    server.close(function() {
        console.log('Received kill signal, shutting down gracefully...');
        //close out any db/etc stuff here
        process.exit(1);
    });

    setTimeout(function() {
        console.error('Could not shut down gracefully in time, forcefully shutting down...');
        process.exit(1);
    }, 30 * 1000);

});

module.exports = app;