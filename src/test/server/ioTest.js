var io = require('../../main/server/io');

describe('io', function() {
    var socketIo = {};
    var socket = {};
    var chatHistory;
    beforeEach(function() {
        socketIo.on = sinon.stub();
        socketIo.emit = sinon.stub();
        socket.on = sinon.stub();
        socket.emit = sinon.stub();

        socketIo.on.withArgs('connection').callsArgWith(1, socket);

        chatHistory = [];

        io(socketIo, chatHistory);
    });

    it('should handle connections', function() {
        socketIo.on.should.have.been.calledWith('connection');
        socket.on.should.have.been.called;
    });

    it('should handle chat events', function() {
        socket.on.withArgs('chat').getCall(0).callArgWith(1, 'test');
        socketIo.emit.should.have.been.calledWith('chat');
        socketIo.emit.getCall(0).args[1].should.have.property('text', 'test');
        socketIo.emit.getCall(0).args[1].should.have.property('from', 'Anonymous');
        socketIo.emit.getCall(0).args[1].should.have.property('date');
        socketIo.emit.getCall(0).args[1].date.should.be.a('number');
    });

    it('should handle join events', function() {
        socket.on.withArgs('join').getCall(0).callArgWith(1, 'someguy');
        socketIo.emit.should.have.been.calledWith('chat');
        socketIo.emit.getCall(0).args[1].should.have.property('text');
        socketIo.emit.getCall(0).args[1].text.should.contain('someguy has joined');
    });

});