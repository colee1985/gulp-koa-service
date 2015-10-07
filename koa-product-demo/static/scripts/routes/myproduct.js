angular.module('SuMaiTong').config(['$stateProvider', '$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.when('/myproduct', '/myproduct/admin');
	$stateProvider.state('myproduct', {
		url: "/myproduct",
		views: {
			"container": { templateUrl: "templates/myproduct/layout.html" }
		}
	}).state('myproduct.admin', {
		url: "/admin?q",
		views: {
			"container": { templateUrl: "templates/myproduct/admin.html" }
		}
	}).state('myproduct.create', {
		url: "/create",
		views: {
			"container": { templateUrl: "templates/myproduct/update.html" }
		}
	}).state('myproduct.update', {
		url: "/update/:_id",
		views: {
			"container": { templateUrl: "templates/myproduct/update.html" }
		}
	}).state('myproduct.detail', {
		url: "/detail",
		views: {
			"container": { templateUrl: "templates/myproduct/update.html" }
		}
	});
}]);