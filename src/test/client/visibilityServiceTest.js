describe('visibilityService', function() {
    beforeEach(module('chat'));

    var visibilityService;
    var $document;
    var $rootScope;
    beforeEach(inject(function($injector) {
        $document = $injector.get('$document');
        $document[0].addEventListener = sinon.stub();
        $document[0].hidden = false;
        $document[0].webkitHidden = false;
        $document[0].mozHidden = false;
        $document[0].msHidden = false;

        $rootScope = $injector.get('$rootScope');
        $rootScope.$broadcast = sinon.stub();

        visibilityService = $injector.get('visibilityService');
        visibilityService.load();
    }));

    it('should handle vanilla events', function() {
        $document[0].addEventListener.withArgs('visibilitychange').callArg(1);
        $rootScope.$broadcast.should.have.been.calledWith('visibilityChanged', false);

        $document[0].hidden = true;
        $document[0].addEventListener.withArgs('visibilitychange').callArg(1);
        $rootScope.$broadcast.should.have.been.calledWith('visibilityChanged', true);
    });

    it('should handle mozilla events', function() {
        $document[0].addEventListener.withArgs('visibilitychange').callArg(1);
        $rootScope.$broadcast.should.have.been.calledWith('visibilityChanged', false);

        $document[0].mozHidden = true;
        $document[0].addEventListener.withArgs('visibilitychange').callArg(1);
        $rootScope.$broadcast.should.have.been.calledWith('visibilityChanged', true);
    });

    it('should handle webkit events', function() {
        $document[0].addEventListener.withArgs('webkitvisibilitychange').callArg(1);
        $rootScope.$broadcast.should.have.been.calledWith('visibilityChanged', false);

        $document[0].webkitHidden = true;
        $document[0].addEventListener.withArgs('webkitvisibilitychange').callArg(1);
        $rootScope.$broadcast.should.have.been.calledWith('visibilityChanged', true);
    });

    it('should handle ms events', function() {
        $document[0].addEventListener.withArgs('msvisibilitychange').callArg(1);
        $rootScope.$broadcast.should.have.been.calledWith('visibilityChanged', false);

        $document[0].msHidden = true;
        $document[0].addEventListener.withArgs('msvisibilitychange').callArg(1);
        $rootScope.$broadcast.should.have.been.calledWith('visibilityChanged', true);
    });


});