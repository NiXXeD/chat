angular.module('chat', [
    'ngSanitize',
    'LocalStorageModule'
])
    .config(function(localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('');
    })
    .run(function(visibilityService) {
        visibilityService.load();
    });