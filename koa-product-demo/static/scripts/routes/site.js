angular.module('SuMaiTong').config(['$stateProvider', '$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
	$stateProvider.state('site', {
		url: "/site",
		views: {
			"container": { templateUrl: "templates/dashboard.html" }
		}
	});
}]);