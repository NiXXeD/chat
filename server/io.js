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

        socket.on('private', function(msg) {
            msg.date = new Date().getTime();

            //find destination user
            var expectedName = msg.to.toLowerCase();
            var targetClient;
            clients.forEach(function(client) {
                if (client.nickname.toLowerCase() === expectedName) {
                    targetClient = client;
                }
            });

            if (targetClient) {
                socket.emit('chat', msg);
                targetClient.socket.emit('chat', msg);
            } else {
                systemRespond(socket, 'User not found: ' + msg.to);
            }
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
            systemRespond(socket, 'Users currently chatting: ' + users.join(', '));
        });

        socket.on('join', function(nick) {
            client.nickname = nick;
            systemBroadcast(nick + ' has joined the chat. There are ' + clients.length + ' people now chatting.');
        });

        socket.on('changenick', function(msg) {
            client.nickname = msg.newNick;
            systemBroadcast(msg.oldNick + ' is now known as ' + msg.newNick + '.');
        });

        socket.on('disconnect', function() {
            clients.splice(clients.indexOf(client), 1);
            systemBroadcast(client.nickname + ' has left the chat. There are ' + clients.length + ' people still chatting.');
        });

        function systemBroadcast(text) {
            systemSay(io, text, true);
        }

        function systemRespond(socket, text) {
            systemSay(socket, text, false);
        }

        function systemSay(socket, text, history) {
            var msg = {
                nickname: 'System',
                date: new Date().getTime(),
                text: text
            };

            if (history) {
                chatHistory.push(msg);
            }

            socket.emit('chat', msg);
        }
    });

};

