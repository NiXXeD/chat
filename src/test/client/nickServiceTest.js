describe('Unit: nickService', function(){
    beforeEach(module('chat'));

    var defaultUserRegex = /^User[0-9]{1,5}$/;
    var nickService;
    var localStorageService;
    beforeEach(inject(function($injector) {
        nickService = $injector.get('nickService');

        localStorageService = $injector.get('localStorageService');
        localStorageService.get = sinon.stub();
        localStorageService.set = sinon.stub();
    }));

    it('should use default user when localStorage is empty', function() {
        localStorageService.get.withArgs('nickname').returns(null);
        nickService.init();

        var actual = nickService.getNickname();

        assert(defaultUserRegex.test(actual), 'Incorrect nickname: ' + actual);
        localStorageService.set.should.have.been.calledWith('nickname', actual);
    });

    it('should use default user when localStorage when invalid', function() {
        localStorageService.get.withArgs('nickname').returns('!@#$$%');
        nickService.init();
        var actual = nickService.getNickname();

        nickService.getNickname().should.equal(actual);
        localStorageService.set.should.have.been.calledWith('nickname', actual);
    });

    it('should use localStorage when valid', function() {
        var expected = 'Valid123';
        localStorageService.get.withArgs('nickname').returns(expected);
        nickService.init();

        nickService.getNickname().should.equal(expected);
        localStorageService.set.should.not.have.been.called;
    });

    it('should support changing nickname to valid', function() {
        var before = nickService.getNickname();
        var after = 'abc123';

        var actual = nickService.changeNickname(after);

        actual.should.be.true;
        after.should.not.equal(before);
        localStorageService.set.should.have.been.calledWith('nickname', after);
    });

    it('should reject changing nickname to invalid', function() {
        var before = 'Valid123';
        localStorageService.get.withArgs('nickname').returns(before);
        nickService.init();
        nickService.getNickname().should.equal(before);

        var actual = nickService.changeNickname('!@#$%');
        var after = nickService.getNickname();

        actual.should.be.false;
        before.should.equal(after);
        localStorageService.set.should.not.have.been.called;
    });
});