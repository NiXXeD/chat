angular.module('nix-chat')
    .controller('chatCtrl', function($scope, $location, $anchorScroll, chatService) {
        $scope.text = null;
        $scope.nickname = localStorage.nickname;
        $scope.chatting = ($scope.nickname);
        $scope.chatlog = [];
        $scope.users = [];

        $scope.startChatting = function() {
            localStorage.nickname = $scope.nickname;
            $scope.chatting = true;
            chatService.join($scope.nickname);
        };
        if ($scope.chatting) {
            chatService.join($scope.nickname);
        }
        chatService.catchUp();

        $scope.$on('chat', function(event, msg) {
            $scope.chatlog.push(msg);
            $scope.$apply();
            scrollToBottom();
        });

        $scope.$on('users', function(event, users) {
            $scope.users = users;
        });

        $scope.processText = function processText() {
            var text = $scope.text;
            $scope.text = null;

            if (text.indexOf('/nick') == 0) {
                var newNick = text.slice(5);
                chatService.changeNick($scope.nickname, newNick);

                $scope.nickname = newNick;
                localStorage.nickname = newNick;
            } else if (text.indexOf('/users') == 0) {
                $scope.chatlog.push({
                    nickname: 'System',
                    date: new Date().getTime(),
                    text: 'Users currently chatting: ' + $scope.users.join(', ')
                });
                scrollToBottom();
            } else if (text.indexOf('/clear') == 0) {
                $scope.chatlog = [];
            } else {
                var chat = {
                    nickname: localStorage.nickname,
                    text: text
                };
                chatService.send(chat);
            }
        };

        function scrollToBottom() {
            window.scrollTo(0, document.body.scrollHeight);
        }
    });