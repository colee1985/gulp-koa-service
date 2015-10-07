angular.module('SuMaiTong').config(['$stateProvider', '$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.when('/ali1688', '/ali1688/admin');
	$stateProvider.state('ali1688', {
		url: "/ali1688",
		views: {
			"container": { templateUrl: "templates/ali1688/layout.html" }
		}
	}).state('ali1688.gather', {
		url: "/gather",
		views: {
			"container": { templateUrl: "templates/ali1688/gather.html" }
		}
	}).state('ali1688.admin', {
		url: "/admin?page&subject&postCategryId",
		views: {
			"container": { templateUrl: "templates/ali1688/admin.html" }
		}
	});
}]);