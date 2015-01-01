angular.module('chat')
    .service('visibilityService', function($rootScope, $document) {
        var visibilityService = {};

        visibilityService.load = function() {
            $document[0].addEventListener('visibilitychange', changed);
            $document[0].addEventListener('webkitvisibilitychange', changed);
            $document[0].addEventListener('msvisibilitychange', changed);
        };

        function changed() {
            $rootScope.$broadcast('visibilityChanged', $document[0].hidden || $document[0].webkitHidden || $document[0].mozHidden || $document[0].msHidden)
        }

        return visibilityService;
    });