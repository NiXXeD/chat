describe('chatServer', function() {
    var chatServer;
    var io;
    var socket;
    var chatHistory;
    beforeEach(function() {
        chatHistory = [];
        chatServer = proxyquire('../../main/server/chatServer', {
            './chatHistory' : chatHistory
        });

        io = {};
        io.on = sinon.stub();
        io.emit = sinon.stub();

        socket = {};
        socket.on = sinon.stub();
        socket.emit = sinon.stub();

        io.on.withArgs('connection').callsArgWith(1, socket);

        sinon.useFakeTimers(0).tick(1234);
    });

    it('should handle connections', function() {
        chatHistory.push(1);
        chatHistory.push(2);
        chatHistory.push(3);

        chatServer(io);

        io.on.should.have.been.calledWith('connection');
        socket.on.should.have.been.called;
        socket.emit.should.have.been.calledWith('chat', 1);
        socket.emit.should.have.been.calledWith('chat', 2);
        socket.emit.should.have.been.calledWith('chat', 3);
    });

    describe('once connected', function() {
        beforeEach(function() {
            chatServer(io);
        });

        it('should handle chat events', function() {
            var expected = {
                text: 'test msg',
                from: 'Anonymous',
                date: 1234
            };
            socket.on.withArgs('chat').getCall(0).callArgWith(1, expected.text);

            io.emit.should.have.been.calledWith('chat');
            io.emit.getCall(0).args[1].should.deep.equal(expected);

            chatHistory.length.should.equal(1);
            chatHistory.should.contain(expected);
        });

        it('should handle join events', function() {
            socket.on.withArgs('join').getCall(0).callArgWith(1, 'someguy');
            io.emit.should.have.been.calledWith('chat');
            io.emit.getCall(0).args[1].should.have.property('text');
            io.emit.getCall(0).args[1].text.should.contain('someguy has joined');
        });

        it('should allow changing nickname', function() {
            socket.on.withArgs('changenick').getCall(0).callArgWith(1, 'newnick');

            io.emit.should.have.been.calledWith('chat');
        });

        it('should handle disconnects', function() {
            socket.on.withArgs('disconnect').getCall(0).callArg(1);

            io.emit.should.have.been.calledWith('chat');
        });

        describe('with multiple users', function() {
            var socket2 = {};
            var socket3 = {};
            beforeEach(function() {
                socket.on.withArgs('changenick').getCall(0).callArgWith(1, 'myself');
                socket.emit.reset();

                socket2.on = sinon.stub();
                socket2.emit = sinon.stub();
                io.on.withArgs('connection').getCall(0).callArgWith(1, socket2);
                socket2.on.withArgs('changenick').getCall(0).callArgWith(1, 'User2');
                socket2.emit.reset();

                socket3.on = sinon.stub();
                socket3.emit = sinon.stub();
                io.on.withArgs('connection').getCall(0).callArgWith(1, socket3);
                socket3.on.withArgs('changenick').getCall(0).callArgWith(1, 'User3');
                socket3.emit.reset();
            });

            it('should support listing users', function() {
                socket.on.withArgs('users').getCall(0).callArg(1);

                socket.emit.should.have.been.calledWith('chat');
                socket.emit.getCall(0).args[1].should.have.property('text');
                socket.emit.getCall(0).args[1].text.should.contain('myself');
                socket.emit.getCall(0).args[1].text.should.contain('User2');
                socket.emit.getCall(0).args[1].text.should.contain('User3');
            });

            it('should support private messages', function() {
                var msg = {
                    to: 'user2',
                    text: 'secret message'
                };
                var expected = {
                    from: 'myself',
                    to: 'user2',
                    text: 'secret message',
                    date: 1234
                };
                socket.on.withArgs('private').getCall(0).callArgWith(1, msg);
                socket.emit.should.have.been.calledWith('chat');
                socket.emit.getCall(0).args[1].should.deep.equal(expected);

                socket2.emit.should.have.been.calledWith('chat');
                socket2.emit.getCall(0).args[1].should.deep.equal(expected);

                socket3.emit.should.not.have.been.called;
            });

            it('should handle invalid users in private messages', function() {
                var msg = {
                    to: 'invalidUser',
                    text: 'secret message'
                };
                socket.on.withArgs('private').getCall(0).callArgWith(1, msg);
                socket.emit.should.have.been.calledWith('chat');
                socket.emit.getCall(0).args[1].should.have.property('text');
                socket.emit.getCall(0).args[1].text.should.contain('invalidUser');

                socket2.emit.should.not.have.been.called;
                socket3.emit.should.not.have.been.called;
            });
        });
    });
});