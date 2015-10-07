
angular.module('SuMaiTong').controller('MyproductAdminCtrl', ['$scope', '$state', 'ApiManage', '$q', 'KtPager', 'KtAlert',
function ($scope, $state, ApiManage, $q, KtPager, KtAlert) {

	var q = JSON.parse($state.params.q||'{}');
	$scope.KtPager = new KtPager(10, 8);
	$scope.search = {
		query:q.query,
		page: q.page||1,
		postCategryId: q.postCategryId||null
	};
	$scope.KtPager.cur_page = $scope.search.page;
	$scope.products = [];
	var getList = ApiManage.get('Myproduct.getList', $scope.search).then(function(res){
		$scope.products = res.products;
		$scope.KtPager.setTotal(res.total);
	}).then(function(){
		var reqs=[];
		_.each($scope.products, function(product){
			reqs.push(ApiManage.get('Ali1688.findOne', {_id: product.source_of_ali1688_id||'xxx'}).then(function(res){
				product.source_of_ali1688 = res;
			}));
		});
		return $q.all(reqs);
	});
	$scope.KtPager.onSelected = function(page){
		$scope.search.page = page;
		$state.go('myproduct.admin', {q: JSON.stringify($scope.search)});
	};
	// 搜索
	$scope.toSearch = function(){
		$scope.search.page = 1;
		$state.go('myproduct.admin', {q: JSON.stringify($scope.search)});
	};

	// 生成速卖通数据
	$scope.createAliexpress = function(product){
		return $q.when(DB.objectStore('cache_data').get('aliexpressauthInfo')).then(function(res){
			return ApiManage.get('createAliexpressByMyproduct.createAliexpress', product._id, res.access_token);
		}).then(function(res){
			product.aliexpress_id = res._id;
			product.aliexpress = res;
			KtAlert.success('生成成功');
		});
		
	};
	$scope.save = function(product){
		ApiManage.post('Myproduct.update', {_id:product._id}, angular.copy(product)).then(function(res){
			KtAlert.success('保存成功');
			$state.reload();
			console.log(res);
		});
	};
	// SMT数据保存
	$scope.aliexpressSave = function(aliexpress){
		return ApiManage.post('Aliexpress.update', {_id: aliexpress._id}, aliexpress)
		.then(function(res){
			if(!res._id){
				return KtAlert.error('保存出错');
			}
			aliexpress.productId = res.productId;
			KtAlert.success('保存成功');
		});
	};
	// 更新或发布到SMT线上
	$scope.aliexpressPut = function(aliexpress){
		return $q.when(DB.objectStore('cache_data').get('aliexpressauthInfo')).then(function(res){
			return ApiManage.post('Aliexpress.putProduct', aliexpress._id, res.access_token);
		}).then(function(res){
			console.log(res);
			if(!res._id){
				return KtAlert.error('发布出错');
			}
			aliexpress.productId = res.productId;
			KtAlert.success('发布成功');
		});
	};

	// 自动发布列表中的数据
	function eachPut(i){
		console.log('处理 '+i);
		if($scope.products[i]){
			var product = $scope.products[i];
			$q.when().then(function(){
				if(product.aliexpress && product.aliexpress._id){
					return ;
				}
				return $scope.createAliexpress(product);
			}).then(function(){
				if(product.aliexpress && !product.aliexpress.productId && product.source_of_ali1688.memberId=='sll0510'){
					return $scope.aliexpressPut(product);
				}
			}).then(function(){
				eachPut(i+1);
			}).finally();
		}else{
			console.log('自动处理完成');
			KtAlert.warning('自动处理完成');
			$scope.search.page++;
			// $state.go('myproduct.admin', $scope.search);
		}
	}
	getList.then(function(){
		// eachPut(0);
	}).finally();
}]);