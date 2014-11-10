describe('chatService', function() {
    beforeEach(module('chat'));

    var $rootScope;
    var $timeout;
    var markdownService;
    var socket;
    var chatService;
    beforeEach(inject(function($injector) {
        socket = $injector.get('socket');
        socket.on = sinon.stub();
        socket.emit = sinon.stub();

        $rootScope = $injector.get('$rootScope');
        $rootScope.$broadcast = sinon.stub();

        $timeout = $injector.get('$timeout');

        markdownService = $injector.get('markdownService');
        markdownService.process = sinon.stub().returnsArg(0);

        chatService = $injector.get('chatService');
    }));

    it('should handle init', function() {
        chatService.init('nick');

        socket.emit.should.have.been.calledWith('join', 'nick');
        socket.emit.should.have.been.calledWith('catchup');
    });

    it('should setup handler for: chat', function() {
        var expected = 'test text';
        var msg = { text: expected };
        chatService.init();
        socket.on.withArgs('chat').callArgWith(1, msg);

        markdownService.process.should.have.been.calledWith(expected);
        $rootScope.$broadcast.should.have.been.calledWith('chat', msg);
    });

    it('should setup handler for: reconnect', function() {
        chatService.init();
        socket.on.withArgs('reconnect').callArg(1);

        socket.emit.should.have.been.called;
    });

    it('should support outgoing chat', function() {
        chatService.send('text');

        socket.emit.should.have.been.calledWith('chat', 'text');
    });

    it('should support private messages', function() {
        chatService.pm('person', 'text');

        socket.emit.should.have.been.calledWith('private', { to: 'person', text: 'text' });
    });

    it('should support listing users', function() {
        chatService.users();

        socket.emit.should.have.been.calledWith('users');
    });

    it('should support changing nicknames', function() {
        chatService.changeNick('newNick');

        socket.emit.should.have.been.calledWith('changenick', 'newNick');
    });

    it('should support system messages', function() {
        chatService.systemSay('some message');
        $timeout.flush();

        $rootScope.$broadcast.should.have.been.calledWith('chat');
        $rootScope.$broadcast.getCall(0).args[1].should.have.property('from', 'System');
        $rootScope.$broadcast.getCall(0).args[1].should.have.property('text', 'some message');
    });
});