describe('Unit: nickService', function(){
    beforeEach(module('chat'));

    var defaultUserRegex = /^User[0-9]{1,5}$/;

    describe('on load with empty localStorage', function() {
        var getSpy;
        var setSpy;
        var joinSpy;

        beforeEach(inject(function(chatService, localStorageService) {
            joinSpy = sinon.spy(chatService, 'join');
            getSpy = sinon.stub(localStorageService, 'get').returns(null);
            setSpy = sinon.spy(localStorageService, 'set');
        }));

        it('should return a default user', inject(function(nickService) {
            var actual = nickService.getNickname();

            assert(defaultUserRegex.test(actual), 'Incorrect nickname: ' + actual);
            joinSpy.should.have.been.calledWith(actual);
            setSpy.should.have.been.calledWith('nickname', actual);
        }));
    });

    describe('on load with valid localStorage', function() {
        var getSpy;
        var setSpy;
        var joinSpy;
        var expected = 'Valid123';

        beforeEach(inject(function(chatService, localStorageService) {
            joinSpy = sinon.spy(chatService, 'join');
            getSpy = sinon.stub(localStorageService, 'get').returns(expected);
            setSpy = sinon.spy(localStorageService, 'set');
        }));

        it('should return the stored value', inject(function(nickService) {
            expect(nickService.getNickname()).to.equal(expected);
            joinSpy.should.have.been.calledWith(expected);
            setSpy.should.have.callCount(0);
        }));
    });

    describe('on load with valid localStorage', function() {
        var getSpy;
        var setSpy;
        var joinSpy;

        beforeEach(inject(function(chatService, localStorageService) {
            joinSpy = sinon.spy(chatService, 'join');
            getSpy = sinon.stub(localStorageService, 'get').returns('!@#$$%');
            setSpy = sinon.spy(localStorageService, 'set');
        }));

        it('with invalid localStorage, should return a default user', inject(function(nickService) {
            var actual = nickService.getNickname();

            assert(defaultUserRegex.test(actual), 'Incorrect nickname: ' + actual);
            joinSpy.should.have.been.calledWith(actual);
            setSpy.should.have.been.calledWith('nickname', actual);
        }));
    });

    describe('when changing nickname', function() {
        var changeNickSpy;
        var systemSaySpy;
        var setSpy;
        beforeEach(inject(function(chatService, localStorageService) {
            sinon.stub(localStorageService, 'get').returns(null);
            setSpy = sinon.spy(localStorageService, 'set');
            changeNickSpy = sinon.spy(chatService, 'changeNick');
            systemSaySpy = sinon.spy(chatService, 'systemSay');
        }));

        it('should change to abc123', inject(function(nickService) {
            setSpy.reset();
            var before = nickService.getNickname();
            var after = 'abc123';

            nickService.changeNickname(after);

            var actual = nickService.getNickname();
            expect(actual).to.equal(after);
            expect(actual).not.to.equal(before);
            changeNickSpy.should.have.been.calledWith(after);
            systemSaySpy.should.have.callCount(0);
            setSpy.should.have.been.calledWith('nickname', after);
        }));

        it('should reject invalid name', inject(function(nickService) {
            setSpy.reset();
            var before = nickService.getNickname();
            var after = '!@#$%';

            nickService.changeNickname(after);

            var actual = nickService.getNickname();
            expect(actual).to.equal(before);
            changeNickSpy.should.have.callCount(0);
            systemSaySpy.should.have.callCount(1);
            setSpy.should.have.callCount(0);
        }));
    });
});