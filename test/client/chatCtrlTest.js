describe('chatCtrl', function() {
    beforeEach(module('chat'));

    var $scope;
    var cmdService;
    var createController;
    beforeEach(inject(function($injector) {
        $scope = $injector.get('$rootScope');
        $scope.$on = sinon.stub();
        $scope.$apply = sinon.stub();

        cmdService = $injector.get('cmdService');
        cmdService.init = sinon.stub();

        var $controller = $injector.get('$controller');
        createController = function() {
            return $controller('chatCtrl', { $scope: $scope });
        }
    }));

    it('should call cmdService.init on startup', function() {
        createController();

        cmdService.init.should.have.been.called;
    });

    it('should handle chat events', function() {
        $scope.$on.withArgs('chat').callsArgWith(1, null, 'chat msg');
        createController();

        $scope.chatlog.should.contain('chat msg');
        $scope.$apply.should.have.been.called;
    });

    it('should limit chat history to 500', function() {
        createController();
        $scope.chatlog.length.should.equal(0);

        var callback = $scope.$on.withArgs('chat').getCall(0).args[1];
        for(var i=0; i<750; i++) {
            callback(null, i);
        }

        $scope.chatlog.length.should.equal(500);
    });

    it('should handle clear events', function() {
        createController();

        $scope.chatlog = ['one', 'two', 'three'];

        $scope.$on.withArgs('clear').getCall(0).args[1]();

        $scope.chatlog.should.be.empty;
    });

    it('should handle changenick events', function() {
        createController();

        should.not.exist($scope.nickname);

        $scope.$on.withArgs('changenick').getCall(0).args[1](null, 'nick');

        $scope.nickname.should.equal('nick');
    });
});