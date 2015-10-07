
angular.module('SuMaiTong').controller('ProductAdminCtrl', ['$scope', '$state', 'ApiManage', '$q', 'KtPager', 'KtAlert',
function ($scope, $state, ApiManage, $q, KtPager, KtAlert) {

	$scope.KtPager = new KtPager(10, 8);
	$scope.search = {
		page: $state.params.page||1,
		subject: $state.params.subject||'',
		postCategryId: $state.params.postCategryId||null
	};
	$scope.KtPager.cur_page = $scope.search.page;
	$scope.products = [];
	ApiManage.get('Product.getList', $scope.search).then(function(res){
		$scope.products = res.products;
		$scope.KtPager.setTotal(res.total);
	});
	$scope.KtPager.onSelected = function(page){
		$scope.search.page = page;
		$state.go('product.admin', $scope.search);
	};
	// 搜索
	$scope.toSearch = function(){
		$scope.search.page = 1;
		$state.go('product.admin', $scope.search);
	};

	// 创建SMT产品信息
	$scope.createSmt = function(product, index){
		ApiManage.get('AutoCreateAliexpressBy1688.run', product._id).then(function(res){
			console.log(res);
			angular.forEach(res, function(v, k){
				product[k] = v;
			});
		});
	};

	// PUT到SMT
	$scope.put = function(product){
		var access_token;
		$q.when(DB.objectStore('cache_data').get('aliexpressauthInfo')).then(function(res){
			access_token = res.access_token;
			if(product.aliexpress_productId){
				return product;
			}
			console.log('正在上传图片');
			return ApiManage.post('Product.uploadImages', product._id, access_token);
		}).then(function(res){
			return ApiManage.post('Product.putProduct', product._id, access_token);
		}).then(function(res){
			console.log(res);
			if(res.error){
				if(res.error.error_code=="13001024"){
					product.aliexpress_productId = '';
					ApiManage.post('Product.bindAliexpressId', product._id, product.aliexpress_productId);
				}
				return KtAlert.error(res.error.error_message);
			}
			angular.forEach(res, function(v, k){
				product[k] = v;
			});
			KtAlert.success('发布成功');
		}).catch(function(err){
			return KtAlert.error(res);
			console.log('err:', err);
		});
	};

	// 绑定ID
	$scope.bindSmtId = function(product){
		return ApiManage.post('Product.bindAliexpressId', product._id, product.aliexpress_productId);
	};
	
}]);