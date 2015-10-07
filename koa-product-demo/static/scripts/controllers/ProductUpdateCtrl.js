angular.module('SuMaiTong').controller('ProductUpdateCtrl', ['$scope', '$state', 'ApiManage', '$q', function ($scope, $state, ApiManage, $q) {

	$scope.product = {};
	ApiManage.get('Product.detail', $state.params._id).then(function(res){
		console.log(res);
		$scope.product = res;
		$scope.setEdit(res.aliexpress_zh);
	});

	// 绑定ID
	$scope.bindSmtId = function(product){
		return ApiManage.post('Product.bindAliexpressId', product._id, product.aliexpress_productId);
	};
	
	$scope.setEdit = function(data){
		$scope.$broadcast('edit.product', data);
	};

	// 打开速卖通编辑
	$scope.windowEdit = function(product){
		var url = 'http://posting.aliexpress.com/wsproduct/edit_wholesale_product.htm?productId='+product.aliexpress_en.productId;
		var edit_window = window.open(url);
		edit_window.window.location.href = (url);
	};
}]);