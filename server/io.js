var low = require('lowdb');
var db = low('db.json');
var chatHistory = db('chatHistory');

module.exports = function(io) {

    var clients = [];

    io.on('connection', function(socket) {
        var client = {
            socket: socket,
            nickname: 'Anonymous'
        };
        clients.push(client);

        socket.on('chat', function(msg) {
            msg.date = new Date().getTime();
            chatHistory.push(msg);
            if (chatHistory.length > 100) {
                chatHistory.shift();
            }

            io.emit('chat', msg);
        });

        socket.on('catchup', function() {
            chatHistory.forEach(function(msg) {
                socket.emit('chat', msg);
            });
        });

        socket.on('users', function() {
            var users = clients.map(function(val) {
                return val.nickname;
            });
            systemSay('Users currently chatting: ' + users.join(', '), false);
        });

        socket.on('join', function(nick) {
            client.nickname = nick;
            systemSay(nick + ' has joined the chat. There are ' + clients.length + ' people now chatting.', true);
        });

        socket.on('changenick', function(msg) {
            client.nickname = msg.newNick;
            systemSay(msg.oldNick + ' is now known as ' + msg.newNick + '.', true);
        });

        socket.on('disconnect', function() {
            clients.splice(clients.indexOf(client), 1);
            systemSay(client.nickname + ' has left the chat. There are ' + clients.length + ' people still chatting.', true);
        });

        function systemSay(text, history) {
            var msg = {
                nickname: 'System',
                date: new Date().getTime(),
                text: text
            };

            if (history) {
                chatHistory.push(msg);
            }

            io.emit('chat', msg);
        }
    });

};

