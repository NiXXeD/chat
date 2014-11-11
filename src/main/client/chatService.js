angular.module('chat')
    .service('chatService', function($rootScope, $timeout, markdownService, socket) {
        var chatService = {};

        var lastNick = null;

        chatService.init = function(nickname) {
            lastNick = nickname;

            //handle new chats
            socket.on('chat', function(json) {
                var msg = angular.fromJson(json);

                msg.text = markdownService.process(msg.text);

                $rootScope.$broadcast('chat', msg);
            });

            //on reconnect, tell the server who we are
            socket.on('reconnect', function() {
                socket.emit('join', lastNick);
            });

            socket.emit('join', lastNick);
            socket.emit('catchup');
        };

        //send chat
        chatService.send = function(text) {
            socket.emit('chat', text);
        };

        //send whisper
        chatService.pm = function(to, text) {
            var msg = {
                to: to,
                text: text
            };
            socket.emit('private', msg);
        };

        //get list of users
        chatService.users = function() {
            socket.emit('users');
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