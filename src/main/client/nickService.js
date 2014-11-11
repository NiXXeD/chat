angular.module('chat')
    .service('nickService', function(localStorageService) {
        var nickService = {};
        var nickname = null;

        //initialize nickname
        nickService.init = function init() {
            nickname = localStorageService.get('nickname');
            if (!isValid(nickname)) {
                nickname = 'User' + Math.floor((Math.random() * 99999) + 1);
                localStorageService.set('nickname', nickname);
            }
        };

        //simple getter
        nickService.getNickname = function() {
            return nickname;
        };

        //change nick
        nickService.changeNickname = function(newNick) {
            if (isValid(newNick)) {
                nickname = newNick;
                localStorageService.set('nickname', nickname);
                return true;
            } else {
                return false;
            }
        };

        //check validity
        function isValid(test) {
            return !!test && /^[a-zA-Z0-9-]{3,15}$/.test(test) && test.toLowerCase() !== 'system';
        }

        return nickService;
    });