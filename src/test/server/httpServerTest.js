describe('httpServer', function() {
    var httpServer;
    var app;
    var express;
    var http;
    var compression;
    var morgan;
    var chatServer;
    var socketIo;
    var server;
    var clock;
    beforeEach(function() {
        app = {};
        app.use = sinon.stub();
        app.set = sinon.stub();

        express = sinon.stub().returns(app);
        express.static = sinon.stub().returns('static');

        compression = sinon.stub().returns('compression');
        morgan = sinon.stub().returns('morgan');

        server = {};
        server.close = sinon.stub();

        http = {};
        http.Server = sinon.stub().returns(http);
        http.listen = sinon.stub().returns(server);

        chatServer = sinon.stub();
        socketIo = sinon.stub().returns('socket.io');

        clock = sinon.useFakeTimers();

        httpServer = proxyquire('../../main/server/httpServer', {
            'express': express,
            'path': require('path'),
            'compression': compression,
            'http': http,
            './chatServer': chatServer,
            'socket.io': socketIo,
            'morgan': morgan
        });

        httpServer(1234);
    });

    it('should serve static site', function() {
        express.static.should.have.been.called;
        express.static.getCall(0).args[0].should.contain('chat/build');
        app.use.should.have.been.calledWith('static');
        app.use.should.have.been.calledWith('compression');
        app.use.should.have.been.calledWith('morgan');
        http.listen.should.have.been.calledWith(1234);
    });

    it('should hook to socket.io', function() {
        socketIo.should.have.been.calledWith(http);
        chatServer.should.have.been.calledWith('socket.io');
    });

    it('should handle http 404', function() {
        var req = {};
        var res = {};
        res.writeHead = sinon.stub();
        res.end = sinon.stub();

        app.use.getCalls().pop().args[0](req, res);
        res.writeHead.should.have.been.calledWith(404);
        res.end.should.have.been.called;
    });

});