angular.module('SuMaiTong').config(['$stateProvider', '$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.when('/aliexpress', '/aliexpress/admin');
	$stateProvider.state('aliexpress', {
		url: "/aliexpress",
		views: {
			"container": { templateUrl: "templates/aliexpress/layout.html" }
		}
	}).state('aliexpress.admin', {
		url: "/admin?q",
		views: {
			"container": { templateUrl: "templates/aliexpress/admin.html" }
		}
	}).state('aliexpress.create', {
		url: "/create",
		views: {
			"container": { templateUrl: "templates/aliexpress/update.html" }
		}
	}).state('aliexpress.update', {
		url: "/update/:_id",
		views: {
			"container": { templateUrl: "templates/aliexpress/update.html" }
		}
	}).state('aliexpress.detail', {
		url: "/detail",
		views: {
			"container": { templateUrl: "templates/aliexpress/update.html" }
		}
	});
}]);