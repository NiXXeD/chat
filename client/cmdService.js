angular.module('chat')
    .service('cmdService', function($rootScope, chatService, nickService) {
        var cmdService = {};

        cmdService.process = function(text) {
            var split = text.split(' ');
            var cmd = split.shift().toLowerCase();
            if (cmd === '/help') {
                chatService.systemSay('Available commands:');
                chatService.systemSay('"/nick [new name]" will change your nickname.');
                chatService.systemSay('"/clear" will clear your local chat history.');
                chatService.systemSay('"/users" will output what users are currently chatting.');
                chatService.systemSay('"/t [user] [msg]" will send a private message to a user (also can use /w).');
            } else if (cmd === '/nick') {
                var newNick = split.shift();
                nickService.changeNickname(newNick);
            } else if (cmd === '/users') {
                chatService.users();
            } else if (cmd === '/clear') {
                $rootScope.$broadcast('clear');
            } else if (cmd === '/t' || cmd === '/w') {
                var to = split.shift();
                var msg = split.join(' ');
                if (to && msg) {
                    chatService.whisper(nickService.getNickname(), to, msg);
                } else {
                    chatService.systemSay('"/t [user] [msg]" will send a private message to a user (also can use /w).')
                }
            } else if (cmd.indexOf('/') == 0) {
                chatService.systemSay('Unknown command ' + cmd);
            } else {
                chatService.send(nickService.getNickname(), text);
            }
        };

        return cmdService;
    });