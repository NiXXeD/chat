angular.module('chat')
    .service('nickService', function(localStorageService, socket) {
        var nickService = {};
        var nickname = null;

        //on connect, tell the server our name
        socket.on('connect', function() {
            nickname = localStorageService.get('nickname');
            if (!nickService.isValid(nickname)) {
                nickname = 'User' + Math.floor((Math.random() * 99999) + 1);
                localStorageService.set('nickname', nickname);
            }
            socket.emit('join', nickname);
        });

        socket.on('reconnect', function() {
            socket.emit('join', nickname);
        });

        //simple getter
        nickService.getNickname = function() {
            return nickname;
        };

        //change nick
        nickService.changeNickname = function(newNick) {
            if (nickService.isValid(newNick)) {
                socket.emit('changenick', newNick);
                return true;
            } else {
                return false;
            }
        };

        //nick changed event
        socket.on('nickchanged', function(newNick) {
            nickname = newNick;
            localStorageService.set('nickname', nickname);
        });

        //check validity
        nickService.isValid = function isValid(test) {
            return !!test && /^[a-zA-Z0-9-]{3,15}$/.test(test) && test.toLowerCase() !== 'system';
        };

        return nickService;
    });