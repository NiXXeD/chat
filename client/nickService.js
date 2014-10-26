angular.module('chat')
    .service('nickService', function(chatService, localStorageService) {
        var nickService = {};

        //initialize nickname
        var nickname = localStorageService.get('nickname');
        if (!isValid(nickname)) {
            nickname = 'User' + Math.floor((Math.random() * 99999) + 1);
            localStorageService.set('nickname', nickname);
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
                localStorageService.set('nickname', nickname);
            } else {
                chatService.systemSay('Please provide a valid new nickname.');
            }
        };

        //check validity
        function isValid(test) {
            return !!test && /^[a-zA-Z0-9-]{3,15}$/.test(test) && test.toLowerCase() !== 'system';
        }

        return nickService;
    });