describe('Unit: nickService', function(){
    beforeEach(module('chat'));

    var defaultUserRegex = /^User[0-9]{1,5}$/;

    describe('when localStorage is empty', function() {
        beforeEach(function() {
            localStorage.clear();
        });

        it('.getNickname() should return a default user', inject(function(nickService) {
            var actual = nickService.getNickname();
            assert(defaultUserRegex.test(actual), 'Incorrect nickname: ' + actual);
        }));
    });

    describe('when localStorage has a valid value', function() {
        var expected = 'Valid1234';

        beforeEach(function() {
            localStorage.nickname = expected;
        });

        it('.getNickname() should return the stored value', inject(function(nickService) {
            expect(nickService.getNickname()).to.equal(expected);
        }));
    });

    describe('when localStorage has an invalid value', function() {
        beforeEach(function() {
            localStorage.nickname = 'invalid!@#$';
        });

        it('.getNickname() should return a default user', inject(function(nickService) {
            var actual = nickService.getNickname();
            assert(defaultUserRegex.test(actual), 'Incorrect nickname: ' + actual);
        }));
    });

    describe('when changing nickname', function() {
        var changeNickSpy;
        var systemSaySpy;
        beforeEach(inject(function(chatService) {
            localStorage.clear();

            changeNickSpy = sinon.spy(chatService, 'changeNick');
            systemSaySpy = sinon.spy(chatService, 'systemSay');
        }));

        it('should change to abc123', inject(function(nickService) {


            var before = nickService.getNickname();
            var after = 'abc123';

            nickService.changeNickname(after);

            var actual = nickService.getNickname();
            expect(actual).to.equal(after);
            expect(actual).not.to.equal(before);
            changeNickSpy.should.have.been.calledWith(after);
            systemSaySpy.should.have.callCount(0);
        }));

        it('should reject invalid name', inject(function(nickService) {
            var before = nickService.getNickname();
            var after = '!@#$%';

            nickService.changeNickname(after);

            var actual = nickService.getNickname();
            expect(actual).to.equal(before);
            changeNickSpy.should.have.callCount(0);
            systemSaySpy.should.have.callCount(1)
        }));
    });
});