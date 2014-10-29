angular.module('chat')
    .service('cmdService', function($rootScope, chatService, nickService) {
        var cmdService = {};

        cmdService.process = function(text) {
            var split = (text || '').split(' ');
            var cmd = split.shift().toLowerCase();
            if (cmd === '/help') {
                chatService.systemSay('**_Available commands:_**');
                chatService.systemSay('"**/nick [new name]**" will change your nickname.');
                chatService.systemSay('"**/clear**" will clear your local chat history.');
                chatService.systemSay('"**/users**" will output what users are currently chatting.');
                chatService.systemSay('"**/pm [user] [msg]**" will send a private message to a user.');
            } else if (cmd === '/nick') {
                var newNick = split.shift();
                nickService.changeNickname(newNick);
            } else if (cmd === '/users') {
                chatService.users();
            } else if (cmd === '/clear') {
                $rootScope.$broadcast('clear');
            } else if (cmd === '/pm') {
                var to = split.shift();
                var msg = split.join(' ');
                if (to && msg) {
                    chatService.pm(to, msg);
                } else {
                    chatService.systemSay('Invalid private message, see /help for usage.')
                }
            } else if (cmd.indexOf('/') == 0) {
                chatService.systemSay('Unknown command ' + cmd);
            } else {
                chatService.send(text);
            }
        };

        return cmdService;
    });