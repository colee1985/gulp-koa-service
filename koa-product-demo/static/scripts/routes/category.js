angular.module('SuMaiTong').config(['$stateProvider', '$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.when('/category', '/category/admin');
	$stateProvider.state('category', {
		url: "/category",
		views: {
			"container": { templateUrl: "templates/category/category_layout.html" }
		}
	}).state('category.admin', {
		url: "/admin",
		views: {
			"container": { templateUrl: "templates/category/category_admin.html" }
		}
	}).state('category.attrconfig', {
		url: "/attrconfig/:cateId",
		views: {
			"container": { templateUrl: "templates/category/category_attr_config.html" }
		}
	});
}]);