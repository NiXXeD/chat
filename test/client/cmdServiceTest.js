describe('Unit: cmdService', function() {
    beforeEach(module('chat'));

    var $rootScope;
    var cmdService;
    var chatService;
    var nickService;
    beforeEach(inject(function(_$rootScope_, _cmdService_, _chatService_, _nickService_) {
        $rootScope = _$rootScope_;
        cmdService = _cmdService_;
        chatService = _chatService_;
        nickService = _nickService_;
    }));

    it('should send plain text', function() {
        var sendSpy = sinon.spy(chatService, 'send');
        var expected;

        expected = 'some plain input text / or something';
        cmdService.process(expected);
        sendSpy.should.have.been.calledWith(expected);

        sendSpy.reset();
        expected = 'oneword';
        cmdService.process(expected);
        sendSpy.should.have.been.calledWith(expected);

        sendSpy.reset();
        expected = '';
        cmdService.process(expected);
        sendSpy.should.have.been.calledWith(expected);

        sendSpy.reset();
        expected = undefined;
        cmdService.process(expected);
        sendSpy.should.have.been.calledWith(expected);
    });

    it('should support /help', function() {
        var systemSaySpy = sinon.spy(chatService, 'systemSay');

        cmdService.process('/help');
        systemSaySpy.should.have.been.called;
    });

    it('should support /nick', function() {
        var changeNicknameSpy = sinon.spy(nickService, 'changeNickname');

        cmdService.process('/nick firstWord even with spaces');
        changeNicknameSpy.should.have.been.calledWith('firstWord');

        changeNicknameSpy.reset();
        cmdService.process('/nick');
        changeNicknameSpy.should.have.been.calledWith(undefined);

        changeNicknameSpy.reset();
        cmdService.process('/nick    ');
        changeNicknameSpy.should.have.been.calledWith('');
    });

    it('should support /users', function() {
        var usersSpy = sinon.spy(chatService, 'users');

        cmdService.process('/users garbage doesnt matter');

        usersSpy.should.have.been.called;
    });

    it ('should support /clear', function() {
        var broadcastSpy = sinon.spy($rootScope, '$broadcast');

        cmdService.process('/clear garbage doesnt matter');

        broadcastSpy.should.have.been.calledWith('clear');
    });

    it ('should support /pm', function() {
        var systemSaySpy = sinon.spy(chatService, 'systemSay');
        var pmSpy = sinon.spy(chatService, 'pm');

        cmdService.process('/pm user a big long message');
        systemSaySpy.should.not.have.been.called;
        pmSpy.should.have.been.calledWith('user', 'a big long message');

        systemSaySpy.reset();
        pmSpy.reset();
        cmdService.process('/pm user');
        systemSaySpy.should.have.been.called;
        pmSpy.should.not.have.been.called;

        systemSaySpy.reset();
        pmSpy.reset();
        cmdService.process('/pm');
        systemSaySpy.should.have.been.called;
        pmSpy.should.not.have.been.called;

        systemSaySpy.reset();
        pmSpy.reset();
        cmdService.process('/pm   ');
        systemSaySpy.should.have.been.called;
        pmSpy.should.not.have.been.called;
    });

    it ('should reject unknown slash commands', function() {
        var systemSaySpy = sinon.spy(chatService, 'systemSay');

        cmdService.process('/unknown command stuff');

        systemSaySpy.should.have.been.calledWith('Unknown command /unknown');
    });
});