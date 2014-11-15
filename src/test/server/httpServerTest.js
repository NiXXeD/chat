describe('httpServer', function() {
    var httpServer;
    beforeEach(function() {
        httpServer = proxyquire('../../main/server/httpServer', {

        });
    });

    it('should instantiate', function() {
        httpServer.should.not.be.undefined;
    });
});