angular.module('nix-chat')
    .controller('chatCtrl', function($scope, $timeout, chatService) {
        $scope.text = null;
        $scope.nickname = localStorage.nickname;
        $scope.chatting = ($scope.nickname);
        $scope.chatlog = [];

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
            msg.text = marked(msg.text)
                .replace('<p>', '')
                .replace('</p>', '');
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

            if (text.indexOf('/help') == 0) {
                chatService.systemSay('Available commands:');
                chatService.systemSay('"/nick [new name]" will change your nickname.');
                chatService.systemSay('"/clear" will clear your local chat history.');
                chatService.systemSay('"/users" will output what users are currently chatting.');
            } else if (text.indexOf('/nick') == 0) {
                var newNick = text.slice(5);
                chatService.changeNick($scope.nickname, newNick);

                $scope.nickname = newNick;
                localStorage.nickname = newNick;
            } else if (text.indexOf('/users') == 0) {
                chatService.users();
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