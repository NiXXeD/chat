var httpServer = require('./src/main/server/httpServer');

//start the server
var port = process.env.PORT || 3000;
var server = httpServer(port, function() {
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
    }, 30000);
});