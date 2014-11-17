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

    it('should setup handler for: chat', function() {
        var expected = 'test text';
        var msg = { text: expected };
        socket.on.withArgs('chat').callArgWith(1, msg);

        markdownService.process.should.have.been.calledWith(expected);
        $rootScope.$broadcast.should.have.been.calledWith('chat', msg);
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

    it('should support system messages', function() {
        chatService.systemSay('some message');
        $timeout.flush();

        $rootScope.$broadcast.should.have.been.calledWith('chat');
        $rootScope.$broadcast.getCall(0).args[1].should.have.property('from', 'System');
        $rootScope.$broadcast.getCall(0).args[1].should.have.property('text', 'some message');
    });
});