
angular.module('SuMaiTong').controller('Ali1688AdminCtrl', ['$scope', '$state', 'ApiManage', '$q', 'KtPager', 'KtAlert',
function ($scope, $state, ApiManage, $q, KtPager, KtAlert) {

	$scope.KtPager = new KtPager(10, 8);
	$scope.search = {
		page: $state.params.page||1,
		subject: $state.params.subject||'',
		postCategryId: $state.params.postCategryId||null
	};
	$scope.KtPager.cur_page = $scope.search.page;
	$scope.products = [];
	ApiManage.get('ali1688.getList', $scope.search).then(function(res){
		$scope.products = res.products;
		$scope.KtPager.setTotal(res.total);
	});
	$scope.KtPager.onSelected = function(page){
		$scope.search.page = page;
		$state.go('ali1688.admin', $scope.search);
	};
	// 搜索
	$scope.toSearch = function(){
		$scope.search.page = 1;
		$state.go('ali1688.admin', $scope.search);
	};

	// 加入我的产品库
	$scope.addToMyproduct = function(product){
		ApiManage.get('Myproduct.createByAli1688Id', product._id).then(function(res){
			console.log(res);
		});
	};

	// 重新采集
	$scope.regether = function(product){
		ApiManage.get('Ali1688.getherDataBy1688Id', product.offerId).then(function(res){
			console.log(res);
			angular.forEach(res, function(v, k){
				product[k] = v;
			});
		});
	};
	
}]);