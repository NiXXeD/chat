angular.module('chat')
    .controller('chatCtrl', function($scope, $window, $document, cmdService, nickService) {
        $scope.text = null;
        $scope.title = 'Chat';
        $scope.visible = true;
        $scope.chatlog = [];
        $scope.history = [];
        $scope.historyIndex = 0;

        $scope.$on('chat', function(event, msg) {
            $scope.$apply(function() {
                $scope.chatlog.push(msg);

                //limit client history to 500 lines
                if ($scope.chatlog.length > 500) {
                    $scope.chatlog.shift();
                }
            });

            scrollToBottom();

            if (!$scope.visible) {
                $scope.$apply(function() {
                    $scope.title = '** Chat **';
                });
            }
        });

        $scope.$on('clear', function() {
            $scope.chatlog = [];
        });

        $scope.processCommand = function() {
            //record command history for up/down arrow
            $scope.history.push($scope.text);
            if ($scope.history.length > 15) {
                $scope.history.shift();
            }
            $scope.historyIndex = $scope.history.length;

            //process the command
            cmdService.process($scope.text);
            $scope.text = null;
        };

        $scope.keydown = function(event) {
            //arrow key up
            if (event.keyCode == 38 && $scope.historyIndex > 0) {
                $scope.historyIndex--;
                $scope.text = $scope.history[$scope.historyIndex];
            }

            //arrow key down
            if (event.keyCode == 40 && $scope.historyIndex < $scope.history.length) {
                $scope.historyIndex++;
                $scope.text = $scope.history[$scope.historyIndex];
            }

            //escape key
            if (event.keyCode == 27) {
                $scope.text = null;
                $scope.historyIndex = $scope.history.length;
            }
        };

        $scope.getNickClass = function(msg) {
            return nickService.getNickname() === msg.from ? 'me' : 'you';
        };

        $scope.getTextClass = function(msg) {
            return !!msg.to ? 'whispertext' : 'chattext';
        };

        $scope.$on('visibilityChanged', function(event, isHidden) {
            $scope.visible = !isHidden;
            if ($scope.visible) {
                $scope.$apply(function() {
                    $scope.title = 'Chat';
                });
            }
        }, false);

        function scrollToBottom() {
            $window.scrollTo(0, $window.document.body.scrollHeight);
        }
    });