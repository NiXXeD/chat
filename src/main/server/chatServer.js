var chatHistory = require('./chatHistory');

module.exports = function(io) {
    var clients = [];

    io.on('connection', function(socket) {
        //keep track of clients
        var client = {
            socket: socket,
            nickname: 'Anonymous'
        };
        clients.push(client);

        //on connect, send chat history
        chatHistory.forEach(function(msg) {
            socket.emit('chat', msg);
        });

        socket.on('chat', function(text) {
            var msg = {
                from: client.nickname,
                date: new Date().getTime(),
                text: text
            };

            chatHistory.push(msg);

            io.emit('chat', msg);
        });

        socket.on('private', function(msg) {
            msg.from = client.nickname;
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
                systemSay(socket, 'User not found: ' + msg.to, false);
            }
        });

        socket.on('users', function() {
            var users = clients.map(function(val) {
                return val.nickname;
            });
            systemSay(socket, 'Users currently chatting: ' + users.join(', '), false);
        });

        socket.on('join', function(nick) {
            client.nickname = nick;
            systemBroadcast(nick + ' has joined the chat. There are ' + clients.length + ' people now chatting.');
        });

        socket.on('changenick', function(newNick) {
            var oldNick = client.nickname;
            if (isNickValid(oldNick, newNick)) {
                client.nickname = newNick;
                socket.emit('nickchanged', newNick);
                systemBroadcast(oldNick + ' is now known as ' + newNick + '.');
            } else {
                systemSay(socket, 'Please provide a valid new nickname.', false);
            }
        });

        socket.on('disconnect', function() {
            clients.splice(clients.indexOf(client), 1);
            systemBroadcast(client.nickname + ' has left the chat. There are ' + clients.length + ' people still chatting.');
        });

        function systemBroadcast(text) {
            systemSay(io, text, true);
        }

        function systemSay(socket, text, history) {
            var msg = {
                from: 'System',
                date: new Date().getTime(),
                text: text
            };

            if (history) {
                chatHistory.push(msg);
            }

            socket.emit('chat', msg);
        }

        function isNickValid(oldNick, newNick) {
            var valid = !!newNick;
            valid = valid && /^[a-zA-Z0-9-]{3,15}$/.test(newNick);
            valid = valid && newNick.toLowerCase() !== 'system';
            valid = valid && newNick != oldNick;
            valid = valid && !clients.some(function(client) {
                return client.nickname.toLowerCase() === newNick.toLowerCase();
            });
            return valid;
        }
    });

};

