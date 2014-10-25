angular.module('chat')
    .controller('chatCtrl', function($scope, chatService, nickService, cmdService) {
        $scope.text = null;
        $scope.chatlog = [];
        $scope.history = [];
        $scope.historyIndex = 0;
        chatService.catchUp();

        $scope.$on('chat', function(event, msg) {
            if (Array.isArray(msg)) {
                $scope.chatlog = $scope.chatlog.concat(msg);
            } else {
                $scope.chatlog.push(msg);
            }

            //limit client history to 500 lines
            if ($scope.chatlog.length > 500) {
                $scope.chatlog.shift();
            }

            $scope.$apply();
            scrollToBottom();
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
            return nickService.getNickname() === msg.nickname ? 'me' : 'you';
        };

        $scope.getTextClass = function(msg) {
            return !!msg.to ? 'whispertext' : 'chattext';
        };

        function scrollToBottom() {
            window.scrollTo(0, document.body.scrollHeight);
        }
    });