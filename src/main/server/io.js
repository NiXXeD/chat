module.exports = function(io, chatHistory) {
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
            if (chatHistory.length > 100) {
                chatHistory.shift();
            }

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
                systemRespond(socket, 'User not found: ' + msg.to);
            }
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

        socket.on('changenick', function(newNick) {
            var oldnick = client.nickname;
            client.nickname = newNick;
            systemBroadcast(oldnick + ' is now known as ' + newNick + '.');
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
                from: 'System',
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

