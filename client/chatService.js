angular.module('chat')
    .service('chatService', function($rootScope, $timeout) {
        var chatService = {};

        var socket = io();
        var lastNick = null;

        //received chat
        socket.on('chat', function(json) {
            var msg = angular.fromJson(json);

            msg.text = marked(msg.text)
                .replace('<p>', '')
                .replace('</p>', '')
                .replace('a href', 'a target="_blank" href');

            $rootScope.$broadcast('chat', msg);
        });

        //on reconnect, tell the server who we are
        socket.on('reconnect', function() {
            socket.emit('join', lastNick);
        });

        //send chat
        chatService.send = function(from, text) {
            var msg = {
                nickname: from,
                text: text
            };
            socket.emit('chat', msg);
        };

        //send whisper
        chatService.whisper = function(from, to, text) {
            var msg = {
                nickname: from,
                to: to,
                text: text
            };
            socket.emit('whisper', msg);
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
            socket.emit('catchup');
        };

        //have the system report info to us
        chatService.systemSay = function(text) {
            $timeout(function() {
                var msg = {
                    nickname: 'System',
                    date: new Date().getTime(),
                    text: text
                };
                $rootScope.$broadcast('chat', msg);
            });
        };

        //change name
        chatService.changeNick = function(oldNick, newNick) {
            var msg = {
                oldNick: oldNick,
                newNick: newNick
            };
            lastNick = newNick;
            socket.emit('changenick', msg);
        };

        return chatService;
    });