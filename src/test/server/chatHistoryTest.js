describe('chatHistory', function() {
    var chatHistory;
    var lowdb;
    var db;
    var array;
    beforeEach(function() {
        array = [];

        db = function(name) {
            if (name === 'chatHistory') {
                return array;
            }
        };

        lowdb = function(name) {
            if (name === 'db.json') {
                return db;
            }
        };

        chatHistory = proxyquire('../../main/server/chatHistory', {
            'lowdb': lowdb
        });
    });

    it('should save messages', function() {
        chatHistory.push(12345);

        array.should.contain(12345);
    });

    it('should truncat history at 100 entries', function() {
        for (var i = 1; i <= 150; i++) {
            chatHistory.push(i);
        }

        array.length.should.equal(100);
        array.should.contain(150);
        array.should.contain(51);
        array.should.not.contain(50);
    });

    it('should support forEach on history', function() {
        var callback = sinon.stub();
        chatHistory.push(1);
        chatHistory.push(2);
        chatHistory.push(3);

        chatHistory.forEach(callback);

        callback.should.have.been.calledWith(1);
        callback.should.have.been.calledWith(2);
        callback.should.have.been.calledWith(3);
    });
});