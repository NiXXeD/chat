angular.module('chat')
    .controller('chatCtrl', function($scope, chatService, nickService, cmdService) {
        $scope.text = null;
        $scope.chatlog = [];
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
            cmdService.process($scope.text);
            $scope.text = null;
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