angular.module('chat')
    .service('nickService', function(chatService) {
        var nickService = {};

        //initialize nickname
        var nickname = localStorage.nickname;
        if (!isValid(nickname)) {
            nickname = 'User' + Math.floor((Math.random() * 10000) + 1);
        }
        chatService.join(nickname);

        //simple getter
        nickService.getNickname = function() {
            return nickname;
        };

        //change nick
        nickService.changeNickname = function(newNick) {
            if (isValid(newNick)) {
                chatService.changeNick(newNick);

                nickname = newNick;
                localStorage.nickname = newNick;
            } else {
                chatService.systemSay('Please provide a valid new nickname.');
            }
            return false;
        };

        //check validity
        function isValid(test) {
            return /^[a-zA-Z0-9-]{3,15}$/.test(test) && test.toLowerCase() !== 'system';
        }

        return nickService;
    });