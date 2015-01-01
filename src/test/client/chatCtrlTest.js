describe('chatCtrl', function() {
    beforeEach(module('chat'));

    var $scope;
    var $window;
    var cmdService;
    var nickService;
    var createController;
    beforeEach(inject(function($injector) {
        $scope = $injector.get('$rootScope');
        $scope.$on = sinon.stub();
        $scope.$apply = sinon.stub().callsArg(0);

        $window = $injector.get('$window');
        $window.scrollTo = sinon.stub();

        cmdService = $injector.get('cmdService');
        cmdService.init = sinon.stub();
        cmdService.process = sinon.stub();

        nickService = $injector.get('nickService');
        nickService.getNickname = sinon.stub();

        var $controller = $injector.get('$controller');
        createController = function() {
            return $controller('chatCtrl', { $scope: $scope });
        }
    }));

    describe('when loaded', function() {
        beforeEach(function() {
            createController();
        });

        it('should handle chat events', function() {
            $scope.$on.withArgs('chat').getCall(0).args[1](null, 'chat msg');

            $scope.chatlog.should.contain('chat msg');
            $window.scrollTo.should.have.been.called;
        });

        it('should handle visibility events', function() {
            $scope.visible.should.be.true;
            $scope.$on.withArgs('visibilityChanged').getCall(0).args[1](null, true);
            $scope.visible.should.be.false;

            $scope.title = 'blah';
            $scope.$on.withArgs('visibilityChanged').getCall(0).args[1](null, false);
            $scope.title.should.equal('Chat');
        });

        it('should update title bar when not visible', function() {
            $scope.$on.withArgs('visibilityChanged').getCall(0).args[1](null, true);
            $scope.$on.withArgs('chat').getCall(0).args[1](null, 'chat msg');

            $scope.chatlog.should.contain('chat msg');
            $scope.title.should.equal('** Chat **');
            $window.scrollTo.should.have.been.called;
        });

        it('should limit chat history to 500', function() {
            $scope.chatlog.length.should.equal(0);

            var callback = $scope.$on.withArgs('chat').getCall(0).args[1];
            for(var i=0; i<750; i++) {
                callback(null, i);
            }

            $scope.chatlog.length.should.equal(500);
        });

        it('should handle clear events', function() {
            $scope.chatlog = ['one', 'two', 'three'];

            $scope.$on.withArgs('clear').getCall(0).args[1]();

            $scope.chatlog.should.be.empty;
        });

        it('should handle text input', function() {
            $scope.text = 'some command';

            $scope.processCommand();

            cmdService.process.should.have.been.calledWith('some command');
            should.not.exist($scope.text);
            $scope.history.should.contain('some command');
        });

        it('should clear text when esc key is pressed', function() {
            $scope.text = 'some text';

            $scope.keydown({ keyCode: 27 });

            should.not.exist($scope.text);
        });

        it('should provide nickname highlight', function() {
            nickService.getNickname.returns('nick');

            $scope.getNickClass({from: 'nick'}).should.equal('me');
            $scope.getNickClass({from: 'blah'}).should.equal('you');
        });

        it('should provide private message highlight', function() {
            $scope.getTextClass({}).should.equal('chattext');
            $scope.getTextClass({to: 'somebody'}).should.equal('whispertext');
        });

        describe('should support command history', function() {
            beforeEach(function() {
                for(var i=0; i<25; i++) {
                    $scope.text = i;
                    $scope.processCommand();
                }
            });

            it('should save the last 15 commands', function() {
                $scope.history.length.should.equal(15);
            });

            it('should allow cycling through commands', function() {
                var i;
                should.not.exist($scope.text);

                $scope.keydown({ keyCode: 38 });
                $scope.text.should.equal(24);

                $scope.keydown({ keyCode: 38 });
                $scope.text.should.equal(23);

                for(i=0; i<20; i++) {
                    $scope.keydown({ keyCode: 38 });
                }
                $scope.text.should.equal(10);

                $scope.keydown({ keyCode: 40 });
                $scope.text.should.equal(11);

                $scope.keydown({ keyCode: 40 });
                $scope.text.should.equal(12);

                for(i=0; i<20; i++) {
                    $scope.keydown({ keyCode: 40 });
                }
                should.not.exist($scope.text);
            });
        });
    });
});