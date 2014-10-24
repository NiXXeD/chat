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

        //on reconnect, tell the server who we are
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

        //get list of users
        chatService.users = function() {
            socket.emit('users');
        };

        //on fresh connect, ask for chat history
        chatService.catchUp = function() {
            socket.emit('catchup', {});
        };

        //have the system report info to us
        chatService.systemSay = function(text) {
            var msg = {
                nickname: 'System',
                date: new Date().getTime(),
                text: text
            };
            $rootScope.$broadcast('chat', msg);
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