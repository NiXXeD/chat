angular.module('nix-chat')
    .service('chatService', function($rootScope) {
        var chatService = {};

        var socket = io();
        var lastNick = null;

        //received chat
        socket.on('chat', function(msg) {
            var obj = angular.fromJson(msg);
            $rootScope.$broadcast('chat', obj);
        });

        socket.on('users', function(users) {
            $rootScope.$broadcast('users', users);
        });

        socket.on('reconnect', function() {
            socket.emit('join', lastNick);
        });

        //send chat
        chatService.send = function(chat) {
            socket.emit('chat', chat);
        };

        //join the chat
        chatService.join = function(nick) {
            lastNick = nick;
            socket.emit('join', nick);
        };

        chatService.catchUp = function() {
            socket.emit('catchup', {});
        };

        //change name
        chatService.changeNick = function(oldNick, newNick) {
            var msg = {
                oldNick: oldNick,
                newNick: newNick
            };
            socket.emit('changenick', msg);
        };

        return chatService;
    });