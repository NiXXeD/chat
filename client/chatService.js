angular.module('chat')
    .service('chatService', function($rootScope, $timeout, markdownService) {
        var chatService = {};

        var socket = io();
        var lastNick = null;

        //received chat
        socket.on('chat', function(json) {
            var msg = angular.fromJson(json);

            msg.text = markdownService.process(msg.text);

            $rootScope.$broadcast('chat', msg);
        });

        //on reconnect, tell the server who we are
        socket.on('reconnect', function() {
            socket.emit('join', lastNick);
        });

        //send chat
        chatService.send = function(from, text) {
            socket.emit('chat', text);
        };

        //send whisper
        chatService.pm = function(from, to, text) {
            var msg = {
                to: to,
                text: text
            };
            socket.emit('private', msg);
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
                    from: 'System',
                    date: new Date().getTime(),
                    text: markdownService.process(text)
                };
                $rootScope.$broadcast('chat', msg);
            });
        };

        //change name
        chatService.changeNick = function(newNick) {
            lastNick = newNick;
            socket.emit('changenick', newNick);
        };

        return chatService;
    });