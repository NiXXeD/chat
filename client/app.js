angular.module('chat', [
    'ngSanitize',
    'LocalStorageModule'
])
    .config(function(localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('');
    });