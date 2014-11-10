angular.module('chat')
    .service('socket', function() {
        return io();
    });