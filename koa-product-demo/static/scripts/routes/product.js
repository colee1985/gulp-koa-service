angular.module('SuMaiTong').config(['$stateProvider', '$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.when('/product', '/product/admin');
	$stateProvider.state('product', {
		url: "/product",
		views: {
			"container": { templateUrl: "templates/product/product_layout.html" }
		}
	}).state('product.admin', {
		url: "/admin?page&subject&postCategryId",
		views: {
			"container": { templateUrl: "templates/product/product_admin.html" }
		}
	}).state('product.create', {
		url: "/create",
		views: {
			"container": { templateUrl: "templates/product/product_update.html" }
		}
	}).state('product.update', {
		url: "/update/:_id",
		views: {
			"container": { templateUrl: "templates/product/product_update.html" }
		}
	}).state('product.detail', {
		url: "/detail",
		views: {
			"container": { templateUrl: "templates/product/product_update.html" }
		}
	});
}]);