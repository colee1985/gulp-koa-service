angular.module('SuMaiTong').config(['$stateProvider', '$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
	$stateProvider.state('user', {
		url: "/user",
		views: {
			"appContainer": { templateUrl: "templates/layouts/user_layout.html" }
		}
	}).state('user.login', {
		url: "/login",
		views: {
			"container": { templateUrl: "templates/user_login.html" }
		}
	}).state('user.signup', {
		url: "/signup/:id",
		views: {
			"container": { templateUrl: "templates/user_signup.html" }
		}
	});
}]);