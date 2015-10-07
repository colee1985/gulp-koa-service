
angular.module('SuMaiTong', [
	'pascalprecht.translate',
	'ngSanitize',
	'ui.router',
	'ngMessages',
	'Ali1688Sdk',
	'AliexpressSdk'
]).config(['$locationProvider', '$urlRouterProvider', '$translateProvider', function($locationProvider, $urlRouterProvider, $translateProvider) {
	// html5Mode需要服务端配合指向
	// $locationProvider.html5Mode(true).hashPrefix('!');
	$urlRouterProvider.otherwise("/site");
}]);