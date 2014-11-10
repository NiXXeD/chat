describe('Unit: cmdService', function() {
    beforeEach(module('chat'));

    var $rootScope;
    var cmdService;
    var chatService;
    var nickService;
    beforeEach(inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        cmdService = $injector.get('cmdService');
        chatService = $injector.get('chatService');
        nickService = $injector.get('nickService');
    }));

    it('should send plain text', function() {
        chatService.send = sinon.stub();
        var expected;

        expected = 'some plain input text / or something';
        cmdService.process(expected);
        chatService.send.should.have.been.calledWith(expected);

        chatService.send.reset();
        expected = 'oneword';
        cmdService.process(expected);
        chatService.send.should.have.been.calledWith(expected);

        chatService.send.reset();
        expected = '';
        cmdService.process(expected);
        chatService.send.should.have.been.calledWith(expected);

        chatService.send.reset();
        expected = undefined;
        cmdService.process(expected);
        chatService.send.should.have.been.calledWith(expected);
    });

    it('should support /help', function() {
        var systemSaySpy = sinon.spy(chatService, 'systemSay');

        cmdService.process('/help');
        systemSaySpy.should.have.been.called;
    });

    it('should support /nick', function() {
        nickService.changeNickname = sinon.stub();

        cmdService.process('/nick firstWord even with spaces');
        nickService.changeNickname.should.have.been.calledWith('firstWord');

        nickService.changeNickname.reset();
        cmdService.process('/nick');
        nickService.changeNickname.should.have.been.calledWith(undefined);

        nickService.changeNickname.reset();
        cmdService.process('/nick    ');
        nickService.changeNickname.should.have.been.calledWith('');
    });

    it('should support /users', function() {
        chatService.users = sinon.stub();

        cmdService.process('/users garbage doesnt matter');

        chatService.users.should.have.been.called;
    });

    it ('should support /clear', function() {
        $rootScope.$broadcast = sinon.stub();

        cmdService.process('/clear garbage doesnt matter');

        $rootScope.$broadcast.should.have.been.calledWith('clear');
    });

    it ('should support /pm', function() {
        chatService.systemSay = sinon.stub();
        chatService.pm = sinon.stub();

        cmdService.process('/pm user a big long message');
        chatService.systemSay.should.not.have.been.called;
        chatService.pm.should.have.been.calledWith('user', 'a big long message');

        chatService.systemSay.reset();
        chatService.pm.reset();
        cmdService.process('/pm user');
        chatService.systemSay.should.have.been.called;
        chatService.pm.should.not.have.been.called;

        chatService.systemSay.reset();
        chatService.pm.reset();
        cmdService.process('/pm');
        chatService.systemSay.should.have.been.called;
        chatService.pm.should.not.have.been.called;

        chatService.systemSay.reset();
        chatService.pm.reset();
        cmdService.process('/pm   ');
        chatService.systemSay.should.have.been.called;
        chatService.pm.should.not.have.been.called;
    });

    it ('should reject unknown slash commands', function() {
        chatService.systemSay = sinon.stub();

        cmdService.process('/unknown command stuff');

        chatService.systemSay.should.have.been.calledWith('Unknown command /unknown');
    });
});