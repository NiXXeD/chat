describe('Unit: nickService', function(){
    beforeEach(module('chat'));

    var defaultUserRegex = /^User[0-9]{1,5}$/;
    var nickService;
    var localStorageService;
    var socket;
    beforeEach(inject(function($injector) {
        socket = $injector.get('socket');

        localStorageService = $injector.get('localStorageService');
        localStorageService.get = sinon.stub();
        localStorageService.set = sinon.stub();

        socket.on = sinon.stub();
        socket.emit = sinon.stub();

        nickService = $injector.get('nickService');
    }));

    it('should use default user when localStorage is empty', function() {
        localStorageService.get.withArgs('nickname').returns(null);
        socket.on.withArgs('connect').callArg(1);

        var actual = nickService.getNickname();

        assert(defaultUserRegex.test(actual), 'Incorrect nickname: ' + actual);
        localStorageService.set.should.have.been.calledWith('nickname', actual);
        socket.emit.should.have.been.calledWith('join', actual);
    });

    it('should use default user when localStorage when invalid', function() {
        localStorageService.get.withArgs('nickname').returns('!@#$$%');
        socket.on.withArgs('connect').callArg(1);
        var actual = nickService.getNickname();

        nickService.getNickname().should.equal(actual);
        localStorageService.set.should.have.been.calledWith('nickname', actual);
        socket.emit.should.have.been.calledWith('join', actual);
    });

    it('should use localStorage when valid', function() {
        var expected = 'Valid123';
        localStorageService.get.withArgs('nickname').returns(expected);
        socket.on.withArgs('connect').callArg(1);

        nickService.getNickname().should.equal(expected);
        localStorageService.set.should.not.have.been.called;
        socket.emit.should.have.been.calledWith('join', expected);
    });

    it('should support changing nickname to valid', function() {
        var after = 'abc123';

        var actual = nickService.changeNickname(after);

        actual.should.be.true;
        socket.emit.should.have.been.calledWith('changenick', after);
    });

    it('should reject changing nickname to invalid', function() {
        var actual = nickService.changeNickname('!@#$%');

        actual.should.be.false;
        socket.emit.should.not.have.been.called;
    });

    it('should accept new nicknames from server', function() {
        var newNick = 'abc123';
        var before = nickService.getNickname();

        socket.on.withArgs('nickchanged').callArgWith(1, newNick);

        var after = nickService.getNickname();

        after.should.equal(newNick);
        after.should.not.equal(before);
        localStorageService.set.should.have.been.calledWith('nickname', newNick);
    });

    it('on reconnect, should join chat', function() {
        var nick = nickService.getNickname();
        socket.on.withArgs('reconnect').callArg(1);

        socket.emit.should.have.been.calledWith('join', nick);
    });

});