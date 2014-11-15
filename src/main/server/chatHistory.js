var low = require('lowdb');
var db = low('db.json');
var array = db('chatHistory');

module.exports = {
    push: function(msg) {
        array.push(msg);

        if (array.length > 100) {
            array.shift();
        }
    },
    forEach: function(callback) {
        array.forEach(callback);
    }
};