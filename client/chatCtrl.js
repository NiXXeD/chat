angular.module('chat')
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

        $scope.$on('users', function(event, users) {
            $scope.users = users;
        });

        $scope.processText = function processText() {
            var text = $scope.text;
            $scope.text = null;

            var split = text.split(' ');
            var cmd = split.shift().toLowerCase();
            if (cmd === '/help') {
                chatService.systemSay('Available commands:');
                chatService.systemSay('"/nick [new name]" will change your nickname.');
                chatService.systemSay('"/clear" will clear your local chat history.');
                chatService.systemSay('"/users" will output what users are currently chatting.');
            } else if (cmd === '/nick') {
                var newNick = split.shift();
                if (newNick) {
                    chatService.changeNick($scope.nickname, newNick);

                    $scope.nickname = newNick;
                    localStorage.nickname = newNick;
                } else {
                    chatService.systemSay('Please provide a new name.');
                }
            } else if (cmd === '/users') {
                chatService.users();
            } else if (cmd === '/clear') {
                $scope.chatlog = [];
            } else if (cmd === '/t') {
                var to = split.shift();
                var msg = split.join(' ');
                chatService.whisper($scope.nickname, to, msg);
            } else if (cmd.indexOf('/') == 0) {
                chatService.systemSay('Unknown command ' + cmd);
            } else {
                chatService.send($scope.nickname, text);
            }
        };

        function scrollToBottom() {
            window.scrollTo(0, document.body.scrollHeight);
        }
    });